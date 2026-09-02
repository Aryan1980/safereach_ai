import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `You are the SafeReach AI Assistant, an empathetic, highly trained, and vigilant personal safety and emergency advisor dedicated to women's safety, situational awareness, and crisis navigation.

PRIMARY DIRECTIVES:
1. IMMEDIATE DANGER TRIAGE:
   - If the user reports an immediate active emergency (e.g. being actively followed, cornered, attacked, in an unauthorized vehicle deviation, or domestic assault), your VERY FIRST line must be bold and prominent:
     "🚨 IF YOU ARE IN IMMEDIATE DANGER, CALL 112 (National Emergency) OR 181 (Women Helpline) IMMEDIATELY."
   - Give 2-3 instant, tactical, zero-delay physical survival steps (e.g., move towards brightly lit public shops/metro stations, make loud verbal noise/draw bystander attention, enter any open pharmacy/store and state you need assistance, do not stop in dark alleys).

2. TACTICAL, CALM, ACTIONABLE GUIDANCE:
   - Provide concrete, step-by-step guidance formatted with clear bullet points.
   - For cab/auto transit: suggest sharing live ride links, pretending to be on an active phone call mentioning the driver's vehicle number, asking the driver to stop at a crowded petrol pump/police booth.
   - For solo travel / night walking: suggest path selection, holding keys between knuckles, body posture, avoiding wearing two earbuds simultaneously.
   - For online/digital harassment: evidence preservation (timestamps, uncropped screenshots, URL archiving) and reporting to the Cyber Crime Helpline (1930) or cybercrime.gov.in.

3. TONE & MANNER:
   - Calm, empowering, protective, respectful, and crystal clear.
   - Avoid generic fluff or boilerplate filler.
   - Prioritize quick readability for high-stress situations.

4. EMERGENCY NUMBERS REFERENCE:
   - All-in-One Emergency: 112
   - Women Helpline (24/7): 181
   - Women in Distress: 1091
   - Ambulance/Medical: 108
   - Cyber Crime: 1930`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, userLocation } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return safe, high-quality rule-based safety response if API key is not configured
      const latestUserMsg = messages[messages.length - 1]?.content || '';
      return NextResponse.json({
        message: generateFallbackSafetyResponse(latestUserMsg),
        isFallback: true,
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format conversation history for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    let locationContext = '';
    if (userLocation && userLocation.lat && userLocation.lng) {
      locationContext = `\n[Context: User is currently near coordinates Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)}${userLocation.address ? ` (${userLocation.address})` : ''}]`;
    }

    // Try gemini-3.7-flash first, fallback to gemini-2.5-flash
    let responseText = '';
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION + locationContext,
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      });
      responseText = response.text || '';
    } catch (primaryErr) {
      console.warn('Primary model gemini-3.7-flash failed, trying gemini-2.5-flash:', primaryErr);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION + locationContext,
          temperature: 0.3,
          maxOutputTokens: 1024,
        },
      });
      responseText = fallbackResponse.text || '';
    }

    return NextResponse.json({
      message: responseText,
      isFallback: false,
    });
  } catch (error: unknown) {
    console.error('API /api/chat error:', error);
    return NextResponse.json(
      {
        message:
          '🚨 **Safety Notice**: If you are in immediate danger, please dial **112** (Emergency) or **181** (Women Helpline) immediately.\n\nKey Safety Actions:\n- Head towards the nearest open business, store, or well-lit public area.\n- Use the Safe Places tab to navigate to the nearest police station or 24/7 hospital.\n- Tap Emergency SOS on the top navigation to alert your trusted contact via WhatsApp.',
        error: (error as Error).message,
        isFallback: true,
      },
      { status: 200 }
    );
  }
}

function generateFallbackSafetyResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('follow') || q.includes('stalk') || q.includes('danger') || q.includes('scared') || q.includes('unsafe') || q.includes('help')) {
    return `🚨 **IMMEDIATE ACTION REQUIRED**

If you feel you are in immediate danger:
1. **Call 112 (National Emergency)** or **181 (Women Helpline)** right now.
2. **Move towards crowd/light**: Cross the street and head into the nearest open shop, restaurant, pharmacy, or metro station.
3. **Trigger SOS**: Click the red **Emergency SOS** button in the top bar to send your live GPS location to your trusted contact via WhatsApp.
4. **Do not go to secluded areas**: Avoid shortcuts, dark alleys, or isolated parking lots.
5. **Draw attention**: If approached, speak loudly and firmly: *"Back away! Do not follow me!"* to alert people nearby.`;
  }

  if (q.includes('cab') || q.includes('uber') || q.includes('auto') || q.includes('taxi') || q.includes('ride')) {
    return `🚖 **Cab & Transit Safety Checklist**

1. **Verify Before Boarding**: Always match the vehicle license number, make/model, and driver photo in the app before getting in.
2. **Share Live Trip**: Use your ride app's "Share Trip" feature and SafeReach AI's Emergency SOS to send your live location.
3. **Check Child Locks**: Check the rear door lock before closing. Ensure window controls work.
4. **Active Route Monitoring**: Keep your navigation open (Google Maps / Safe Places) to notice any route deviations.
5. **Decoy Phone Call**: Make an audible call: *"Hey, I just boarded cab [Number]. I'm sharing my live location now. I'll reach in 15 minutes."*
6. **If Route Deviates**: Demand firmly: *"Please stop here immediately, this is not my route."* If they refuse, call **112** and trigger your SOS siren.`;
  }

  return `🛡️ **SafeReach AI Safety Guidance**

Your safety is the top priority. Here is what you can do right now:
- **Locate Nearby Safe Havens**: Go to the **Safe Places** tab to view the nearest police stations, 24/7 hospitals, and pharmacies on the interactive map.
- **Emergency Dispatch**: Setup your **Trusted Contact** in the Emergency section so you can transmit live GPS coordinates in one tap via WhatsApp.
- **24/7 Emergency Helplines**:
  - 🚓 **112**: All Emergency Services
  - 👩 **181**: Women's Helpline
  - 🚑 **108**: Medical Ambulance
  - 🛡️ **1091**: Women in Distress
  - 💻 **1930**: Cyber Crime Helpline

Tell me more about your specific situation (e.g. night travel, cab verification, walking home, emergency prep), and I will provide immediate tactical guidance.`;
}

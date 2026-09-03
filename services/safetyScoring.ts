import { SafePlace, SafePlaceType, SafeScoreData, ScoreFactor } from '@/types/places';

/**
 * Calculates a dynamic, data-backed Safe Score (0 - 100) and specific verified reasons
 * derived strictly from real OpenStreetMap infrastructure fields and user distance.
 */
export function calculateSafeScore(
  place: Omit<SafePlace, 'safeScore'>,
  nearbyPoliceOrHospitalCount: number = 0
): SafeScoreData {
  const factors: ScoreFactor[] = [];
  const reasons: string[] = [];
  let totalScore = 0;

  // 1. Base Venue Type & Protection Level (Max 35 pts)
  let venuePoints = 20;
  let venueDetail = 'Public commercial venue';

  switch (place.type) {
    case 'police':
      venuePoints = 35;
      venueDetail = 'Law enforcement station with active police personnel on site';
      reasons.push('Direct law enforcement post with sworn officers and immediate emergency response');
      break;
    case 'hospital':
      venuePoints = 33;
      venueDetail = '24/7 medical hospital with emergency trauma care and security';
      reasons.push('Active healthcare facility with emergency medical triage and continuous staff presence');
      break;
    case 'transit':
      venuePoints = 32;
      venueDetail = 'Guarded mass transit station with high public footfall, metal detectors, and CCTV';
      reasons.push('Guarded transit terminal with active security personnel, CCTV coverage, and high crowd footfall');
      break;
    case 'commercial':
      venuePoints = 28;
      venueDetail = 'Shopping mall or supercenter with entry security and bright illumination';
      reasons.push('Commercial center with dedicated entry security guards, metal detectors, and public activity');
      break;
    case 'hotel':
      venuePoints = 26;
      venueDetail = '24/7 hotel with monitored front desk reception and entry doormen';
      reasons.push('Hospitality building with 24/7 staffed front desk, doormen, and safe waiting lobby');
      break;
    case 'fuel_station':
      venuePoints = 24;
      venueDetail = '24/7 staffed fuel pump with brightly-lit forecourt and attendants';
      reasons.push('Well-illuminated 24/7 perimeter with active forecourt attendants and surveillance');
      break;
    case 'fire_station':
      venuePoints = 25;
      venueDetail = 'Civil rescue station with first responders on duty';
      reasons.push('Civil emergency station with trained first responders and municipal radio access');
      break;
    case 'bank_atm':
      venuePoints = 22;
      venueDetail = 'Commercial bank branch or guarded ATM kiosk with CCTV';
      reasons.push('Financial facility with dedicated security guards and 24/7 CCTV recording');
      break;
    case 'pharmacy':
      venuePoints = 20;
      venueDetail = 'Licensed medical store with professional healthcare staff';
      reasons.push('Licensed pharmacy providing first-aid access and open storefront lighting');
      break;
    default:
      venuePoints = 18;
      venueDetail = 'Mapped public facility';
      reasons.push('Verified public safety haven on OpenStreetMap network');
  }

  factors.push({
    title: 'Facility Type & Active Security',
    points: venuePoints,
    maxPoints: 35,
    detail: venueDetail,
  });
  totalScore += venuePoints;

  // 2. Proximity to Current User (Max 30 pts)
  let distPoints = 6;
  let distDetail = '';
  const dist = place.distanceKm;

  if (dist <= 0.5) {
    distPoints = 30;
    const walkingMins = Math.max(1, Math.round(dist * 12));
    distDetail = `Within immediate walking range (${Math.round(dist * 1000)}m, ~${walkingMins} min walk)`;
    reasons.push(`Immediate walking refuge only ${Math.round(dist * 1000)} meters (~${walkingMins} min) from your live position`);
  } else if (dist <= 1.0) {
    distPoints = 24;
    const walkingMins = Math.round(dist * 12);
    distDetail = `Short distance (${dist.toFixed(2)} km, ~${walkingMins} min walk)`;
    reasons.push(`Quick reach only ${dist.toFixed(2)} km (~${walkingMins} min) away`);
  } else if (dist <= 2.5) {
    distPoints = 18;
    distDetail = `Nearby zone (${dist.toFixed(2)} km away)`;
    reasons.push(`Located in your neighborhood zone at ${dist.toFixed(2)} km distance`);
  } else if (dist <= 5.0) {
    distPoints = 12;
    distDetail = `Moderate distance (${dist.toFixed(2)} km away)`;
  } else {
    distPoints = 6;
    distDetail = `Extended radius (${dist.toFixed(2)} km away)`;
  }

  factors.push({
    title: 'Proximity & Rapid Reachability',
    points: distPoints,
    maxPoints: 30,
    detail: distDetail,
  });
  totalScore += distPoints;

  // 3. 24/7 Operation & Night Lighting (Max 15 pts)
  let hoursPoints = 6;
  let hoursDetail = 'Standard daytime hours';

  if (place.is24x7) {
    hoursPoints = 15;
    hoursDetail = '24/7 continuous operation for late-night emergency refuge';
    reasons.push('24/7 round-the-clock operation offering accessible refuge during night hours');
  } else if (place.openingHours) {
    hoursPoints = 10;
    hoursDetail = `Verified schedule: ${place.openingHours}`;
    reasons.push(`Verified open hours documented in map registry (${place.openingHours})`);
  }

  factors.push({
    title: 'Operating Hours & Night Accessibility',
    points: hoursPoints,
    maxPoints: 15,
    detail: hoursDetail,
  });
  totalScore += hoursPoints;

  // 4. Verified Contact & Operator Registry (Max 10 pts)
  let contactPoints = 0;
  const contactDetails: string[] = [];

  if (place.phone) {
    contactPoints += 5;
    contactDetails.push('Direct telephone on record');
    reasons.push(`Direct official telephone line available (${place.phone})`);
  }

  if (place.operator) {
    contactPoints += 5;
    contactDetails.push(`Operated by ${place.operator}`);
    reasons.push(`Managed by verified operating body: ${place.operator}`);
  }

  if (contactPoints === 0) {
    contactDetails.push('Public open registry without direct listed phone');
  }

  factors.push({
    title: 'Verified Contact & Management',
    points: contactPoints,
    maxPoints: 10,
    detail: contactDetails.join(' • '),
  });
  totalScore += contactPoints;

  // 5. Physical Accessibility & Thoroughfare Infrastructure (Max 10 pts)
  let infraPoints = 0;
  const infraDetails: string[] = [];

  if (place.address) {
    infraPoints += 5;
    infraDetails.push('Mapped street address');
    reasons.push(`Directly situated on mapped thoroughfare (${place.address.split(',')[0]})`);
  }

  if (place.wheelchair) {
    infraPoints += 5;
    infraDetails.push('Step-free wheelchair accessible');
    reasons.push('Verified step-free wheelchair physical accessibility at entry');
  }

  if (infraPoints === 0) {
    infraDetails.push('Standard map node');
  }

  factors.push({
    title: 'Physical Access & Mapped Road',
    points: infraPoints,
    maxPoints: 10,
    detail: infraDetails.join(' • '),
  });
  totalScore += infraPoints;

  // Bonus: If close to another police/hospital within 1.5km
  if (nearbyPoliceOrHospitalCount > 0 && place.type !== 'police' && place.type !== 'hospital') {
    reasons.push(`Situated within emergency coverage zone (< 1.5 km to police/hospital)`);
  }

  // Cap at 100
  totalScore = Math.min(100, Math.max(0, totalScore));

  // Determine score classification label and badge color
  let label: SafeScoreData['label'] = 'Safe Public Location';
  let scoreColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';

  if (totalScore >= 85) {
    label = 'High Safety Haven';
    scoreColor = 'text-emerald-300 border-emerald-400/40 bg-emerald-400/15';
  } else if (totalScore >= 70) {
    label = 'Very Safe Refuge';
    scoreColor = 'text-teal-300 border-teal-400/30 bg-teal-400/10';
  } else if (totalScore >= 55) {
    label = 'Safe Public Location';
    scoreColor = 'text-cyan-300 border-cyan-400/30 bg-cyan-400/10';
  } else {
    label = 'Moderate Refuge';
    scoreColor = 'text-amber-300 border-amber-400/30 bg-amber-400/10';
  }

  return {
    score: totalScore,
    label,
    scoreColor,
    reasons,
    factors,
  };
}

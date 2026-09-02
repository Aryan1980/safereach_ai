'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2, Star, Phone, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TrustedContact } from '@/types/contact';
import { 
  getTrustedContacts, 
  addOrUpdateContact, 
  deleteContact 
} from '@/services/contactsStorage';
import { validateAndFormatPhone } from '@/utils/phoneValidator';

export default function TrustedContacts() {
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Parent');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setContacts(getTrustedContacts());
  }, []);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!name.trim()) {
      setValidationError('Please enter a name for the contact.');
      return;
    }

    const phoneValidation = validateAndFormatPhone(phone);
    if (!phoneValidation.isValid) {
      setValidationError(phoneValidation.error || 'Please enter a valid 10-digit mobile number.');
      return;
    }

    const newContact: TrustedContact = {
      id: `contact_${Date.now()}`,
      name: name.trim(),
      phone: phoneValidation.cleanNumber,
      relationship,
      isPrimary: contacts.length === 0,
      createdAt: Date.now(),
    };

    const updated = addOrUpdateContact(newContact);
    setContacts(updated);
    setName('');
    setPhone('');
    setIsAdding(false);
    setSuccessMessage(`Saved ${newContact.name} as trusted emergency contact.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDelete = (id: string, contactName: string) => {
    if (confirm(`Remove ${contactName} from your trusted emergency contacts?`)) {
      const updated = deleteContact(id);
      setContacts(updated);
    }
  };

  const handleSetPrimary = (contact: TrustedContact) => {
    const updated = addOrUpdateContact({ ...contact, isPrimary: true });
    setContacts(updated);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-white/[0.08]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest2 uppercase text-zinc-500 block">
            CONTACT REGISTRY
          </span>
          <h3 className="text-xl font-extrabold text-white tracking-tight mt-1">
            Trusted Emergency Circle
          </h3>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Emergency alerts and real-time coordinate pins will be dispatched to these numbers.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 bg-white hover:bg-zinc-200 text-black font-mono text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all self-start sm:self-auto"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>ADD CONTACT</span>
          </button>
        )}
      </div>

      {successMessage && (
        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3 rounded-xl text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Add Contact Form */}
      {isAdding && (
        <form onSubmit={handleSaveContact} className="bg-black/60 border border-white/[0.08] rounded-2xl p-5 space-y-4 font-mono text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider">Add Trusted Recipient</h4>

          {validationError && (
            <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Name</label>
              <input
                type="text"
                placeholder="e.g. Mom, Rahul, Priya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">WhatsApp Phone</label>
              <input
                type="tel"
                placeholder="e.g. 9876543210 or +91..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">Relation</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white/30"
              >
                <option value="Parent">Parent / Guardian</option>
                <option value="Partner">Partner / Spouse</option>
                <option value="Sibling">Sibling</option>
                <option value="Friend">Close Friend</option>
                <option value="Colleague">Colleague / Roommate</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 font-mono">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setValidationError(null);
              }}
              className="px-4 py-2 text-zinc-500 hover:text-white uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-white hover:bg-zinc-200 text-black font-bold px-5 py-2 rounded-xl transition-all uppercase tracking-wider"
            >
              Save Contact
            </button>
          </div>
        </form>
      )}

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <div className="text-center py-10 px-4 border border-dashed border-white/[0.08] rounded-2xl bg-white/[0.01]">
          <UserPlus className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-xs font-mono font-bold uppercase text-zinc-300">No Contacts Configured</p>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 font-light">
            Add at least one close contact (family member or trusted friend) so you can trigger instant WhatsApp emergency alerts.
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 inline-flex items-center space-x-1.5 bg-white hover:bg-zinc-200 text-black font-mono text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider transition-all"
          >
            <span>ADD FIRST CONTACT</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
          {contacts.map((contact) => {
            const formatted = validateAndFormatPhone(contact.phone);
            return (
              <div
                key={contact.id}
                className={`glass-panel rounded-2xl p-5 flex flex-col justify-between border transition-all ${
                  contact.isPrimary
                    ? 'border-white/30 bg-white/[0.04]'
                    : 'border-white/[0.06] hover:border-white/15'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-white">{contact.name}</h4>
                        {contact.isPrimary && (
                          <span className="border border-white/20 bg-white/[0.08] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <Star className="w-2.5 h-2.5 fill-white" />
                            <span>PRIMARY</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5 font-sans">{contact.relationship}</p>
                    </div>

                    <button
                      onClick={() => handleDelete(contact.id, contact.name)}
                      className="text-zinc-600 hover:text-rose-400 p-1 rounded-lg transition-colors"
                      title="Remove contact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center space-x-2 text-xs text-zinc-300">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{formatted.formattedDisplay || contact.phone}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
                  {!contact.isPrimary ? (
                    <button
                      onClick={() => handleSetPrimary(contact)}
                      className="text-zinc-500 hover:text-white uppercase flex items-center space-x-1"
                    >
                      <Star className="w-3 h-3" />
                      <span>SET AS PRIMARY</span>
                    </button>
                  ) : (
                    <span className="text-emerald-400 uppercase">ACTIVE SOS TARGET</span>
                  )}

                  <a
                    href={`https://api.whatsapp.com/send?phone=${formatted.cleanNumber}&text=${encodeURIComponent('SafeReach AI: I have configured you as my trusted emergency contact.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-zinc-300 hover:text-white font-bold bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-lg transition-colors uppercase"
                  >
                    <MessageSquare className="w-3 h-3 text-zinc-400" />
                    <span>TEST WHATSAPP</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

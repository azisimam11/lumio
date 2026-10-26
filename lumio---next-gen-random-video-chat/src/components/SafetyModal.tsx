import React, { useState } from 'react';
import { AlertOctagon, X, Check, ShieldAlert, Ban } from 'lucide-react';
import { ReportReason } from '../types';

interface SafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerName: string;
  onSubmitReport: (reason: ReportReason, details: string, blockUser: boolean) => void;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({
  isOpen,
  onClose,
  partnerName,
  onSubmitReport,
}) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason>('inappropriate_video');
  const [details, setDetails] = useState('');
  const [blockUser, setBlockUser] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const reasons: { id: ReportReason; label: string; desc: string }[] = [
    {
      id: 'inappropriate_video',
      label: 'Nudity or Inappropriate Video',
      desc: 'Sexually suggestive, explicit, or offensive video broadcast',
    },
    {
      id: 'harassment',
      label: 'Harassment or Verbal Abuse',
      desc: 'Threats, bullying, insults, or aggressive behavior',
    },
    {
      id: 'underage',
      label: 'Suspected Underage User (<18)',
      desc: 'Users who appear to be under the minimum required age of 18',
    },
    {
      id: 'hate_speech',
      label: 'Hate Speech & Discrimination',
      desc: 'Racism, hate symbols, or discriminatory slurs',
    },
    {
      id: 'spam_commercial',
      label: 'Spam, Bots or Commercial Promotion',
      desc: 'Unsolicited advertising, automated broadcast, or suspicious links',
    },
    {
      id: 'other',
      label: 'Other Community Violations',
      desc: 'Any other violation of Lumio Community Standards',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(selectedReason, details, blockUser);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B14]/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0D1220] border border-[#FB7185]/40 rounded-3xl p-6 shadow-2xl text-[#F4F7FF]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#121A2A] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#121A2A] text-[#34D399] flex items-center justify-center border border-[#34D399]/40">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-lg font-semibold text-[#F4F7FF]">Report Submitted</h3>
            <p className="text-xs text-[#A5B1C7] max-w-sm mx-auto">
              Thank you for keeping Lumio safe. The user has been disconnected and logged for review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-[#253148] pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#121A2A] text-[#FB7185] flex items-center justify-center border border-[#FB7185]/30 shrink-0">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#F4F7FF]">Report or Block User</h3>
                <p className="text-xs text-[#A5B1C7]">
                  Target: <span className="text-[#F4F7FF] font-medium">{partnerName || 'Current Stranger'}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#A5B1C7]">
                Reason for report:
              </label>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {reasons.map((r) => (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setSelectedReason(r.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-start justify-between cursor-pointer ${
                      selectedReason === r.id
                        ? 'border-[#FB7185] bg-[#192438] text-[#F4F7FF]'
                        : 'border-[#253148] bg-[#121A2A] text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#192438]'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-[#F4F7FF]">{r.label}</div>
                      <div className="text-[11px] text-[#748198] mt-0.5">{r.desc}</div>
                    </div>
                    {selectedReason === r.id && (
                      <span className="w-4 h-4 rounded-full bg-[#FB7185] text-black flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#A5B1C7] mb-1 block">
                Additional details (optional):
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide any context that will help our trust & safety team review this incident..."
                rows={2}
                className="w-full text-xs bg-[#121A2A] border border-[#253148] rounded-xl p-3 text-[#F4F7FF] placeholder-[#748198] focus:outline-none focus:border-[#1769FF] resize-none"
              />
            </div>

            <div className="pt-1 border-t border-[#253148] flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A5B1C7]">
                <input
                  type="checkbox"
                  checked={blockUser}
                  onChange={(e) => setBlockUser(e.target.checked)}
                  className="rounded border-[#253148] bg-[#121A2A] text-[#FB7185] focus:ring-0"
                />
                <span className="flex items-center gap-1.5 text-[#F4F7FF]">
                  <Ban className="w-3.5 h-3.5 text-[#FB7185]" />
                  Block this user permanently
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#121A2A] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#FB7185] hover:bg-[#FB7185]/90 text-black shadow-lg transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                Submit Report & Disconnect
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

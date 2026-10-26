import React, { useState } from 'react';
import { X, Volume2, Sparkles, Plus, Hash } from 'lucide-react';
import { CreateLoungePayload } from '../../types';
import { MOCK_INTERESTS } from '../../data/mockData';

interface CreateLoungeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: CreateLoungePayload) => void;
}

export const CreateLoungeModal: React.FC<CreateLoungeModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(MOCK_INTERESTS[1]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Chill', 'Social']);
  const [isVoiceActive, setIsVoiceActive] = useState(true);

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      description: description.trim() || 'A community lounge on Lumio.',
      category,
      tags: tags.length > 0 ? tags : ['Community'],
      isVoiceActive,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B14]/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0D1220] border border-[#253148] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F4F7FF]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#121A2A] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-3 border-b border-[#253148] pb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#121A2A] text-[#1769FF] flex items-center justify-center border border-[#1769FF]/40">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F4F7FF] font-mono">Create Topic Lounge</h3>
              <p className="text-xs text-[#A5B1C7]">Host your own voice or hangout room</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[#A5B1C7] font-medium block mb-1">Lounge Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Late Night Lo-Fi Code Session"
                required
                className="w-full bg-[#121A2A] border border-[#253148] rounded-xl px-3.5 py-2.5 text-[#F4F7FF] placeholder-[#748198] focus:outline-none focus:border-[#1769FF]"
              />
            </div>

            <div>
              <label className="text-[#A5B1C7] font-medium block mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this lounge about?"
                rows={2}
                className="w-full bg-[#121A2A] border border-[#253148] rounded-xl p-3 text-[#F4F7FF] placeholder-[#748198] focus:outline-none focus:border-[#1769FF] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[#A5B1C7] font-medium block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#121A2A] border border-[#253148] rounded-xl px-3 py-2.5 text-[#F4F7FF] focus:outline-none focus:border-[#1769FF]"
                >
                  {MOCK_INTERESTS.filter((t) => t !== 'All Topics').map((cat) => (
                    <option key={cat} value={cat} className="bg-[#121A2A]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#A5B1C7] font-medium block mb-1">Tags (press Enter)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Add a tag..."
                  className="w-full bg-[#121A2A] border border-[#253148] rounded-xl px-3 py-2.5 text-[#F4F7FF] placeholder-[#748198] focus:outline-none focus:border-[#1769FF]"
                />
              </div>
            </div>

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#121A2A] border border-[#253148] text-[#25D9F8] text-[11px]"
                >
                  #{t}
                  <button type="button" onClick={() => removeTag(t)} className="text-[#748198] hover:text-white">
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Voice stage toggle */}
            <div className="pt-2 border-t border-[#253148] flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[#F4F7FF] font-medium block">Multi-User Audio Stage</span>
                <span className="text-[11px] text-[#A5B1C7]">Allow participants to speak via microphone</span>
              </div>
              <input
                type="checkbox"
                checked={isVoiceActive}
                onChange={(e) => setIsVoiceActive(e.target.checked)}
                className="rounded border-[#253148] text-[#1769FF] w-4 h-4"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#253148]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#A5B1C7] hover:text-[#F4F7FF] hover:bg-[#121A2A] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#1769FF] hover:bg-[#3B82F6] text-white text-xs font-bold tracking-wide shadow-lg shadow-[#1769FF]/30 transition-all cursor-pointer"
            >
              Launch Lounge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

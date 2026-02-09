'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { BeardStyle, BEARD_STYLES } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface BeardSelectorProps {
  selectedBeard: BeardStyle | null;
  onSelectBeard: (beard: BeardStyle | null) => void;
}

// Emoji for each beard style
function getBeardEmoji(id: string): string {
  const emojis: Record<string, string> = {
    'clean-shaven': '😊',
    'stubble': '😎',
    'short-beard': '🧔',
    'full-beard': '🧔‍♂️',
    'goatee': '🎯',
    'van-dyke': '🎨',
    'circle-beard': '⭕',
    'balbo': '🦸',
  };
  return emojis[id] || '🧔';
}

export function BeardSelector({
  selectedBeard,
  onSelectBeard,
}: BeardSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(!!selectedBeard);

  return (
    <div className="space-y-3">
      {/* Collapsible header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between p-4 rounded-xl transition-all',
          'bg-[var(--card-bg)] border',
          selectedBeard
            ? 'border-[var(--accent)]/50'
            : 'border-[var(--card-border)]'
        )}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧔</span>
          <div className="text-left">
            <p className="font-medium">
              {selectedBeard ? selectedBeard.nameRu : 'Борода'}
            </p>
            <p className="text-xs text-[var(--muted)]">
              {selectedBeard
                ? selectedBeard.description
                : 'Опционально - выберите стиль бороды'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedBeard && (
            <div className="w-6 h-6 bg-[var(--accent)] rounded-full flex items-center justify-center">
              <Check size={14} className="text-black" />
            </div>
          )}
          {isExpanded ? (
            <ChevronUp size={20} className="text-[var(--muted)]" />
          ) : (
            <ChevronDown size={20} className="text-[var(--muted)]" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
          <p className="text-sm text-[var(--muted)] px-1">
            Выберите стиль бороды или оставьте без изменений
          </p>

          {/* Beard style grid */}
          <div className="grid grid-cols-2 gap-2">
            {BEARD_STYLES.map((beard) => (
              <button
                key={beard.id}
                onClick={() =>
                  onSelectBeard(selectedBeard?.id === beard.id ? null : beard)
                }
                className={cn(
                  'relative flex items-center gap-3 p-3 rounded-xl transition-all',
                  'border-2 text-left',
                  selectedBeard?.id === beard.id
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                    : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--accent)]/50'
                )}
              >
                <span className="text-2xl flex-shrink-0">
                  {getBeardEmoji(beard.id)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{beard.nameRu}</p>
                  <p className="text-[10px] text-[var(--muted)] truncate">
                    {beard.name}
                  </p>
                </div>
                {selectedBeard?.id === beard.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[var(--accent)] rounded-full flex items-center justify-center">
                    <Check size={12} className="text-black" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Clear selection button */}
          {selectedBeard && (
            <button
              onClick={() => onSelectBeard(null)}
              className="w-full py-2 text-sm text-[var(--muted)] hover:text-white transition-colors"
            >
              Убрать выбор бороды
            </button>
          )}
        </div>
      )}
    </div>
  );
}

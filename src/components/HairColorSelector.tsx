'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Palette } from 'lucide-react';
import { HairColor, HAIR_COLORS } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface HairColorSelectorProps {
  selectedColor: HairColor | null;
  onSelectColor: (color: HairColor | null) => void;
}

export function HairColorSelector({
  selectedColor,
  onSelectColor,
}: HairColorSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(!!selectedColor);

  return (
    <div className="space-y-3">
      {/* Collapsible header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between p-4 rounded-xl transition-all',
          'bg-[var(--card-bg)] border',
          selectedColor
            ? 'border-[var(--accent)]/50'
            : 'border-[var(--card-border)]'
        )}
      >
        <div className="flex items-center gap-3">
          <Palette size={24} className="text-[var(--accent)]" />
          <div className="text-left">
            <p className="font-medium">
              {selectedColor ? selectedColor.nameRu : 'Цвет волос'}
            </p>
            <p className="text-xs text-[var(--muted)]">
              {selectedColor
                ? selectedColor.description
                : 'Опционально - измените цвет волос'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedColor && (
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
            Выберите цвет волос или оставьте натуральным
          </p>

          {/* Hair color grid */}
          <div className="grid grid-cols-2 gap-2">
            {HAIR_COLORS.map((color) => (
              <button
                key={color.id}
                onClick={() =>
                  onSelectColor(selectedColor?.id === color.id ? null : color)
                }
                className={cn(
                  'relative flex items-center gap-3 p-3 rounded-xl transition-all',
                  'border-2 text-left',
                  selectedColor?.id === color.id
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                    : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--accent)]/50'
                )}
              >
                {/* Color preview */}
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-white/20"
                  style={{
                    background: color.color,
                  }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{color.nameRu}</p>
                  <p className="text-[10px] text-[var(--muted)] truncate">
                    {color.name}
                  </p>
                </div>
                {selectedColor?.id === color.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[var(--accent)] rounded-full flex items-center justify-center">
                    <Check size={12} className="text-black" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Clear selection button */}
          {selectedColor && selectedColor.id !== 'natural' && (
            <button
              onClick={() => onSelectColor(null)}
              className="w-full py-2 text-sm text-[var(--muted)] hover:text-white transition-colors"
            >
              Убрать изменение цвета
            </button>
          )}
        </div>
      )}
    </div>
  );
}

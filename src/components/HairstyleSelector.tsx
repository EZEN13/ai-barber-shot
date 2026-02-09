'use client';

import { useState } from 'react';
import { Check, ImagePlus } from 'lucide-react';
import { Hairstyle, HAIRSTYLES } from '@/store/useAppStore';
import { UploadZone } from './UploadZone';
import { cn } from '@/lib/utils';

interface HairstyleSelectorProps {
  selectedHairstyle: Hairstyle | null;
  onSelectHairstyle: (style: Hairstyle) => void;
  referencePhoto: string | null;
  onReferencePhotoChange: (photo: string | null) => void;
}

export function HairstyleSelector({
  selectedHairstyle,
  onSelectHairstyle,
  referencePhoto,
  onReferencePhotoChange,
}: HairstyleSelectorProps) {
  const [mode, setMode] = useState<'catalog' | 'custom'>(
    referencePhoto ? 'custom' : 'catalog'
  );

  return (
    <div className="space-y-6">
      {/* Mode tabs */}
      <div className="flex bg-[var(--card-bg)] rounded-xl p-1">
        <button
          onClick={() => setMode('catalog')}
          className={cn(
            'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all',
            mode === 'catalog'
              ? 'bg-[var(--accent)] text-black'
              : 'text-[var(--muted)] hover:text-white'
          )}
        >
          Каталог
        </button>
        <button
          onClick={() => setMode('custom')}
          className={cn(
            'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all',
            mode === 'custom'
              ? 'bg-[var(--accent)] text-black'
              : 'text-[var(--muted)] hover:text-white'
          )}
        >
          Свой референс
        </button>
      </div>

      {mode === 'catalog' ? (
        <div className="space-y-4">
          <p className="text-sm text-[var(--muted)]">
            Выберите стрижку из каталога
          </p>

          {/* Horizontal scrolling hairstyle cards */}
          <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
            <div className="flex gap-3" style={{ width: 'max-content' }}>
              {HAIRSTYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => onSelectHairstyle(style)}
                  className={cn(
                    'relative flex-shrink-0 w-32 rounded-xl overflow-hidden transition-all duration-200',
                    'border-2',
                    selectedHairstyle?.id === style.id
                      ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/30'
                      : 'border-[var(--card-border)] hover:border-[var(--accent)]/50'
                  )}
                >
                  {/* Placeholder for hairstyle image */}
                  <div className="aspect-[3/4] bg-gradient-to-b from-[var(--card-bg)] to-[var(--card-border)] flex items-center justify-center">
                    <span className="text-4xl">{getHairstyleEmoji(style.id)}</span>
                  </div>

                  {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-xs font-medium text-white truncate">
                      {style.nameRu}
                    </p>
                    <p className="text-[10px] text-white/60 truncate">
                      {style.name}
                    </p>
                  </div>

                  {/* Selected indicator */}
                  {selectedHairstyle?.id === style.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--accent)] rounded-full flex items-center justify-center">
                      <Check size={14} className="text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Selected style details */}
          {selectedHairstyle && (
            <div className="bg-[var(--card-bg)] rounded-xl p-4 border border-[var(--accent)]/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[var(--accent)]/20 flex items-center justify-center">
                  <span className="text-2xl">{getHairstyleEmoji(selectedHairstyle.id)}</span>
                </div>
                <div>
                  <p className="font-semibold">{selectedHairstyle.nameRu}</p>
                  <p className="text-sm text-[var(--muted)]">{selectedHairstyle.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-[var(--muted)]">
            Загрузите фото желаемой стрижки
          </p>

          {referencePhoto ? (
            <div className="relative aspect-[3/4] max-w-[200px] mx-auto rounded-xl overflow-hidden border-2 border-[var(--accent)]">
              <img
                src={referencePhoto}
                alt="Референс"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onReferencePhotoChange(null)}
                className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <ImagePlus size={18} />
              </button>
            </div>
          ) : (
            <UploadZone
              photo={referencePhoto}
              onPhotoChange={onReferencePhotoChange}
              label="Фото-референс стрижки"
              showCrop={false}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Helper function to get emoji for hairstyle
function getHairstyleEmoji(id: string): string {
  const emojis: Record<string, string> = {
    'buzz-cut': '💈',
    'crew-cut': '✂️',
    'fade': '📐',
    'mid-fade': '📏',
    'low-fade': '📉',
    'undercut': '🔥',
    'pompadour': '💫',
    'quiff': '⬆️',
    'slick-back': '✨',
    'textured-crop': '🎨',
    'french-crop': '🇫🇷',
    'edgar': '📱',
    'mullet': '🎸',
    'curtains': '🎭',
    'wolf-cut': '🐺',
    'two-block': '🇰🇷',
    'man-bun': '🎎',
    'burst-fade': '💥',
  };
  return emojis[id] || '💇';
}

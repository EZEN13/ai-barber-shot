'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BeforeAfterToggleProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function BeforeAfterToggle({
  beforeImage,
  afterImage,
  beforeLabel = 'До',
  afterLabel = 'После',
}: BeforeAfterToggleProps) {
  const [showBefore, setShowBefore] = useState(false);

  const currentImage = showBefore ? beforeImage : afterImage;
  const currentLabel = showBefore ? beforeLabel : afterLabel;

  return (
    <div className="space-y-3">
      {/* Image container */}
      <div
        onClick={() => setShowBefore(!showBefore)}
        className={cn(
          'relative aspect-[3/4] w-full max-w-sm mx-auto rounded-2xl overflow-hidden',
          'bg-[var(--card-bg)] border border-[var(--card-border)]',
          'cursor-pointer select-none active:scale-[0.98] transition-transform'
        )}
      >
        <img
          src={currentImage}
          alt={currentLabel}
          className="w-full h-full object-cover transition-opacity duration-300"
          draggable={false}
        />

        {/* Label badge */}
        <div className={cn(
          'absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-medium',
          'transition-all duration-300',
          showBefore
            ? 'bg-white/90 text-black'
            : 'bg-[var(--accent)] text-black'
        )}>
          {currentLabel}
        </div>

        {/* Tap hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/60 rounded-full text-xs">
          Нажмите для сравнения
        </div>
      </div>

      {/* Toggle buttons */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setShowBefore(true)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            showBefore
              ? 'bg-white text-black'
              : 'bg-[var(--card-bg)] text-[var(--muted)] hover:text-white'
          )}
        >
          {beforeLabel}
        </button>
        <button
          onClick={() => setShowBefore(false)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            !showBefore
              ? 'bg-[var(--accent)] text-black'
              : 'bg-[var(--card-bg)] text-[var(--muted)] hover:text-white'
          )}
        >
          {afterLabel}
        </button>
      </div>
    </div>
  );
}

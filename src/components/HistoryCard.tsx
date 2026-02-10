'use client';

import type { GenerationHistoryItem } from '@/lib/storage/types';

interface HistoryCardProps {
  item: GenerationHistoryItem;
  onClick: () => void;
}

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин назад`;
  if (hours < 24) return `${hours} ч назад`;
  return `${days} дн назад`;
}

export function HistoryCard({ item, onClick }: HistoryCardProps) {
  const styleName = item.hairstyle?.nameRu || 'Свой стиль';
  const beardName = item.beard?.nameRu;

  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-2 p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent)]/50 transition-all active:scale-95"
    >
      {/* Thumbnail */}
      <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-black/20">
        <img
          src={item.resultThumbnail}
          alt={styleName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="text-left">
        <p className="text-xs font-medium truncate">{styleName}</p>
        {beardName && (
          <p className="text-[10px] text-[var(--muted)] truncate">+ {beardName}</p>
        )}
        <p className="text-[10px] text-[var(--muted)] mt-1">
          {getRelativeTime(item.timestamp)}
        </p>
      </div>
    </button>
  );
}

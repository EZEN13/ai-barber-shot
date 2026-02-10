'use client';

import { useState } from 'react';
import type { GenerationHistoryItem } from '@/lib/storage/types';
import { HistoryCard } from './HistoryCard';
import { HistoryModal } from './HistoryModal';

interface HistoryListProps {
  items: GenerationHistoryItem[];
}

export function HistoryList({ items }: HistoryListProps) {
  const [selectedItem, setSelectedItem] = useState<GenerationHistoryItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--muted)]">
        <p className="text-sm">История генераций пуста</p>
        <p className="text-xs mt-1">Создайте первую генерацию</p>
      </div>
    );
  }

  return (
    <>
      {/* Horizontal scrollable grid */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-32 snap-start"
          >
            <HistoryCard
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <HistoryModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}

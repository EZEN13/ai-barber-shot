'use client';

import { X, Download, Trash2 } from 'lucide-react';
import type { GenerationHistoryItem } from '@/lib/storage/types';
import { BeforeAfterToggle } from './BeforeAfterToggle';
import { downloadImage } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

interface HistoryModalProps {
  item: GenerationHistoryItem;
  onClose: () => void;
}

export function HistoryModal({ item, onClose }: HistoryModalProps) {
  const { deleteFromHistory } = useAppStore();

  const handleDownload = () => {
    const styleName = item.hairstyle?.nameRu || 'result';
    downloadImage(item.resultPhotoBase64, `barber-${styleName}-${Date.now()}.jpg`);
  };

  const handleDelete = async () => {
    if (confirm('Удалить эту генерацию из истории?')) {
      await deleteFromHistory(item.id);
      onClose();
    }
  };

  const styleName = item.hairstyle?.nameRu || 'Свой стиль';
  const beardName = item.beard?.nameRu;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div>
          <h2 className="font-medium">{styleName}</h2>
          {beardName && (
            <p className="text-xs text-[var(--muted)]">+ {beardName}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-lg mx-auto">
          <BeforeAfterToggle
            beforeImage={item.clientPhoto}
            afterImage={item.resultPhotoBase64}
            beforeLabel="До"
            afterLabel="После"
          />

          {item.modifications && (
            <div className="mt-4 p-3 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)]">
              <p className="text-xs text-[var(--muted)] mb-1">Модификации:</p>
              <p className="text-sm">{item.modifications}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-white/10">
        <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--accent)] text-black font-medium transition-all active:scale-95"
          >
            <Download size={18} />
            Скачать
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 font-medium transition-all active:scale-95"
          >
            <Trash2 size={18} />
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}

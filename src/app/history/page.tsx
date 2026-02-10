'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Header, HistoryCard, HistoryModal, Button } from '@/components';
import type { GenerationHistoryItem } from '@/lib/storage/types';

export default function HistoryPage() {
  const router = useRouter();
  const { history, loadHistory, clearHistory } = useAppStore();
  const [selectedItem, setSelectedItem] = useState<GenerationHistoryItem | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleClearAll = async () => {
    if (!confirm('Удалить всю историю генераций?')) return;

    setIsClearing(true);
    try {
      await clearHistory();
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header showBack title="История" />

      <main className="flex-1 p-4 pb-24">
        <div className="max-w-2xl mx-auto">
          {/* Header with clear button */}
          {history.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[var(--muted)]">
                {history.length} {history.length === 1 ? 'генерация' : 'генераций'}
              </p>
              <button
                onClick={handleClearAll}
                disabled={isClearing}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
              >
                <Trash2 size={16} />
                Очистить всё
              </button>
            </div>
          )}

          {/* Grid of history items */}
          {history.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--card-bg)] flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-[var(--muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-medium mb-2">История пуста</h2>
              <p className="text-sm text-[var(--muted)] mb-6">
                Создайте первую генерацию стрижки
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => router.push('/')}
              >
                Начать
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {history.map((item) => (
                <HistoryCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Back button */}
      {history.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent pt-8">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => router.back()}
              icon={<ArrowLeft size={20} />}
            >
              Назад
            </Button>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedItem && (
        <HistoryModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

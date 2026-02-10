'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Share2, RefreshCw, Home, Check, Pencil, Send, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Header, BeforeAfterToggle, Button, LoadingOverlay, HistoryList } from '@/components';
import {
  downloadImage,
  shareImage,
  downloadImageAsBase64,
  compressForStorage,
  createThumbnail,
  generateId,
} from '@/lib/utils';

export default function ResultPage() {
  const router = useRouter();
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditGenerating, setIsEditGenerating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const {
    clientPhoto,
    resultPhoto,
    setResultPhoto,
    selectedHairstyle,
    selectedBeard,
    modifications,
    resetForNew,
    reset,
    userRole,
    history,
    loadHistory,
    addToHistory,
  } = useAppStore();

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Save to history after successful generation
  useEffect(() => {
    async function saveToHistory() {
      if (!resultPhoto || !clientPhoto) return;

      try {
        // Download result URL as base64 if it's a URL
        const resultBase64 = resultPhoto.startsWith('http')
          ? await downloadImageAsBase64(resultPhoto)
          : resultPhoto;

        // Compress images for storage (7MB → 1MB)
        const clientCompressed = await compressForStorage(clientPhoto);
        const resultCompressed = await compressForStorage(resultBase64);

        // Generate thumbnails (50KB each)
        const clientThumb = await createThumbnail(clientCompressed);
        const resultThumb = await createThumbnail(resultCompressed);

        // Add to history
        await addToHistory({
          id: generateId(),
          timestamp: Date.now(),
          clientPhoto: clientCompressed,
          resultPhoto,
          resultPhotoBase64: resultCompressed,
          clientThumbnail: clientThumb,
          resultThumbnail: resultThumb,
          hairstyle: selectedHairstyle
            ? {
                id: selectedHairstyle.id,
                name: selectedHairstyle.name,
                nameRu: selectedHairstyle.nameRu,
              }
            : null,
          beard: selectedBeard
            ? {
                id: selectedBeard.id,
                name: selectedBeard.name,
                nameRu: selectedBeard.nameRu,
              }
            : null,
          modifications,
        });
      } catch (error) {
        console.error('Failed to save to history:', error);
      }
    }

    saveToHistory();
  }, [resultPhoto, clientPhoto, selectedHairstyle, selectedBeard, modifications, addToHistory]);

  // Redirect if no result
  if (!clientPhoto || !resultPhoto || !userRole) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  const handleDownload = () => {
    const filename = `barber-shot-${selectedHairstyle?.id || 'custom'}-${Date.now()}.jpg`;
    downloadImage(resultPhoto, filename);
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const success = await shareImage(resultPhoto, 'AI Barber Shot');
      if (success) {
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } else {
        // Fallback to download if share not available
        handleDownload();
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleTryAnother = () => {
    resetForNew();
    router.push('/upload');
  };

  const handleGoHome = () => {
    reset();
    router.push('/');
  };

  const handleEditResult = async () => {
    if (!editPrompt.trim() || !resultPhoto) return;

    setIsEditGenerating(true);
    setEditError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientPhoto: resultPhoto,
          isEdit: true,
          editPrompt: editPrompt.trim(),
          gender: 'male',
        }),
      });

      const data = await response.json();

      if (data.success && data.resultImage) {
        setResultPhoto(data.resultImage);
        setIsEditing(false);
        setEditPrompt('');
      } else {
        setEditError(data.error || 'Произошла ошибка при редактировании');
      }
    } catch (err) {
      console.error('Edit error:', err);
      setEditError('Не удалось отредактировать изображение');
    } finally {
      setIsEditGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header showReset showHistory title="Результат" />

      <main className="flex-1 p-4 pb-32">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Success message */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
              <Check size={18} className="text-green-500" />
              <span className="text-sm font-medium text-green-400">
                Готово!
              </span>
            </div>
          </div>

          {/* Hairstyle name */}
          {selectedHairstyle && (
            <div className="text-center">
              <h2 className="text-xl font-semibold">{selectedHairstyle.nameRu}</h2>
              <p className="text-sm text-[var(--muted)]">{selectedHairstyle.name}</p>
            </div>
          )}

          {/* Before/After comparison - tap to toggle */}
          <BeforeAfterToggle
            beforeImage={clientPhoto}
            afterImage={resultPhoto}
            beforeLabel="До"
            afterLabel="После"
          />

          {/* Edit result section */}
          {isEditing ? (
            <div className="space-y-3 p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Редактировать результат</p>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditPrompt('');
                    setEditError(null);
                  }}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} className="text-[var(--muted)]" />
                </button>
              </div>
              <textarea
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Опишите что изменить, например: сделать волосы чуть короче, добавить больше объема..."
                className="w-full h-24 px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-lg text-sm resize-none focus:outline-none focus:border-[var(--accent)]"
              />
              {editError && (
                <p className="text-xs text-red-400">{editError}</p>
              )}
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleEditResult}
                disabled={!editPrompt.trim() || isEditGenerating}
                isLoading={isEditGenerating}
                icon={!isEditGenerating ? <Send size={16} /> : undefined}
              >
                {isEditGenerating ? 'Генерация...' : 'Применить изменения'}
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm text-[var(--muted)] hover:text-white bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] hover:border-[var(--accent)]/50 transition-all"
            >
              <Pencil size={16} />
              Изменить результат
            </button>
          )}

          {/* Loading overlay for edit */}
          {isEditGenerating && <LoadingOverlay />}

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownload}
              icon={<Download size={20} />}
            >
              Сохранить
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={handleShare}
              isLoading={isSharing}
              icon={shareSuccess ? <Check size={20} /> : <Share2 size={20} />}
            >
              {shareSuccess ? 'Готово!' : 'Поделиться'}
            </Button>
          </div>

          {/* History section */}
          {history.length > 0 && (
            <div className="mt-8 pt-8 border-t border-[var(--card-border)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Предыдущие результаты</h3>
                {history.length > 3 && (
                  <button
                    onClick={() => router.push('/history')}
                    className="text-sm text-[var(--accent)] hover:underline"
                  >
                    Все ({history.length})
                  </button>
                )}
              </div>
              <HistoryList items={history.slice(0, 3)} />
            </div>
          )}
        </div>
      </main>

      {/* Fixed bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent pt-8">
        <div className="max-w-lg mx-auto space-y-3">
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={handleTryAnother}
            icon={<RefreshCw size={20} />}
          >
            Попробовать другую стрижку
          </Button>

          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={handleGoHome}
            icon={<Home size={18} />}
          >
            На главную
          </Button>
        </div>
      </div>
    </div>
  );
}

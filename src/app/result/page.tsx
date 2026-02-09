'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Share2, RefreshCw, Home, Check, Pencil, Send, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Header, BeforeAfterToggle, Button, LoadingOverlay } from '@/components';
import { downloadImage, shareImage } from '@/lib/utils';

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
    resetForNew,
    reset,
    userRole,
  } = useAppStore();

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
      <Header showReset title="Результат" />

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

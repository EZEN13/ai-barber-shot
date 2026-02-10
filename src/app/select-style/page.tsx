'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wand2, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import {
  Header,
  HairstyleSelector,
  BeardSelector,
  AdjustmentInput,
  Button,
  LoadingOverlay,
} from '@/components';

export default function SelectStylePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const {
    clientPhoto,
    selectedHairstyle,
    setSelectedHairstyle,
    selectedBeard,
    setSelectedBeard,
    referencePhoto,
    setReferencePhoto,
    modifications,
    setModifications,
    setResultPhoto,
    isGenerating,
    setIsGenerating,
    setCurrentStep,
    userRole,
  } = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!clientPhoto || !userRole)) {
      router.push('/');
    }
  }, [mounted, clientPhoto, userRole, router]);

  const canGenerate = selectedHairstyle || referencePhoto;

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientPhoto,
          hairstyleName: selectedHairstyle?.name,
          beardName: selectedBeard?.name,
          referencePhoto,
          modifications,
          gender: 'male',
        }),
      });

      const data = await response.json();

      if (data.success && data.resultImage) {
        setResultPhoto(data.resultImage);
        setCurrentStep('result');
        router.push('/result');
      } else {
        setError(data.error || 'Произошла ошибка при генерации');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError('Не удалось сгенерировать изображение. Проверьте подключение к интернету.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Show nothing until mounted to avoid hydration issues
  if (!mounted || !clientPhoto || !userRole) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header showBack showHistory title="Выберите стиль" />

      {isGenerating && <LoadingOverlay />}

      <main className="flex-1 p-4 pb-32">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Preview of client photo */}
          <div className="flex items-center gap-4 p-3 bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)]">
            <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={clientPhoto}
                alt="Фото клиента"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium">Фото загружено</p>
              <p className="text-xs text-[var(--muted)]">
                Выберите желаемую стрижку ниже
              </p>
            </div>
          </div>

          {/* Hairstyle selector */}
          <HairstyleSelector
            selectedHairstyle={selectedHairstyle}
            onSelectHairstyle={setSelectedHairstyle}
            referencePhoto={referencePhoto}
            onReferencePhotoChange={setReferencePhoto}
          />

          {/* Beard selector - collapsible */}
          <BeardSelector
            selectedBeard={selectedBeard}
            onSelectBeard={setSelectedBeard}
          />

          {/* Adjustments/modifications */}
          <AdjustmentInput
            value={modifications}
            onChange={setModifications}
            placeholder="Например: убрать объем с боков, сделать переход плавнее..."
          />

          {/* Error display */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-red-400">Ошибка</p>
                <p className="text-xs text-red-400/80">{error}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent pt-8">
        <div className="max-w-lg mx-auto">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canGenerate || isGenerating}
            onClick={handleGenerate}
            isLoading={isGenerating}
            icon={!isGenerating ? <Wand2 size={22} /> : undefined}
          >
            {isGenerating ? 'Генерация...' : 'Примерить стрижку'}
          </Button>

          {!canGenerate && (
            <p className="text-center text-xs text-[var(--muted)] mt-2">
              Выберите стрижку из каталога или загрузите референс
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

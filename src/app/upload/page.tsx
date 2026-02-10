'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Header, UploadZone, Button } from '@/components';

export default function UploadPage() {
  const router = useRouter();
  const { clientPhoto, setClientPhoto, setCurrentStep, userRole } = useAppStore();

  // Redirect if no role selected
  if (!userRole) {
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  const handleContinue = () => {
    if (clientPhoto) {
      setCurrentStep('select-style');
      router.push('/select-style');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header showBack showHistory title="Загрузите фото" />

      <main className="flex-1 p-4 pb-24">
        <div className="max-w-lg mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              {userRole === 'barber' ? 'Фото клиента' : 'Ваше фото'}
            </h2>
            <p className="text-sm text-[var(--muted)]">
              Сделайте фото или загрузите из галереи. Лучше всего подойдет
              портретное фото с хорошим освещением.
            </p>
          </div>

          <UploadZone
            photo={clientPhoto}
            onPhotoChange={setClientPhoto}
            label={userRole === 'barber' ? 'Загрузите фото клиента' : 'Загрузите ваше фото'}
          />

          {/* Tips */}
          <div className="mt-6 p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)]">
            <p className="text-sm font-medium mb-2">Советы для лучшего результата:</p>
            <ul className="text-xs text-[var(--muted)] space-y-1">
              <li>• Лицо должно быть хорошо видно</li>
              <li>• Равномерное освещение без теней</li>
              <li>• Смотрите прямо в камеру</li>
              <li>• Нейтральный фон</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent pt-8">
        <div className="max-w-lg mx-auto">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={!clientPhoto}
            onClick={handleContinue}
            icon={<ArrowRight size={22} />}
          >
            Далее
          </Button>
        </div>
      </div>
    </div>
  );
}

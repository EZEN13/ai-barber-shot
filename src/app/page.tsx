'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Scissors, User, UserCog } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components';

export default function HomePage() {
  const router = useRouter();
  const { setUserRole, userRole, currentStep } = useAppStore();

  // Navigate based on current step
  useEffect(() => {
    if (currentStep === 'upload' && userRole) {
      router.push('/upload');
    } else if (currentStep === 'select-style') {
      router.push('/select-style');
    } else if (currentStep === 'result') {
      router.push('/result');
    }
  }, [currentStep, userRole, router]);

  const handleRoleSelect = (role: 'barber' | 'client') => {
    setUserRole(role);
    router.push('/upload');
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center mb-4 shadow-xl shadow-[var(--accent)]/20">
            <Scissors size={40} className="text-black" />
          </div>
          <h1 className="text-3xl font-bold text-center">
            AI Barber Shot
          </h1>
          <p className="text-[var(--muted)] text-center mt-2">
            Виртуальное зеркало
          </p>
        </div>

        {/* Description */}
        <div className="max-w-sm text-center mb-12">
          <p className="text-lg mb-2">
            Примерьте новую стрижку
          </p>
          <p className="text-sm text-[var(--muted)]">
            Загрузите фото, выберите стиль и посмотрите результат с помощью AI
          </p>
        </div>

        {/* Role selection */}
        <div className="w-full max-w-sm space-y-4">
          <p className="text-center text-sm text-[var(--muted)] mb-2">
            Выберите режим
          </p>

          <Button
            variant="primary"
            size="xl"
            fullWidth
            onClick={() => handleRoleSelect('barber')}
            icon={<UserCog size={28} />}
          >
            Я Барбер
          </Button>

          <Button
            variant="secondary"
            size="xl"
            fullWidth
            onClick={() => handleRoleSelect('client')}
            icon={<User size={28} />}
          >
            Я Клиент
          </Button>
        </div>
      </div>

    </main>
  );
}

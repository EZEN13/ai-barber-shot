'use client';

import { useRouter } from 'next/navigation';
import { Scissors, ArrowLeft, RotateCcw, History } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface HeaderProps {
  showBack?: boolean;
  showReset?: boolean;
  showHistory?: boolean;
  title?: string;
}

export function Header({ showBack = false, showReset = false, showHistory = false, title }: HeaderProps) {
  const router = useRouter();
  const { currentStep, setCurrentStep, resetForNew, userRole, history } = useAppStore();

  const handleBack = () => {
    switch (currentStep) {
      case 'upload':
        setCurrentStep('role');
        break;
      case 'select-style':
        setCurrentStep('upload');
        break;
      case 'result':
        setCurrentStep('select-style');
        break;
      default:
        break;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--card-border)]">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="w-10">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 -m-2 text-[var(--muted)] hover:text-white transition-colors"
              aria-label="Назад"
            >
              <ArrowLeft size={24} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Scissors className="text-[var(--accent)]" size={24} />
          <h1 className="text-lg font-bold">
            {title || 'AI Barber Shot'}
          </h1>
        </div>

        <div className="flex items-center gap-1">
          {showHistory && history.length > 0 && (
            <button
              onClick={() => router.push('/history')}
              className="relative p-2 -m-2 text-[var(--muted)] hover:text-white transition-colors"
              aria-label="История"
            >
              <History size={22} />
              {history.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[var(--accent)] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {history.length > 9 ? '9+' : history.length}
                </span>
              )}
            </button>
          )}
          {showReset && (
            <button
              onClick={resetForNew}
              className="p-2 -m-2 text-[var(--muted)] hover:text-white transition-colors"
              aria-label="Начать заново"
            >
              <RotateCcw size={22} />
            </button>
          )}
        </div>
      </div>

      {userRole && (
        <div className="px-4 pb-2">
          <span className="text-xs text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded-full">
            {userRole === 'barber' ? 'Режим барбера' : 'Режим клиента'}
          </span>
        </div>
      )}
    </header>
  );
}

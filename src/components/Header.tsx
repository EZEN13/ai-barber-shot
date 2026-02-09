'use client';

import { Scissors, ArrowLeft, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface HeaderProps {
  showBack?: boolean;
  showReset?: boolean;
  title?: string;
}

export function Header({ showBack = false, showReset = false, title }: HeaderProps) {
  const { currentStep, setCurrentStep, resetForNew, userRole } = useAppStore();

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

        <div className="w-10">
          {showReset && (
            <button
              onClick={resetForNew}
              className="p-2 -m-2 text-[var(--muted)] hover:text-white transition-colors"
              aria-label="Начать заново"
            >
              <RotateCcw size={24} />
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

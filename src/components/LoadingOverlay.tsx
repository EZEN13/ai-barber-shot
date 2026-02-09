'use client';

import { Scissors } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Генерируем вашу стрижку...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm flex flex-col items-center justify-center p-8">
      {/* Animated scissors */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 flex items-center justify-center animate-pulse-gold">
          <Scissors size={48} className="text-[var(--accent)]" />
        </div>

        {/* Rotating ring */}
        <div className="absolute inset-0 border-4 border-[var(--accent)]/20 border-t-[var(--accent)] rounded-full animate-spin" />
      </div>

      {/* Message */}
      <p className="text-lg font-medium text-center mb-2">{message}</p>
      <p className="text-sm text-[var(--muted)] text-center">
        Это может занять несколько секунд
      </p>

      {/* Progress dots */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[var(--accent)]"
            style={{
              animation: 'pulse-gold 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

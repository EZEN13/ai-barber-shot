'use client';

import { useState, useEffect } from 'react';
import { Scissors } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
  showFunMessages?: boolean;
}

const FUN_MESSAGES = [
  'Готовим ножницы...',
  'Подбираем идеальную длину...',
  'Стрижём волосы...',
  'Делаем переходы...',
  'Наносим укладку...',
  'Полируем образ...',
  'Добавляем стиль...',
  'Финальные штрихи...',
];

export function LoadingOverlay({ message, showFunMessages = false }: LoadingOverlayProps) {
  const [currentMessage, setCurrentMessage] = useState(message || FUN_MESSAGES[0]);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!showFunMessages || message) return;

    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        const next = (prev + 1) % FUN_MESSAGES.length;
        setCurrentMessage(FUN_MESSAGES[next]);
        return next;
      });
    }, 3000); // Меняем каждые 3 секунды

    return () => clearInterval(interval);
  }, [showFunMessages, message]);

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
      <p
        key={messageIndex}
        className="text-lg font-medium text-center mb-2 animate-in fade-in duration-500"
      >
        {currentMessage}
      </p>
      {showFunMessages && !message && (
        <p className="text-sm text-[var(--muted)] text-center">
          Генерация займёт около минуты
        </p>
      )}

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

'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReferenceCopySelectorProps {
  targets: {
    hair: boolean;
    beard: boolean;
    hairColor: boolean;
    fullStyle: boolean;
  };
  onTargetsChange: (targets: {
    hair?: boolean;
    beard?: boolean;
    hairColor?: boolean;
    fullStyle?: boolean;
  }) => void;
}

export function ReferenceCopySelector({
  targets,
  onTargetsChange,
}: ReferenceCopySelectorProps) {
  const options = [
    { id: 'fullStyle', label: 'Весь стиль', desc: 'Скопировать всё' },
    { id: 'hair', label: 'Только прическу', desc: 'Скопировать стрижку' },
    { id: 'beard', label: 'Только бороду', desc: 'Скопировать бороду' },
    { id: 'hairColor', label: 'Только цвет', desc: 'Скопировать цвет волос' },
  ];

  const handleToggle = (id: string) => {
    if (id === 'fullStyle') {
      // Если выбран fullStyle, отключаем остальные
      onTargetsChange({
        fullStyle: !targets.fullStyle,
        hair: false,
        beard: false,
        hairColor: false,
      });
    } else {
      // Если выбран отдельный пункт, отключаем fullStyle
      onTargetsChange({
        [id]: !targets[id as keyof typeof targets],
        fullStyle: false,
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">Что скопировать с референса?</div>
      <p className="text-xs text-[var(--muted)]">
        Лицо клиента НЕ изменится. Копируется только выбранный стиль.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const isActive = targets[option.id as keyof typeof targets];

          return (
            <button
              key={option.id}
              onClick={() => handleToggle(option.id)}
              className={cn(
                'relative p-3 rounded-xl transition-all border-2 text-left',
                isActive
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                  : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:border-[var(--accent)]/50'
              )}
            >
              <div className="flex items-start gap-2">
                <div
                  className={cn(
                    'w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-all',
                    isActive
                      ? 'bg-[var(--accent)]'
                      : 'border-2 border-[var(--muted)]'
                  )}
                >
                  {isActive && <Check size={14} className="text-black" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{option.label}</p>
                  <p className="text-[10px] text-[var(--muted)]">
                    {option.desc}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

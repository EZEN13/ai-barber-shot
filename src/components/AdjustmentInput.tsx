'use client';

import { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdjustmentInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const QUICK_SUGGESTIONS = [
  'Убрать объем с боков',
  'Сделать переход плавнее',
  'Оставить челку длинной',
  'Короче сзади',
  'Добавить текстуру',
  'Более резкие линии',
  'Натуральный вид',
  'Больше объема сверху',
];

export function AdjustmentInput({
  value,
  onChange,
  placeholder = 'Добавьте комментарии к стрижке...',
}: AdjustmentInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addSuggestion = (suggestion: string) => {
    if (value.includes(suggestion)) return;

    const newValue = value
      ? `${value.trim()}, ${suggestion.toLowerCase()}`
      : suggestion;

    onChange(newValue);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between p-4 rounded-xl transition-all',
          'bg-[var(--card-bg)] border',
          isExpanded || value
            ? 'border-[var(--accent)]/50'
            : 'border-[var(--card-border)]'
        )}
      >
        <div className="flex items-center gap-3">
          <MessageSquare size={20} className="text-[var(--accent)]" />
          <span className="text-sm">
            {value ? 'Комментарии добавлены' : 'Дополнительные пожелания'}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp size={20} className="text-[var(--muted)]" />
        ) : (
          <ChevronDown size={20} className="text-[var(--muted)]" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className={cn(
              'w-full p-4 rounded-xl resize-none',
              'bg-[var(--card-bg)] border border-[var(--card-border)]',
              'text-white placeholder:text-[var(--muted)]',
              'focus:outline-none focus:border-[var(--accent)]/50',
              'transition-colors'
            )}
          />

          <div>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-xs text-[var(--accent)] hover:underline mb-2"
            >
              {showSuggestions ? 'Скрыть подсказки' : 'Показать подсказки'}
            </button>

            {showSuggestions && (
              <div className="flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => addSuggestion(suggestion)}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-full transition-all',
                      'border',
                      value.toLowerCase().includes(suggestion.toLowerCase())
                        ? 'bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent)]'
                        : 'bg-[var(--card-bg)] border-[var(--card-border)] text-[var(--muted)] hover:border-[var(--accent)]/50 hover:text-white'
                    )}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

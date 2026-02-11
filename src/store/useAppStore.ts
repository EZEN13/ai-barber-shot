import { create } from 'zustand';
import type { GenerationHistoryItem } from '@/lib/storage/types';
import {
  getHistory,
  addHistoryItem as addHistoryItemToStorage,
  deleteHistoryItem as deleteHistoryItemFromStorage,
  clearHistory as clearHistoryFromStorage,
} from '@/lib/storage';

export interface Hairstyle {
  id: string;
  name: string;
  nameRu: string;
  image: string;
  description: string;
}

export interface BeardStyle {
  id: string;
  name: string;
  nameRu: string;
  description: string;
}

export interface HairColor {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  color: string; // hex color for preview
}

// Стрижки - включая хайповые
export const HAIRSTYLES: Hairstyle[] = [
  {
    id: 'buzz-cut',
    name: 'Buzz Cut',
    nameRu: 'Бокс',
    image: '/hairstyles/buzz-cut.jpg',
    description: 'Короткая классическая стрижка'
  },
  {
    id: 'crew-cut',
    name: 'Crew Cut',
    nameRu: 'Полубокс',
    image: '/hairstyles/crew-cut.jpg',
    description: 'Классика с объемом сверху'
  },
  {
    id: 'fade',
    name: 'Fade',
    nameRu: 'Фейд',
    image: '/hairstyles/fade.jpg',
    description: 'Плавный переход от кожи'
  },
  {
    id: 'mid-fade',
    name: 'Mid Fade',
    nameRu: 'Мид Фейд',
    image: '/hairstyles/mid-fade.jpg',
    description: 'Фейд с середины головы'
  },
  {
    id: 'low-fade',
    name: 'Low Fade',
    nameRu: 'Лоу Фейд',
    image: '/hairstyles/low-fade.jpg',
    description: 'Низкий плавный переход'
  },
  {
    id: 'undercut',
    name: 'Undercut',
    nameRu: 'Андеркат',
    image: '/hairstyles/undercut.jpg',
    description: 'Выбритые виски, длина сверху'
  },
  {
    id: 'pompadour',
    name: 'Pompadour',
    nameRu: 'Помпадур',
    image: '/hairstyles/pompadour.jpg',
    description: 'Объемная укладка назад'
  },
  {
    id: 'quiff',
    name: 'Quiff',
    nameRu: 'Квифф',
    image: '/hairstyles/quiff.jpg',
    description: 'Объем спереди вверх'
  },
  {
    id: 'slick-back',
    name: 'Slick Back',
    nameRu: 'Зализанные назад',
    image: '/hairstyles/slick-back.jpg',
    description: 'Гладкая укладка назад'
  },
  {
    id: 'textured-crop',
    name: 'Textured Crop',
    nameRu: 'Кроп',
    image: '/hairstyles/textured-crop.jpg',
    description: 'Текстурная стрижка с челкой'
  },
  {
    id: 'french-crop',
    name: 'French Crop',
    nameRu: 'Французский Кроп',
    image: '/hairstyles/french-crop.jpg',
    description: 'Короткий кроп с прямой челкой'
  },
  {
    id: 'edgar',
    name: 'Edgar Cut',
    nameRu: 'Эдгар',
    image: '/hairstyles/edgar.jpg',
    description: 'Прямая линия челки, хайп TikTok'
  },
  {
    id: 'mullet',
    name: 'Mullet',
    nameRu: 'Маллет',
    image: '/hairstyles/mullet.jpg',
    description: 'Короче спереди, длиннее сзади'
  },
  {
    id: 'curtains',
    name: 'Curtains',
    nameRu: 'Шторки',
    image: '/hairstyles/curtains.jpg',
    description: 'Пробор посередине, 90s вайб'
  },
  {
    id: 'wolf-cut',
    name: 'Wolf Cut',
    nameRu: 'Вульф Кат',
    image: '/hairstyles/wolf-cut.jpg',
    description: 'Объемный маллет с текстурой'
  },
  {
    id: 'two-block',
    name: 'Two Block',
    nameRu: 'Ту Блок',
    image: '/hairstyles/two-block.jpg',
    description: 'Корейский стиль, K-pop'
  },
  {
    id: 'man-bun',
    name: 'Man Bun',
    nameRu: 'Мужской пучок',
    image: '/hairstyles/man-bun.jpg',
    description: 'Длинные волосы в пучок'
  },
  {
    id: 'burst-fade',
    name: 'Burst Fade',
    nameRu: 'Бёрст Фейд',
    image: '/hairstyles/burst-fade.jpg',
    description: 'Фейд вокруг уха полукругом'
  },
];

// Бороды
export const BEARD_STYLES: BeardStyle[] = [
  {
    id: 'clean-shaven',
    name: 'Clean Shaven',
    nameRu: 'Гладко выбрит',
    description: 'Без бороды, чистое лицо'
  },
  {
    id: 'stubble',
    name: 'Stubble',
    nameRu: 'Щетина',
    description: '3-5 дней роста, брутальный вид'
  },
  {
    id: 'short-beard',
    name: 'Short Beard',
    nameRu: 'Короткая борода',
    description: 'Аккуратная борода 1-2 см'
  },
  {
    id: 'full-beard',
    name: 'Full Beard',
    nameRu: 'Полная борода',
    description: 'Густая классическая борода'
  },
  {
    id: 'goatee',
    name: 'Goatee',
    nameRu: 'Козлиная бородка',
    description: 'Борода только на подбородке'
  },
  {
    id: 'van-dyke',
    name: 'Van Dyke',
    nameRu: 'Ван Дайк',
    description: 'Козлиная + усы, не соединены'
  },
  {
    id: 'circle-beard',
    name: 'Circle Beard',
    nameRu: 'Эспаньолка',
    description: 'Усы соединены с бородкой'
  },
  {
    id: 'balbo',
    name: 'Balbo',
    nameRu: 'Бальбо',
    description: 'Борода без бакенбард + усы'
  },
];

// Цвета волос
export const HAIR_COLORS: HairColor[] = [
  {
    id: 'natural',
    name: 'Natural',
    nameRu: 'Натуральный',
    description: 'Без изменений',
    color: '#4A4A4A'
  },
  {
    id: 'platinum-blonde',
    name: 'Platinum Blonde',
    nameRu: 'Платиновый блонд',
    description: 'Очень светлый холодный блонд',
    color: '#F5F5DC'
  },
  {
    id: 'ash-blonde',
    name: 'Ash Blonde',
    nameRu: 'Пепельный блонд',
    description: 'Серо-белокурый оттенок',
    color: '#D4D4AA'
  },
  {
    id: 'golden-blonde',
    name: 'Golden Blonde',
    nameRu: 'Золотистый блонд',
    description: 'Тёплый золотой оттенок',
    color: '#FFD700'
  },
  {
    id: 'caramel',
    name: 'Caramel',
    nameRu: 'Карамель',
    description: 'Тёплый карамельный оттенок',
    color: '#C68E5F'
  },
  {
    id: 'auburn',
    name: 'Auburn',
    nameRu: 'Каштановый',
    description: 'Красно-коричневый оттенок',
    color: '#A52A2A'
  },
  {
    id: 'dark-brown',
    name: 'Dark Brown',
    nameRu: 'Тёмно-коричневый',
    description: 'Насыщенный тёмный цвет',
    color: '#654321'
  },
  {
    id: 'black',
    name: 'Black',
    nameRu: 'Чёрный',
    description: 'Глубокий чёрный цвет',
    color: '#1A1A1A'
  },
  {
    id: 'highlights',
    name: 'Highlights',
    nameRu: 'Мелирование',
    description: 'Светлые пряди',
    color: 'linear-gradient(90deg, #8B4513 0%, #F5DEB3 50%, #8B4513 100%)'
  },
  {
    id: 'balayage',
    name: 'Balayage',
    nameRu: 'Балаяж',
    description: 'Плавный переход от тёмного к светлому',
    color: 'linear-gradient(180deg, #654321 0%, #D4A574 100%)'
  },
];

export type UserRole = 'barber' | 'client' | null;
export type AppStep = 'role' | 'upload' | 'select-style' | 'generating' | 'result';

interface AppState {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  currentStep: AppStep;
  setCurrentStep: (step: AppStep) => void;

  clientPhoto: string | null;
  setClientPhoto: (photo: string | null) => void;

  selectedHairstyle: Hairstyle | null;
  setSelectedHairstyle: (style: Hairstyle | null) => void;

  selectedBeard: BeardStyle | null;
  setSelectedBeard: (beard: BeardStyle | null) => void;

  selectedHairColor: HairColor | null;
  setSelectedHairColor: (color: HairColor | null) => void;

  referencePhoto: string | null;
  setReferencePhoto: (photo: string | null) => void;

  modifications: string;
  setModifications: (text: string) => void;

  resultPhoto: string | null;
  setResultPhoto: (photo: string | null) => void;

  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;

  error: string | null;
  setError: (error: string | null) => void;

  // Для редактирования результата
  isEditingResult: boolean;
  setIsEditingResult: (editing: boolean) => void;

  editPrompt: string;
  setEditPrompt: (prompt: string) => void;

  // История генераций
  history: GenerationHistoryItem[];
  isLoadingHistory: boolean;
  loadHistory: () => Promise<void>;
  addToHistory: (item: GenerationHistoryItem) => Promise<void>;
  deleteFromHistory: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;

  reset: () => void;
  resetForNew: () => void;
}

const initialState = {
  userRole: null as UserRole,
  currentStep: 'role' as AppStep,
  clientPhoto: null as string | null,
  selectedHairstyle: null as Hairstyle | null,
  selectedBeard: null as BeardStyle | null,
  selectedHairColor: null as HairColor | null,
  referencePhoto: null as string | null,
  modifications: '',
  resultPhoto: null as string | null,
  isGenerating: false,
  error: null as string | null,
  isEditingResult: false,
  editPrompt: '',
  history: [] as GenerationHistoryItem[],
  isLoadingHistory: false,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setUserRole: (role) => set({ userRole: role, currentStep: 'upload' }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setClientPhoto: (photo) => set({ clientPhoto: photo }),

  setSelectedHairstyle: (style) => set({
    selectedHairstyle: style,
    referencePhoto: null
  }),

  setSelectedBeard: (beard) => set({ selectedBeard: beard }),

  setSelectedHairColor: (color) => set({ selectedHairColor: color }),

  setReferencePhoto: (photo) => set({
    referencePhoto: photo,
    selectedHairstyle: null
  }),

  setModifications: (text) => set({ modifications: text }),
  setResultPhoto: (photo) => set({ resultPhoto: photo }),
  setIsGenerating: (loading) => set({ isGenerating: loading }),
  setError: (error) => set({ error }),

  setIsEditingResult: (editing) => set({ isEditingResult: editing }),
  setEditPrompt: (prompt) => set({ editPrompt: prompt }),

  // История генераций
  loadHistory: async () => {
    set({ isLoadingHistory: true });
    try {
      const history = await getHistory();
      set({ history, isLoadingHistory: false });
    } catch (error) {
      console.error('Failed to load history:', error);
      set({ isLoadingHistory: false });
    }
  },

  addToHistory: async (item) => {
    try {
      await addHistoryItemToStorage(item);
      const history = await getHistory();
      set({ history });
    } catch (error) {
      console.error('Failed to add history item:', error);
    }
  },

  deleteFromHistory: async (id) => {
    try {
      await deleteHistoryItemFromStorage(id);
      const history = await getHistory();
      set({ history });
    } catch (error) {
      console.error('Failed to delete history item:', error);
    }
  },

  clearHistory: async () => {
    try {
      await clearHistoryFromStorage();
      set({ history: [] });
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  },

  reset: () => set(initialState),

  resetForNew: () => set({
    clientPhoto: null,
    selectedHairstyle: null,
    selectedBeard: null,
    selectedHairColor: null,
    referencePhoto: null,
    modifications: '',
    resultPhoto: null,
    isGenerating: false,
    error: null,
    currentStep: 'upload',
    isEditingResult: false,
    editPrompt: '',
  }),
}));

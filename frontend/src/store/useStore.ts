import { create } from 'zustand'

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: {
    source: string;
    page: number;
    snippet: string;
    score: number;
  }[];
  retrieval_metadata?: {
    status: string;
    confidence: number;
    count?: number;
  };
}

interface AppState {
  // Auth state
  user: { id: number; email: string; full_name: string } | null;
  token: string | null;
  setAuth: (user: any, token: string) => void;
  logout: () => void;

  // Theme state
  isDark: boolean;
  toggleTheme: () => void;
  
  // Audio state
  isAudioEnabled: boolean;
  toggleAudio: () => void;
  
  // Language state
  language: string;
  setLanguage: (lang: string) => void;
  
  // Chat state
  sessionId: string;
  messages: ChatMessage[];
  isGenerating: boolean;
  setGenerating: (status: boolean) => void;
  addMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
}

export const useStore = create<AppState>((set) => ({
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('vaidya_user') || 'null') : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('vaidya_token') : null,
  setAuth: (user, token) => {
    localStorage.setItem('vaidya_user', JSON.stringify(user));
    localStorage.setItem('vaidya_token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('vaidya_user');
    localStorage.removeItem('vaidya_token');
    set({ user: null, token: null, messages: [] });
  },

  isDark: true,
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
  
  isAudioEnabled: false,
  toggleAudio: () => set((state) => ({ isAudioEnabled: !state.isAudioEnabled })),
  
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  
  sessionId: Math.random().toString(36).substring(7),
  messages: [],
  isGenerating: false,
  setGenerating: (status) => set({ isGenerating: status }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  clearChat: () => set({ messages: [], sessionId: Math.random().toString(36).substring(7) }),
}));


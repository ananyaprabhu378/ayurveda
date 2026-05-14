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
}

interface AppState {
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

export type Goal = 
  | 'Milionário' 
  | 'Referência' 
  | 'Estabilidade' 
  | 'Propósito' 
  | 'Dominar o Mundo' 
  | 'Salvar a Humanidade' 
  | 'Explorar o Desconhecido' 
  | 'Vingança'
  | 'Imortalidade'
  | 'Líder Espiritual'
  | 'Paz Mundial'
  | 'Anarquia Total'
  | 'Descobrir a Cura da Morte'
  | 'Fundar um Império Galáctico';

export type Theme = 
  | 'Cyberpunk' 
  | 'Medieval' 
  | 'Contemporâneo' 
  | 'Apocalíptico' 
  | 'Roma Antiga' 
  | 'Velho Oeste' 
  | 'Era dos Descobrimentos' 
  | 'Colonização de Marte'
  | 'Era Vitoriana'
  | 'Japão Feudal'
  | 'Pré-História'
  | 'Revolução Industrial'
  | 'Egito Antigo'
  | 'Grécia Antiga'
  | 'Era Viking'
  | 'Guerra Fria'
  | 'Futuro Utópico'
  | 'Steampunk';

export type StoryLength = 'Curta' | 'Média' | 'Longa';

export interface PlayerProfile {
  id: string;
  name: string;
  location: string;
  background: string;
  photo: string | null;
}

export interface Stats {
  dinheiro: number;
  conhecimento: number;
  relacionamentos: number;
  energia: number;
  saude: number;
  fama: number;
  sanidade: number;
}

export interface TurnResponse {
  consequencia_imediata: string;
  consequencia_futura: string;
  stats_change: Partial<Stats>;
  nova_situacao: string;
  opcoes: string[];
  image_prompt: string;
}

export interface GameState {
  screen: 'home' | 'profiles' | 'character' | 'photo' | 'theme' | 'length' | 'goal' | 'game' | 'end';
  profiles: PlayerProfile[];
  mainProfileId: string | null;
  companionIds: string[];
  editingProfileId: string | null;
  theme: Theme | null;
  storyLength: StoryLength;
  goal: Goal | null;
  stats: Stats;
  turn: number;
  maxTurns: number;
  history: string[];
  currentScenario: string;
  currentOptions: string[];
  currentImage: string;
  lastConsequence: {
    immediate: string;
    future: string;
  } | null;
  loading: boolean;
  imageLoading: boolean;
  error: string | null;
}

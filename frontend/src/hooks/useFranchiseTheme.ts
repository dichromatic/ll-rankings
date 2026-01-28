// src/hooks/useFranchiseTheme.ts
export type Franchise = 'liella' | 'aqours' | 'us' | 'nijigasaki' | 'hasunosora';

const themes = {
  liella: {
    border: 'border-accent-liella',
    text: 'text-accent-liella',
    bg: 'bg-accent-liella',
    rgb: '248, 82, 173',
    focus: 'focus:border-accent-liella',
    hover: 'hover:bg-accent-liella',
    selection: 'selection:bg-accent-liella/30'
  },
  aqours: {
    border: 'border-accent-aqours',
    text: 'text-accent-aqours',
    bg: 'bg-accent-aqours',
    rgb: '0, 123, 255',
    focus: 'focus:border-accent-aqours',
    hover: 'hover:bg-accent-aqours',
    selection: 'selection:bg-accent-aqours/30'
  },
  us: {
    border: 'border-accent-us',
    text: 'text-accent-us',
    bg: 'bg-accent-us',
    rgb: '238, 0, 0',
    focus: 'focus:border-accent-us',
    hover: 'hover:bg-accent-us',
    selection: 'selection:bg-accent-us/30'
  },
  nijigasaki: {
    border: 'border-accent-nijigasaki',
    text: 'text-accent-nijigasaki',
    bg: 'bg-accent-nijigasaki',
    rgb: '247, 193, 13',
    focus: 'focus:border-accent-nijigasaki',
    hover: 'hover:bg-accent-nijigasaki',
    selection: 'selection:bg-accent-nijigasaki/30'
  },
  hasunosora: {
    border: 'border-accent-hasunosora',
    text: 'text-accent-hasunosora',
    bg: 'bg-accent-hasunosora',
    rgb: '255, 144, 0',
    focus: 'focus:border-accent-hasunosora',
    hover: 'hover:bg-accent-hasunosora',
    selection: 'selection:bg-accent-hasunosora/30'
  },
};

interface Theme {
  border: string;
  text: string;
  bg: string;
  rgb: string;
  focus: string;
  hover: string;
  selection: string;
}

export const useFranchiseTheme = (franchise: Franchise) => {
  return themes[franchise] as Theme;
};
// src/hooks/useFranchiseTheme.ts
export type Franchise = 'liella' | 'aqours' | 'us' | 'nijigasaki' | 'hasunosora';

export const useFranchiseTheme = (franchise: Franchise) => {
  const themes = {
    liella: { border: 'border-accent-liella', text: 'text-accent-liella', bg: 'bg-accent-liella' },
    aqours: { border: 'border-accent-aqours', text: 'text-accent-aqours', bg: 'bg-accent-aqours' },
    us: { border: 'border-accent-us', text: 'text-accent-us', bg: 'bg-accent-us' },
    nijigasaki: { border: 'border-accent-nijigasaki', text: 'text-accent-nijigasaki', bg: 'bg-accent-nijigasaki' },
    hasunosora: { border: 'border-accent-hasunosora', text: 'text-accent-hasunosora', bg: 'bg-accent-hasunosora' },
  };

  return themes[franchise];
};
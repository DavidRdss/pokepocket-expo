export const capitalize = (value: string) =>
  value
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const formatId = (id: number) => '#' + String(id).padStart(3, '0');

export const formatMetric = (value: number, divisor: number, unit: string) =>
  (value / divisor).toFixed(1).replace('.', ',') + ' ' + unit;

export const TYPE_COLORS: Record<string, string> = {
  normal: '#ACB0B8',
  fire: '#F77B5A',
  water: '#5B9EEC',
  electric: '#F3C857',
  grass: '#61C59A',
  ice: '#6ACFD6',
  fighting: '#E17065',
  poison: '#BB84D9',
  ground: '#CEAC6B',
  flying: '#8FA6DB',
  psychic: '#F182AA',
  bug: '#9BC75E',
  rock: '#B8A787',
  ghost: '#8B82C5',
  dragon: '#8073DF',
  dark: '#777481',
  steel: '#8FA5B7',
  fairy: '#E59AC6',
};

export const TYPE_NAMES: Record<string, string> = {
  normal: 'Normal', fire: 'Fogo', water: 'Água', electric: 'Elétrico',
  grass: 'Planta', ice: 'Gelo', fighting: 'Lutador', poison: 'Veneno',
  ground: 'Terra', flying: 'Voador', psychic: 'Psíquico', bug: 'Inseto',
  rock: 'Pedra', ghost: 'Fantasma', dragon: 'Dragão', dark: 'Sombrio',
  steel: 'Aço', fairy: 'Fada',
};

export const STAT_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Ataque esp.',
  'special-defense': 'Defesa esp.',
  speed: 'Velocidade',
};

export const CARD_COLORS = ['#273B50', '#383550', '#2B4550', '#443749', '#354436'];

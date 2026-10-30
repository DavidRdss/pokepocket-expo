export type PokemonPreview = {
  id: number;
  name: string;
  artwork: string;
};

export type PokemonStat = {
  base_stat: number;
  stat: { name: string };
};

export type PokemonDetails = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: PokemonStat[];
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: { front_default: string | null };
    };
  };
};

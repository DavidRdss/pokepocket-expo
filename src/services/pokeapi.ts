import type { PokemonDetails, PokemonPreview } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';
const ARTWORK_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

const detailCache = new Map<number, PokemonDetails>();
let listCache: PokemonPreview[] | null = null;

type ListResponse = {
  results: { name: string; url: string }[];
};

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error('A API respondeu com o status ' + response.status + '.');
  }
  return (await response.json()) as T;
}

/** Uma chamada obtém os 151 nomes; as imagens usam URLs da PokéAPI. */
export async function getPokemonList(forceRefresh = false): Promise<PokemonPreview[]> {
  if (listCache && !forceRefresh) return listCache;

  const data = await getJson<ListResponse>(BASE_URL + '/pokemon?limit=151&offset=0');
  const list = data.results.map(({ name, url }) => {
    const match = url.match(/\/pokemon\/(\d+)\/?$/);
    if (!match) throw new Error('A API retornou um identificador inesperado.');
    const id = Number(match[1]);
    return { id, name, artwork: ARTWORK_BASE + '/' + id + '.png' };
  });

  listCache = list;
  return list;
}

/** Os detalhes são buscados quando o usuário abre uma ficha. */
export async function getPokemonDetails(id: number): Promise<PokemonDetails> {
  const cached = detailCache.get(id);
  if (cached) return cached;
  const details = await getJson<PokemonDetails>(BASE_URL + '/pokemon/' + id);
  detailCache.set(id, details);
  return details;
}

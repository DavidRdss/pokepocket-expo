import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PokemonPreview } from '../types/pokemon';

const STORAGE_KEY = '@pokepocket:favorites:v1';

type FavoritesContextValue = {
  favorites: PokemonPreview[];
  ready: boolean;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (pokemon: PokemonPreview) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

function isValidPokemon(value: unknown): value is PokemonPreview {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Partial<PokemonPreview>;
  return Number.isInteger(item.id) && Number(item.id) > 0 &&
    typeof item.name === 'string' && typeof item.artwork === 'string';
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<PokemonPreview[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function restore() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved && active) {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setFavorites(parsed.filter(isValidPokemon));
          }
        }
      } catch (error) {
        console.warn('Não foi possível recuperar os favoritos:', error);
      } finally {
        if (active) setReady(true);
      }
    }

    restore();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    // Só grava depois de ler os dados antigos: evita apagar favoritos ao iniciar.
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch((error) => {
      console.warn('Não foi possível salvar os favoritos:', error);
    });
  }, [favorites, ready]);

  const isFavorite = useCallback(
    (id: number) => favorites.some((pokemon) => pokemon.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((pokemon: PokemonPreview) => {
    setFavorites((current) => {
      const exists = current.some((item) => item.id === pokemon.id);
      return exists ? current.filter((item) => item.id !== pokemon.id) : [...current, pokemon];
    });
  }, []);

  const value = useMemo(
    () => ({ favorites, ready, isFavorite, toggleFavorite }),
    [favorites, ready, isFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites precisa estar dentro de FavoritesProvider');
  return context;
}

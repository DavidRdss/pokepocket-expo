import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Icon, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PokemonCard } from '../components/PokemonCard';
import { useFavorites } from '../context/FavoritesContext';
import { colors } from '../theme/colors';
import type { PokemonPreview } from '../types/pokemon';

type Props = { onOpen: (pokemon: PokemonPreview) => void };

export function FavoritesScreen({ onOpen }: Props) {
  const { favorites, ready, isFavorite, toggleFavorite } = useFavorites();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={favorites}
        numColumns={2}
        keyExtractor={(pokemon) => String(pokemon.id)}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onPress={onOpen}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={toggleFavorite}
            favoriteDisabled={!ready}
          />
        )}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.overline}>A TUA COLEÇÃO</Text>
            <Text style={styles.title}>Meus favoritos <Text style={styles.heart}>♥</Text></Text>
            <Text style={styles.subtitle}>
              Os Pokémon marcados com coração ficam guardados localmente no aparelho, mesmo após fechar o app.
            </Text>
            <Text style={styles.count}>
              {ready ? favorites.length + (favorites.length === 1 ? ' Pokémon salvo' : ' Pokémon salvos') : 'Carregando favoritos...'}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            {ready ? (
              <>
                <Icon source="heart-outline" size={54} color={colors.red} />
                <Text style={styles.emptyTitle}>A tua coleção começa aqui!</Text>
                <Text style={styles.emptyText}>
                  Abre a aba Explorar e toca no coração de qualquer Pokémon para adicioná-lo aos favoritos.
                </Text>
              </>
            ) : (
              <ActivityIndicator size="large" color={colors.red} />
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1 },
  content: { paddingHorizontal: 19, paddingTop: 26, paddingBottom: 28, flexGrow: 1 },
  columns: { gap: 12 },
  header: { marginBottom: 20 },
  overline: { color: colors.red, fontSize: 10, letterSpacing: 1.8, fontWeight: '900' },
  title: { color: colors.white, fontSize: 30, fontWeight: '900', letterSpacing: -1, marginTop: 8 },
  heart: { color: colors.red },
  subtitle: { color: colors.mutedLight, lineHeight: 21, fontSize: 13, marginTop: 10, marginBottom: 18 },
  count: { color: colors.yellow, fontSize: 12, fontWeight: '800' },
  empty: { flex: 1, minHeight: 310, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22, gap: 12 },
  emptyTitle: { color: colors.white, fontWeight: '900', textAlign: 'center', fontSize: 19 },
  emptyText: { color: colors.muted, textAlign: 'center', lineHeight: 21, fontSize: 13 },
});

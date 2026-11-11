import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Keyboard, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, Searchbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PokemonCard } from '../components/PokemonCard';
import { useFavorites } from '../context/FavoritesContext';
import { getPokemonList } from '../services/pokeapi';
import { colors } from '../theme/colors';
import type { PokemonPreview } from '../types/pokemon';

type Props = { onOpen: (pokemon: PokemonPreview) => void };

export function HomeScreen({ onOpen }: Props) {
  const [pokemons, setPokemons] = useState<PokemonPreview[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { favorites, ready, isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let active = true;
    getPokemonList()
      .then((data) => { if (active) { setPokemons(data); setError(null); } })
      .catch(() => {
        if (active) setError('Não foi possível carregar a PokéAPI. Confere tua conexão.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      setPokemons(await getPokemonList(true));
    } catch {
      setError('Falha ao atualizar. Tenta novamente quando estiver conectado.');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return pokemons;
    const numeric = query.replace(/^#/, '').replace(/^0+(?=\d)/, '');
    return pokemons.filter((pokemon) =>
      pokemon.name.includes(query) ||
      (/^\d+$/.test(numeric) && String(pokemon.id).includes(numeric))
    );
  }, [pokemons, search]);

  const pikachu = pokemons.find((pokemon) => pokemon.id === 25);

  const openDetails = (pokemon: PokemonPreview) => {
    Keyboard.dismiss();
    onOpen(pokemon);
  };

  const header = (
    <View>
      <View style={styles.brandRow}>
        <View style={styles.brandText}>
          <Text style={styles.brand}>poké<Text style={styles.brandAccent}>pocket</Text></Text>
          <Text style={styles.edition}>KANTO EDITION  •  151 POKÉMON</Text>
        </View>
        <Chip icon="heart" compact textStyle={styles.chipText} style={styles.favoriteChip}>
          {ready ? favorites.length : '...'}
        </Chip>
      </View>

      <Text style={styles.eyebrow}>A TUA POKÉDEX DIGITAL</Text>
      <Text style={styles.title}>Explore. Descubra.{'\n'}<Text style={styles.yellow}>Colecione.</Text></Text>
      <Text style={styles.subtitle}>Conhece os Pokémon de Kanto, consulta suas fichas e guarda os favoritos.</Text>

      {pikachu && (
        <Card onPress={() => openDetails(pikachu)} mode="contained" style={styles.featureCard}>
          <Card.Content style={styles.featureContent}>
            <View style={styles.featureCopy}>
              <Text style={styles.featureBadge}>✦ EM DESTAQUE</Text>
              <Text style={styles.featureTitle}>Pikachu</Text>
              <Text style={styles.featureSubtitle}>O elétrico mais famoso de Kanto!</Text>
              <Text style={styles.featureLink}>Ver ficha  ↗</Text>
            </View>
            <Image source={{ uri: pikachu.artwork }} resizeMode="contain" style={styles.featureImage} />
          </Card.Content>
        </Card>
      )}

      <Searchbar
        placeholder="Pesquisar por nome ou número"
        value={search}
        onChangeText={setSearch}
        iconColor={colors.mutedLight}
        placeholderTextColor={colors.muted}
        inputStyle={styles.searchInput}
        style={styles.search}
        accessibilityLabel="Pesquisar Pokémon por nome ou número"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {error && (
        <Card mode="contained" style={styles.errorCard}>
          <Card.Content>
            <Text style={styles.errorText}>{error}</Text>
            <Button onPress={refresh} mode="text" textColor={colors.white} icon="reload">
              Tentar novamente
            </Button>
          </Card.Content>
        </Card>
      )}

      <View style={styles.listHeading}>
        <View>
          <Text style={styles.overline}>POKÉDEX NACIONAL</Text>
          <Text style={styles.sectionTitle}>Descobrir Pokémon</Text>
        </View>
        <Chip compact style={styles.counterChip} textStyle={styles.counterText}>
          {filtered.length} / 151
        </Chip>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(pokemon) => String(pokemon.id)}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            onPress={openDetails}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={toggleFavorite}
            favoriteDisabled={!ready}
          />
        )}
        columnWrapperStyle={styles.columns}
        ListHeaderComponent={header}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={refresh}
        initialNumToRender={12}
        windowSize={7}
        ListEmptyComponent={
          <View style={styles.empty}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color={colors.red} />
                <Text style={styles.emptyMessage}>Consultando a PokéAPI...</Text>
              </>
            ) : (
              <>
                <Text style={styles.emptySymbol}>{error ? '⚡' : '🔎'}</Text>
                <Text style={styles.emptyTitle}>{error ? 'Sem conexão' : 'Nenhum Pokémon encontrado'}</Text>
                <Text style={styles.emptyMessage}>
                  {error ? 'Usa o botão acima para tentar novamente.' : 'Experimenta pesquisar outro nome ou número.'}
                </Text>
              </>
            )}
          </View>
        }
        ListFooterComponent={
          filtered.length > 0
            ? <Text style={styles.footer}>Dados: PokéAPI • Favoritos salvos neste aparelho</Text>
            : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 19, paddingTop: 23, paddingBottom: 22 },
  columns: { gap: 12 },
  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 31 },
  brandText: { flex: 1 },
  brand: { color: colors.white, fontSize: 26, fontWeight: '900', letterSpacing: -1.2 },
  brandAccent: { color: colors.red },
  edition: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1.1, marginTop: 3 },
  favoriteChip: { backgroundColor: colors.surfaceHighlight },
  chipText: { color: colors.white, fontWeight: '800' },
  eyebrow: { color: colors.red, fontSize: 10, letterSpacing: 1.5, fontWeight: '900', marginBottom: 9 },
  title: { color: colors.white, fontSize: 36, lineHeight: 42, fontWeight: '900', letterSpacing: -1.3 },
  yellow: { color: colors.yellow },
  subtitle: { color: colors.mutedLight, fontSize: 13, lineHeight: 21, marginTop: 10, marginBottom: 22 },
  featureCard: { backgroundColor: '#EF5B69', borderRadius: 24, marginBottom: 23, overflow: 'hidden' },
  featureContent: { flexDirection: 'row', minHeight: 172, padding: 19, justifyContent: 'space-between' },
  featureCopy: { width: '61%', justifyContent: 'center' },
  featureBadge: { fontWeight: '900', fontSize: 10, color: colors.white, marginBottom: 12 },
  featureTitle: { fontSize: 28, fontWeight: '900', color: colors.white },
  featureSubtitle: { color: '#FFF4F5', fontSize: 12, lineHeight: 17, marginTop: 3 },
  featureLink: { fontWeight: '800', fontSize: 12, marginTop: 12, color: colors.white },
  featureImage: { width: '43%', height: 153, alignSelf: 'center' },
  search: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.stroke, borderRadius: 16, elevation: 0 },
  searchInput: { color: colors.white, fontSize: 14 },
  errorCard: { backgroundColor: '#472735', marginTop: 14, borderRadius: 14 },
  errorText: { color: colors.white, fontSize: 13, lineHeight: 19 },
  listHeading: { marginTop: 31, marginBottom: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  overline: { color: colors.muted, letterSpacing: 1.2, fontSize: 10, fontWeight: '800' },
  sectionTitle: { color: colors.white, fontSize: 21, marginTop: 4, fontWeight: '900' },
  counterChip: { backgroundColor: colors.surface, borderColor: colors.stroke, borderWidth: 1 },
  counterText: { color: colors.mutedLight, fontSize: 11 },
  empty: { minHeight: 230, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, gap: 12 },
  emptySymbol: { fontSize: 35 },
  emptyTitle: { color: colors.white, fontWeight: '900', fontSize: 18, textAlign: 'center' },
  emptyMessage: { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 19 },
  footer: { color: colors.muted, textAlign: 'center', fontSize: 11, marginTop: 14 },
});

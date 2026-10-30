import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { PokemonCard } from './src/components/PokemonCard';
import { PokemonDetailsModal } from './src/components/PokemonDetailsModal';
import { getPokemonList } from './src/services/pokeapi';
import { colors } from './src/theme/colors';
import type { PokemonPreview } from './src/types/pokemon';

export default function App() {
  const [pokemons, setPokemons] = useState<PokemonPreview[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<PokemonPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getPokemonList()
      .then((data) => {
        if (active) setPokemons(data);
      })
      .catch(() => {
        if (active) setError('Não conseguimos acessar a PokéAPI. Confere a conexão e tenta de novo.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const refresh = async () => {
    setError(null);
    setRefreshing(true);
    try {
      const data = await getPokemonList(true);
      setPokemons(data);
    } catch {
      setError('Falha ao atualizar os dados. Puxa para baixo para tentar novamente.');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return pokemons;
    const numericQuery = query.replace(/^#/, '').replace(/^0+(?=\d)/, '');
    return pokemons.filter((pokemon) =>
      pokemon.name.includes(query) ||
      (numericQuery !== '' && /^\d+$/.test(numericQuery) && String(pokemon.id).includes(numericQuery))
    );
  }, [pokemons, search]);

  const pikachu = pokemons.find((pokemon) => pokemon.id === 25);

  const openDetails = (pokemon: PokemonPreview) => {
    Keyboard.dismiss();
    setSelected(pokemon);
  };

  const header = (
    <View>
      <View style={styles.nav}>
        <View style={styles.brand}>
          <View style={styles.brandIcon}>
            <View style={styles.ballLine} />
            <View style={styles.ballCenter} />
          </View>
          <Text style={styles.brandText}>poké<Text style={styles.brandAccent}>pocket</Text></Text>
        </View>
        <View style={styles.editionBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.editionText}>KANTO EDITION</Text>
        </View>
      </View>

      <Text style={styles.eyebrow}>SEJA BEM-VINDO AO UNIVERSO POKÉMON</Text>
      <Text style={styles.heading}>Explore. Descubra.{"\n"}<Text style={styles.highlight}>Colecione.</Text></Text>
      <Text style={styles.subtitle}>A primeira geração inteira na palma da tua mão.</Text>

      {pikachu && (
        <Pressable onPress={() => openDetails(pikachu)} style={({ pressed }) => [styles.feature, pressed && { opacity: 0.84 }]}>
          <View style={styles.featureCircle} />
          <View style={styles.featureCopy}>
            <View style={styles.featurePill}><Text style={styles.featurePillText}>✦  EM DESTAQUE</Text></View>
            <Text style={styles.featureHeading}>Pikachu</Text>
            <Text style={styles.featureSubtitle}>O elétrico mais famoso de Kanto!</Text>
            <View style={styles.featureAction}><Text style={styles.featureActionText}>Ver ficha  ↗</Text></View>
          </View>
          <Image source={{ uri: pikachu.artwork }} style={styles.featureImage} resizeMode="contain" />
        </Pressable>
      )}

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholder="Buscar por nome ou número..."
          placeholderTextColor="#7F90AB"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          accessibilityLabel="Pesquisar Pokémon"
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')} accessibilityRole="button" accessibilityLabel="Limpar pesquisa" style={styles.clearSearch}>
            <Text style={styles.clearText}>✕</Text>
          </Pressable>
        )}
      </View>

      {error && (
        <Pressable onPress={refresh} style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryInline}>Tocar para tentar novamente ↗</Text>
        </Pressable>
      )}

      <View style={styles.exploreHeader}>
        <View>
          <Text style={styles.exploreSubtitle}>POKÉDEX NACIONAL</Text>
          <Text style={styles.exploreTitle}>Descobrir Pokémon</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{filtered.length} / 151</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(pokemon) => String(pokemon.id)}
        renderItem={({ item }) => <PokemonCard pokemon={item} onPress={openDetails} />}
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
                <ActivityIndicator color={colors.red} size="large" />
                <Text style={styles.emptyText}>Conectando à PokéAPI...</Text>
              </>
            ) : (
              <>
                <Text style={styles.emptyEmoji}>{error ? '⚡' : '🔎'}</Text>
                <Text style={styles.emptyTitle}>{error ? 'Sem conexão' : 'Nenhum Pokémon encontrado'}</Text>
                <Text style={styles.emptyText}>{error ? 'Toca na mensagem acima para tentar novamente.' : 'Experimenta outro nome ou número.'}</Text>
              </>
            )}
          </View>
        }
        ListFooterComponent={
          filtered.length > 0 ? (
            <Text style={styles.footer}>Feito com ♥ e dados da PokéAPI</Text>
          ) : null
        }
      />
      <PokemonDetailsModal selected={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
  },
  content: { paddingHorizontal: 21, paddingTop: 19, paddingBottom: 26 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 34 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.red, overflow: 'hidden', borderWidth: 2, borderColor: colors.white, justifyContent: 'center', alignItems: 'center' },
  ballLine: { position: 'absolute', height: 5, width: 30, backgroundColor: colors.background },
  ballCenter: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.white, borderWidth: 3, borderColor: colors.background },
  brandText: { fontWeight: '900', fontSize: 22, color: colors.white, letterSpacing: -1.1 },
  brandAccent: { color: colors.red },
  editionBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 30, borderWidth: 1, borderColor: colors.stroke, backgroundColor: colors.surface, paddingHorizontal: 10, paddingVertical: 9 },
  onlineDot: { width: 6, height: 6, borderRadius: 4, backgroundColor: '#85D8B1' },
  editionText: { fontSize: 9, color: colors.mutedLight, letterSpacing: 0.75, fontWeight: '800' },
  eyebrow: { color: colors.red, fontWeight: '800', letterSpacing: 1.8, fontSize: 10, marginBottom: 9 },
  heading: { color: colors.white, fontSize: 37, lineHeight: 43, fontWeight: '900', letterSpacing: -1.7 },
  highlight: { color: colors.yellow },
  subtitle: { fontSize: 14, lineHeight: 23, color: colors.muted, marginTop: 10, marginBottom: 23 },
  feature: { height: 190, backgroundColor: '#F55B68', borderRadius: 25, overflow: 'hidden', position: 'relative', marginBottom: 26 },
  featureCircle: { position: 'absolute', width: 230, height: 230, borderRadius: 115, backgroundColor: '#FFFFFF1D', top: -23, right: -60 },
  featureCopy: { padding: 19, width: '64%', zIndex: 1 },
  featurePill: { backgroundColor: '#FFFFFF3B', borderRadius: 25, paddingHorizontal: 10, paddingVertical: 7, alignSelf: 'flex-start' },
  featurePillText: { color: colors.white, fontSize: 9, letterSpacing: 0.8, fontWeight: '900' },
  featureHeading: { color: colors.white, fontWeight: '900', fontSize: 30, marginTop: 15, letterSpacing: -0.7 },
  featureSubtitle: { color: '#FFF4F5', fontSize: 12, marginTop: 3, lineHeight: 17, fontWeight: '500' },
  featureAction: { backgroundColor: colors.background, borderRadius: 25, paddingHorizontal: 13, paddingVertical: 7, alignSelf: 'flex-start', marginTop: 12 },
  featureActionText: { color: colors.white, fontSize: 11, fontWeight: '800' },
  featureImage: { width: '50%', height: 162, position: 'absolute', bottom: 6, right: -10 },
  searchContainer: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.stroke, borderRadius: 17, height: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 },
  searchIcon: { color: colors.mutedLight, fontSize: 27, marginRight: 10 },
  searchInput: { color: colors.white, fontSize: 14, flex: 1, height: '100%' },
  clearSearch: { padding: 8 },
  clearText: { color: colors.muted, fontSize: 12 },
  errorBanner: { marginTop: 15, backgroundColor: '#482735', borderWidth: 1, borderColor: '#9D4D63', borderRadius: 13, padding: 12 },
  errorText: { color: '#FFE3E9', lineHeight: 19, fontSize: 12 },
  retryInline: { marginTop: 5, color: colors.white, fontSize: 11, fontWeight: '800' },
  exploreHeader: { marginTop: 31, marginBottom: 17, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  exploreSubtitle: { color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginBottom: 6 },
  exploreTitle: { color: colors.white, fontSize: 21, fontWeight: '900', letterSpacing: -0.5 },
  countBadge: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.stroke, borderRadius: 20, paddingHorizontal: 11, paddingVertical: 7 },
  countText: { color: colors.mutedLight, fontSize: 11, fontWeight: '800' },
  columns: { gap: 13 },
  empty: { minHeight: 220, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18, gap: 10 },
  emptyEmoji: { fontSize: 34 },
  emptyTitle: { color: colors.white, fontSize: 17, fontWeight: '800', textAlign: 'center' },
  emptyText: { color: colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 19 },
  footer: { color: colors.muted, textAlign: 'center', marginTop: 14, fontSize: 11 },
});

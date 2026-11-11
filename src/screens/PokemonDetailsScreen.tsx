import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, Chip, ProgressBar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFavorites } from '../context/FavoritesContext';
import { getPokemonDetails } from '../services/pokeapi';
import { colors } from '../theme/colors';
import type { PokemonDetails } from '../types/pokemon';
import type { RootStackParamList } from '../../App';
import { capitalize, formatId, formatMetric, STAT_NAMES, TYPE_COLORS, TYPE_NAMES } from '../utils/pokemon';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function PokemonDetailsScreen({ route }: Props) {
  const { pokemon } = route.params;
  const { ready, isFavorite, toggleFavorite } = useFavorites();
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;
    setDetails(null);
    setLoading(true);
    setError(null);
    getPokemonDetails(pokemon.id)
      .then((data) => { if (active) setDetails(data); })
      .catch(() => { if (active) setError('Não foi possível carregar a ficha. Verifica a conexão.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [pokemon.id, retryKey]);

  const mainType = details?.types[0]?.type.name ?? 'normal';
  const accent = TYPE_COLORS[mainType] ?? colors.red;
  const artwork = details?.sprites.other?.['official-artwork']?.front_default ?? pokemon.artwork;
  const favorite = isFavorite(pokemon.id);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card mode="contained" style={[styles.hero, { backgroundColor: accent + '28' }]}>
          <Card.Content style={styles.heroContent}>
            <Text style={styles.number}>{formatId(pokemon.id)}</Text>
            <Image source={{ uri: artwork }} style={styles.image} resizeMode="contain" />
          </Card.Content>
        </Card>

        <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
        <Button
          mode={favorite ? 'contained' : 'outlined'}
          icon={favorite ? 'heart' : 'heart-outline'}
          buttonColor={favorite ? colors.red : undefined}
          textColor={colors.white}
          style={styles.favoriteButton}
          disabled={!ready}
          onPress={() => toggleFavorite(pokemon)}
        >
          {favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        </Button>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.red} />
            <Text style={styles.helper}>Carregando informações da PokéAPI...</Text>
          </View>
        )}

        {error && (
          <View style={styles.center}>
            <Text style={styles.helper}>{error}</Text>
            <Button mode="contained" icon="reload" onPress={() => setRetryKey((value) => value + 1)}>
              Tentar novamente
            </Button>
          </View>
        )}

        {details && (
          <>
            <View style={styles.types}>
              {details.types.slice().sort((a, b) => a.slot - b.slot).map(({ type }) => (
                <Chip
                  key={type.name}
                  style={[styles.typeChip, { backgroundColor: TYPE_COLORS[type.name] ?? colors.surfaceHighlight }]}
                  textStyle={{ color: colors.background, fontWeight: '900' }}
                >
                  {TYPE_NAMES[type.name] ?? capitalize(type.name)}
                </Chip>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Sobre</Text>
            <View style={styles.metrics}>
              <Card mode="contained" style={styles.metricCard}>
                <Card.Content>
                  <Text style={styles.metricLabel}>ALTURA</Text>
                  <Text style={styles.metricValue}>{formatMetric(details.height, 10, 'm')}</Text>
                </Card.Content>
              </Card>
              <Card mode="contained" style={styles.metricCard}>
                <Card.Content>
                  <Text style={styles.metricLabel}>PESO</Text>
                  <Text style={styles.metricValue}>{formatMetric(details.weight, 10, 'kg')}</Text>
                </Card.Content>
              </Card>
            </View>

            <Text style={styles.sectionTitle}>Habilidades</Text>
            <Card mode="contained" style={styles.box}>
              <Card.Content>
                <Text style={styles.abilities}>
                  {details.abilities.map((item) => capitalize(item.ability.name)).join('  •  ')}
                </Text>
              </Card.Content>
            </Card>

            <Text style={styles.sectionTitle}>Atributos base</Text>
            <Card mode="contained" style={styles.box}>
              <Card.Content style={styles.stats}>
                {details.stats.map(({ stat, base_stat }) => (
                  <View key={stat.name} style={styles.statRow}>
                    <View style={styles.statHeader}>
                      <Text style={styles.statLabel}>{STAT_NAMES[stat.name] ?? capitalize(stat.name)}</Text>
                      <Text style={styles.statValue}>{base_stat}</Text>
                    </View>
                    <ProgressBar
                      progress={Math.min(1, base_stat / 180)}
                      color={accent}
                      style={styles.progress}
                    />
                  </View>
                ))}
              </Card.Content>
            </Card>
            <Text style={styles.credit}>Fonte: PokéAPI • pokeapi.co</Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 19, paddingTop: 18, paddingBottom: 38 },
  hero: { borderRadius: 26, overflow: 'hidden' },
  heroContent: { height: 226, alignItems: 'center', justifyContent: 'center' },
  number: { color: colors.mutedLight, alignSelf: 'flex-end', fontWeight: '900', fontSize: 13, marginBottom: 1 },
  image: { width: '80%', height: 192 },
  name: { fontSize: 33, fontWeight: '900', textAlign: 'center', color: colors.white, marginTop: 15 },
  favoriteButton: { marginTop: 13, alignSelf: 'center', borderColor: colors.red },
  center: { alignItems: 'center', paddingVertical: 30, gap: 15 },
  helper: { color: colors.mutedLight, textAlign: 'center', lineHeight: 21 },
  types: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 8, marginTop: 21 },
  typeChip: { borderRadius: 20 },
  sectionTitle: { color: colors.white, fontWeight: '900', fontSize: 18, marginTop: 25, marginBottom: 12 },
  metrics: { flexDirection: 'row', gap: 12 },
  metricCard: { backgroundColor: colors.surface, flex: 1, borderRadius: 16 },
  metricLabel: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  metricValue: { color: colors.white, fontSize: 20, fontWeight: '800', marginTop: 5 },
  box: { backgroundColor: colors.surface, borderRadius: 16 },
  abilities: { color: colors.mutedLight, fontSize: 14, lineHeight: 22 },
  stats: { gap: 17, paddingVertical: 19 },
  statRow: { gap: 8 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { color: colors.mutedLight, fontSize: 12 },
  statValue: { color: colors.white, fontSize: 12, fontWeight: '900' },
  progress: { backgroundColor: colors.stroke, height: 8, borderRadius: 8 },
  credit: { color: colors.muted, fontSize: 11, textAlign: 'center', marginTop: 25 },
});

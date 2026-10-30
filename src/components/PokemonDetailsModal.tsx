import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getPokemonDetails } from '../services/pokeapi';
import { colors } from '../theme/colors';
import type { PokemonDetails, PokemonPreview } from '../types/pokemon';
import {
  capitalize,
  formatId,
  formatMetric,
  STAT_NAMES,
  TYPE_COLORS,
  TYPE_NAMES,
} from '../utils/pokemon';

type Props = {
  selected: PokemonPreview | null;
  onClose: () => void;
};

export function PokemonDetailsModal({ selected, onClose }: Props) {
  const [details, setDetails] = useState<PokemonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!selected) return;
    let active = true;
    setDetails(null);
    setError(null);
    setIsLoading(true);

    getPokemonDetails(selected.id)
      .then((response) => {
        if (active) setDetails(response);
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar os detalhes. Verifica tua conexão.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => { active = false; };
  }, [selected?.id, retryKey]);

  const mainType = details?.types[0]?.type.name ?? 'normal';
  const accent = TYPE_COLORS[mainType] ?? colors.red;
  const imageUrl = details?.sprites.other?.['official-artwork']?.front_default
    ?? selected?.artwork;

  return (
    <Modal
      visible={selected !== null}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      statusBarTranslucent={false}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <Text style={styles.topCaption}>POKÉPOCKET / FICHA</Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar detalhes" style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {selected && (
            <>
              <View style={[styles.hero, { backgroundColor: accent + '2B' }]}>
                <View style={[styles.heroCircle, { backgroundColor: accent + '24' }]} />
                <Text style={styles.heroId}>{formatId(selected.id)}</Text>
                {imageUrl && <Image source={{ uri: imageUrl }} style={styles.heroImage} resizeMode="contain" />}
              </View>
              <Text style={styles.name}>{capitalize(selected.name)}</Text>
            </>
          )}

          {isLoading && (
            <View style={styles.centerArea}>
              <ActivityIndicator size="large" color={colors.red} />
              <Text style={styles.helper}>Carregando informações da PokéAPI...</Text>
            </View>
          )}

          {error && (
            <View style={styles.centerArea}>
              <Text style={styles.helper}>{error}</Text>
              <Pressable onPress={() => setRetryKey((value) => value + 1)} style={styles.retryButton}>
                <Text style={styles.retryText}>Tentar novamente</Text>
              </Pressable>
            </View>
          )}

          {details && (
            <>
              <View style={styles.typeRow}>
                {details.types
                  .slice()
                  .sort((a, b) => a.slot - b.slot)
                  .map(({ type }) => (
                    <View key={type.name} style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[type.name] ?? colors.surfaceHighlight }]}>
                      <Text style={styles.typeText}>{TYPE_NAMES[type.name] ?? capitalize(type.name)}</Text>
                    </View>
                  ))}
              </View>

              <Text style={styles.sectionTitle}>Sobre</Text>
              <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>ALTURA</Text>
                  <Text style={styles.infoValue}>{formatMetric(details.height, 10, 'm')}</Text>
                </View>
                <View style={styles.infoBox}>
                  <Text style={styles.infoLabel}>PESO</Text>
                  <Text style={styles.infoValue}>{formatMetric(details.weight, 10, 'kg')}</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Habilidades</Text>
              <Text style={styles.abilities}>{details.abilities.map((item) => capitalize(item.ability.name)).join('  •  ')}</Text>

              <Text style={styles.sectionTitle}>Atributos base</Text>
              <View style={styles.statsBox}>
                {details.stats.map(({ stat, base_stat }) => (
                  <View key={stat.name} style={styles.statRow}>
                    <Text style={styles.statName} numberOfLines={1}>{STAT_NAMES[stat.name] ?? capitalize(stat.name)}</Text>
                    <Text style={styles.statNumber}>{base_stat}</Text>
                    <View style={styles.statTrack}>
                      <View
                        style={[
                          styles.statFill,
                          {
                            backgroundColor: accent,
                            width: (Math.min(100, Math.max(3, (base_stat / 180) * 100)) + '%') as import('react-native').DimensionValue,
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
              <Text style={styles.attribution}>Informações: PokéAPI • pokeapi.co</Text>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 24, paddingTop: 22, paddingBottom: 42 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  topCaption: { color: colors.muted, letterSpacing: 2.1, fontSize: 10, fontWeight: '800' },
  closeButton: { backgroundColor: colors.surface, width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  hero: { height: 241, borderRadius: 29, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  heroCircle: { position: 'absolute', width: 245, height: 245, borderRadius: 123, top: 18 },
  heroId: { position: 'absolute', top: 18, right: 23, color: colors.mutedLight, fontWeight: '800', fontSize: 13 },
  heroImage: { width: '76%', height: '90%' },
  name: { color: colors.white, textAlign: 'center', fontSize: 34, fontWeight: '900', marginTop: 17, marginBottom: 8 },
  typeRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 17 },
  typeBadge: { borderRadius: 30, paddingHorizontal: 17, paddingVertical: 8, marginHorizontal: 4, marginTop: 4 },
  typeText: { color: colors.background, fontSize: 13, fontWeight: '900' },
  sectionTitle: { color: colors.white, fontSize: 18, fontWeight: '800', marginTop: 23, marginBottom: 12 },
  infoRow: { flexDirection: 'row', gap: 12 },
  infoBox: { flex: 1, backgroundColor: colors.surface, padding: 17, borderRadius: 17 },
  infoLabel: { fontSize: 10, color: colors.muted, letterSpacing: 1.1, fontWeight: '800' },
  infoValue: { fontSize: 19, color: colors.white, fontWeight: '800', marginTop: 8 },
  abilities: { color: colors.mutedLight, fontSize: 15, lineHeight: 24 },
  statsBox: { backgroundColor: colors.surface, borderRadius: 18, padding: 17, gap: 14 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  statName: { width: 84, color: colors.mutedLight, fontSize: 11, fontWeight: '600' },
  statNumber: { width: 28, color: colors.white, fontSize: 12, fontWeight: '800', textAlign: 'right' },
  statTrack: { flex: 1, height: 8, backgroundColor: colors.stroke, borderRadius: 10, overflow: 'hidden' },
  statFill: { height: '100%', borderRadius: 10 },
  attribution: { color: colors.muted, fontSize: 11, textAlign: 'center', marginTop: 26 },
  centerArea: { paddingVertical: 28, alignItems: 'center', gap: 14 },
  helper: { color: colors.mutedLight, textAlign: 'center', lineHeight: 22 },
  retryButton: { backgroundColor: colors.red, borderRadius: 11, paddingHorizontal: 17, paddingVertical: 12 },
  retryText: { color: colors.white, fontWeight: '800' },
});

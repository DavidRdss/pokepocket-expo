import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import type { PokemonPreview } from '../types/pokemon';
import { capitalize, CARD_COLORS, formatId } from '../utils/pokemon';

type Props = {
  pokemon: PokemonPreview;
  onPress: (pokemon: PokemonPreview) => void;
};

export function PokemonCard({ pokemon, onPress }: Props) {
  const cardColor = CARD_COLORS[(pokemon.id - 1) % CARD_COLORS.length];

  return (
    <Pressable
      onPress={() => onPress(pokemon)}
      accessibilityRole="button"
      accessibilityLabel={'Ver detalhes de ' + capitalize(pokemon.name)}
      style={({ pressed }) => [styles.card, { backgroundColor: cardColor, opacity: pressed ? 0.8 : 1 }]}
    >
      <View style={styles.circle} />
      <Text style={styles.id}>{formatId(pokemon.id)}</Text>
      <Image source={{ uri: pokemon.artwork }} style={styles.artwork} resizeMode="contain" />
      <Text style={styles.name} numberOfLines={1}>{capitalize(pokemon.name)}</Text>
      <View style={styles.bottomRow}>
        <Text style={styles.more}>Ver detalhes</Text>
        <Text style={styles.arrow}>↗</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    height: 219,
    borderRadius: 23,
    marginBottom: 14,
    padding: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFFFFF12',
  },
  circle: {
    position: 'absolute',
    width: 155,
    height: 155,
    borderRadius: 100,
    backgroundColor: '#FFFFFF10',
    top: -31,
    right: -38,
  },
  id: { color: '#FFFFFFA6', fontWeight: '800', fontSize: 12, letterSpacing: 0.9 },
  artwork: { width: '100%', height: 116, alignSelf: 'center', marginTop: 0 },
  name: { fontSize: 17, color: colors.white, fontWeight: '800', marginTop: 0 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  more: { fontSize: 11, color: '#E6EDFBBD', fontWeight: '600' },
  arrow: { fontSize: 17, color: colors.white },
});

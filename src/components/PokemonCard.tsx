import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import { colors } from '../theme/colors';
import type { PokemonPreview } from '../types/pokemon';
import { capitalize, CARD_COLORS, formatId } from '../utils/pokemon';

type Props = {
  pokemon: PokemonPreview;
  onPress: (pokemon: PokemonPreview) => void;
  isFavorite: boolean;
  onToggleFavorite: (pokemon: PokemonPreview) => void;
  favoriteDisabled?: boolean;
};

export function PokemonCard({ pokemon, onPress, isFavorite, onToggleFavorite, favoriteDisabled = false }: Props) {
  const cardColor = CARD_COLORS[(pokemon.id - 1) % CARD_COLORS.length];

  return (
    <Card
      mode="contained"
      onPress={() => onPress(pokemon)}
      accessibilityLabel={'Ver detalhes de ' + capitalize(pokemon.name)}
      style={[styles.card, { backgroundColor: cardColor }]}
    >
      <Card.Content style={styles.content}>
        <View style={styles.circle} />
        <Text style={styles.number}>{formatId(pokemon.id)}</Text>
        <IconButton
          icon={isFavorite ? 'heart' : 'heart-outline'}
          iconColor={isFavorite ? colors.red : colors.white}
          size={21}
          disabled={favoriteDisabled}
          onPress={() => onToggleFavorite(pokemon)}
          accessibilityLabel={(isFavorite ? 'Remover ' : 'Adicionar ') + capitalize(pokemon.name) + (isFavorite ? ' dos favoritos' : ' aos favoritos')}
          style={styles.heartButton}
        />
        <Image source={{ uri: pokemon.artwork }} style={styles.artwork} resizeMode="contain" />
        <Text style={styles.name} numberOfLines={1}>{capitalize(pokemon.name)}</Text>
        <View style={styles.bottom}>
          <Text style={styles.hint}>Ver detalhes</Text>
          <Text style={styles.arrow}>↗</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 0, height: 217, borderRadius: 23, marginBottom: 13, overflow: 'hidden' },
  content: { padding: 14, paddingBottom: 14, flex: 1 },
  circle: { position: 'absolute', width: 155, height: 155, borderRadius: 78, backgroundColor: '#FFFFFF10', top: -31, right: -41 },
  number: { color: '#FFFFFFB3', fontWeight: '800', fontSize: 11, letterSpacing: 0.8 },
  heartButton: { position: 'absolute', right: 1, top: -7, zIndex: 2 },
  artwork: { width: '100%', height: 120, marginTop: 6, alignSelf: 'center' },
  name: { fontSize: 17, color: colors.white, fontWeight: '900', marginTop: 0 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
  hint: { color: '#DBE3F0', fontSize: 11 },
  arrow: { color: colors.white, fontSize: 16, fontWeight: '800' },
});

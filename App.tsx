import React, { useCallback } from 'react';
import { StatusBar } from 'react-native';
import { DarkTheme as NavigationDarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, type NativeStackScreenProps } from '@react-navigation/native-stack';
import { Icon, MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { FavoritesScreen } from './src/screens/FavoritesScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { PokemonDetailsScreen } from './src/screens/PokemonDetailsScreen';
import { colors } from './src/theme/colors';
import type { PokemonPreview } from './src/types/pokemon';

export type RootStackParamList = {
  MainTabs: undefined;
  Details: { pokemon: PokemonPreview };
};

type TabParamList = {
  Pokedex: undefined;
  Favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

const paperTheme = {
  ...MD3DarkTheme,
  roundness: 5,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.red,
    secondary: colors.yellow,
    background: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceHighlight,
    onBackground: colors.white,
    onSurface: colors.white,
    onSurfaceVariant: colors.mutedLight,
    outline: colors.stroke,
  },
};

const navigationTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: colors.red,
    background: colors.background,
    card: colors.surface,
    text: colors.white,
    border: colors.stroke,
  },
};

function MainTabs({ navigation }: NativeStackScreenProps<RootStackParamList, 'MainTabs'>) {
  const openDetails = useCallback(
    (pokemon: PokemonPreview) => navigation.navigate('Details', { pokemon }),
    [navigation]
  );

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.red,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '800', marginBottom: 3 },
        tabBarStyle: {
          height: 65,
          backgroundColor: colors.surface,
          borderTopColor: colors.stroke,
          paddingTop: 5,
        },
        tabBarIcon: ({ focused, color, size }) => (
          <Icon
            source={
              route.name === 'Pokedex'
                ? (focused ? 'compass' : 'compass-outline')
                : (focused ? 'heart' : 'heart-outline')
            }
            color={color}
            size={size}
          />
        ),
      })}
    >
      <Tabs.Screen name="Pokedex" options={{ title: 'Explorar' }}>
        {() => <HomeScreen onOpen={openDetails} />}
      </Tabs.Screen>
      <Tabs.Screen name="Favorites" options={{ title: 'Favoritos' }}>
        {() => <FavoritesScreen onOpen={openDetails} />}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PaperProvider theme={paperTheme}>
        <FavoritesProvider>
          <StatusBar barStyle="light-content" backgroundColor={colors.background} />
          <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: colors.surface },
                headerTintColor: colors.white,
                headerTitleStyle: { fontWeight: '800' },
                contentStyle: { backgroundColor: colors.background },
              }}
            >
              <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
              <Stack.Screen
                name="Details"
                component={PokemonDetailsScreen}
                options={({ route }) => ({ title: route.params.pokemon.name.toUpperCase() })}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </FavoritesProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

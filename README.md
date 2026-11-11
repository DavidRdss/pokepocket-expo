# PokéPocket | Atividade Individual 05

Aplicativo de **React Native + Expo + TypeScript** que consulta a PokéAPI, exibe os 151 Pokémon de Kanto, possui **navegação entre telas**, utiliza **React Native Paper** e salva Pokémon favoritos com **AsyncStorage**.

## Requisitos atendidos

| Requisito | Implementação |
| --- | --- |
| React Native + Expo | Expo SDK 57 e TypeScript |
| Consumo de API | PokéAPI REST com fetch: lista e fichas detalhadas |
| Navegação entre telas | React Navigation com duas abas e uma rota Stack |
| React Native Paper | PaperProvider, tema MD3, Card, Searchbar, Button, Chip, IconButton e ProgressBar |
| AsyncStorage | Favoritos persistidos localmente entre sessões |
| Repositório público | https://github.com/DavidRdss/pokepocket-expo |

## As três telas

1. **Explorar:** lista dos 151 Pokémon, busca por nome ou número, arte oficial, botão de favoritos, atualização por gesto e tratamento de erros.
2. **Favoritos:** mostra os Pokémon salvos no armazenamento do celular, mesmo quando a API está indisponível.
3. **Detalhes:** rota independente com imagem, tipo, peso, altura, habilidades, atributos e botão para favoritar/desfavoritar.

## Como executar

Requer Node.js 22.13 ou superior, Expo Go compatível com SDK 57 ou emulador.

1. Clone: `git clone https://github.com/DavidRdss/pokepocket-expo.git`
2. Entre na pasta: `cd pokepocket-expo`
3. Instale: `npm install`
4. Inicie: `npx expo start`
5. Abra o QR Code pelo Expo Go ou execute no emulador.

Conferência do TypeScript: `npm run typecheck`.

Se o teu Expo Go tiver SDK incompatível, consulta https://expo.dev/go.

## Teste dos requisitos

- **API:** pesquisa Pikachu em Explorar, toca no card e consulta sua ficha. A API carrega dados em tempo real.
- **Rotas:** navega entre Explorar e Favoritos, entra na ficha e retorna pela seta da barra superior.
- **Paper:** Searchbar, cards, ícones, botões, chips e barras de status usam React Native Paper com tema escuro.
- **AsyncStorage:** toca no coração do Pikachu, abre Favoritos, fecha o aplicativo e abre novamente. O Pokémon continua salvo.
- **Rede:** sem conexão, o app oferece nova tentativa de acesso à API, enquanto os favoritos anteriormente salvos seguem disponíveis.

## Estrutura principal

- `App.tsx`: provedor Paper, tema, abas e Stack navigator.
- `src/screens/HomeScreen.tsx`: busca, atualização e listagem da API.
- `src/screens/FavoritesScreen.tsx`: favoritos armazenados no aparelho.
- `src/screens/PokemonDetailsScreen.tsx`: rota de detalhes.
- `src/components/PokemonCard.tsx`: card do Paper com botão de coração.
- `src/context/FavoritesContext.tsx`: estado compartilhado e persistência no AsyncStorage.
- `src/services/pokeapi.ts`: chamadas HTTP e cache em memória.
- `src/types/pokemon.ts`: tipos TypeScript.
- `src/theme/colors.ts` e `src/utils/pokemon.ts`: paleta e formatação.

**Chave AsyncStorage:** `@pokepocket:favorites:v1`. O estado é restaurado antes da primeira gravação, evitando apagar dados antigos. Cada favorito guarda id, nome e URL da imagem.

**API:** https://pokeapi.co/api/v2/pokemon?limit=151&offset=0

**Referências:** https://docs.expo.dev/ | https://reactnavigation.org/ | https://callstack.github.io/react-native-paper/ | https://react-native-async-storage.github.io/async-storage/ | https://pokeapi.co/docs/v2

Projeto educacional, sem finalidade comercial. Dados fornecidos pela PokéAPI; personagens e artes Pokémon pertencem aos seus titulares.

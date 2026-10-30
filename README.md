# ⚡ PokéPocket

Pokédex desenvolvida em **React Native + Expo + TypeScript**, com consumo real da API pública **PokéAPI**.

## Funcionalidades

- Exibe os 151 Pokémon originais de Kanto.
- Consome dados com requisições HTTP usando fetch.
- Busca instantânea por nome ou número.
- Mostra imagens, tipos, habilidades, peso, altura e atributos.
- Exibe estados de carregamento e falha de rede, com opção de tentar novamente.
- Atualização da lista por gesto de puxar para baixo.
- Cache em memória para reduzir requisições à API.
- Interface em português.

## Tecnologias

- React Native
- Expo SDK 57
- TypeScript
- API REST PokéAPI v2

## Como rodar

1. Instale Node.js 22.13 ou superior.
2. Clone o repositório: https://github.com/DavidRdss/pokepocket-expo
3. Abra a pasta no terminal e execute:

    npm install
    npm start

4. Abra no Expo Go compatível com SDK 57 ou em um emulador Android/iOS. Para instalações compatíveis do Expo Go, consulte https://expo.dev/go.

Para conferir tipos: npm run typecheck

## API utilizada

- Lista: https://pokeapi.co/api/v2/pokemon?limit=151&offset=0
- Detalhes: https://pokeapi.co/api/v2/pokemon/25 (exemplo com Pikachu)
- Arte: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png

A lista é solicitada em apenas uma chamada; os detalhes são buscados sob demanda.

## Organização

- App.tsx: tela principal, pesquisa e atualização.
- src/components/PokemonCard.tsx: cards da listagem.
- src/components/PokemonDetailsModal.tsx: tela detalhada.
- src/services/pokeapi.ts: consumo da API e cache.
- src/types/pokemon.ts: tipos de dados da API.
- src/utils/pokemon.ts: traduções e formatação.
- src/theme/colors.ts: paleta de cores.
- assets/: ícones.

## Licença e créditos

Código sob a licença MIT. Dados fornecidos pela PokéAPI. Nomes e imagens Pokémon pertencem aos respectivos titulares. Projeto educacional e sem finalidade comercial.

Documentação: https://docs.expo.dev/ e https://pokeapi.co/docs/v2

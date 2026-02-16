# Pomodoro Timer

Aplicativo mobile de **Pomodoro Timer** construido com React Native e Expo. Funciona em Android (celulares e tablets) e iOS (iPhone e iPad).

## Funcionalidades

- **Timer Pomodoro** com fases de trabalho, pausa curta e pausa longa
- **Estatisticas** de uso e produtividade
- **Configuracoes** personalizaveis (duracao das fases, notificacoes, etc.)
- **Modo escuro e claro** com deteccao automatica do sistema
- **Notificacoes** para alertar o fim de cada fase
- **Feedback haptico** durante interacoes
- **Acessibilidade** com suporte a leitores de tela

## Stack Tecnologico

| Camada | Tecnologia |
|---|---|
| Framework | React Native com Expo (Managed Workflow) |
| Linguagem | TypeScript (strict mode) |
| Navegacao | Expo Router (file-based routing) |
| Estado Global | Zustand |
| Armazenamento Local | AsyncStorage |
| Notificacoes | expo-notifications |
| Testes | Jest + React Native Testing Library |

## Estrutura do Projeto

```
app/                  # Rotas (Expo Router)
  (tabs)/             # Telas principais (Timer, Estatisticas, Configuracoes)
components/           # Componentes reutilizaveis
  ui/                 # Componentes genericos (Button, Card, etc.)
  timer/              # Componentes do timer
constants/            # Constantes (cores, espacamentos, tipografia)
hooks/                # Custom hooks
stores/               # Stores Zustand (estado global)
types/                # Tipos TypeScript
utils/                # Funcoes utilitarias
assets/               # Imagens, fontes e sons
__tests__/            # Testes
```

## Pre-requisitos

Antes de comecar, certifique-se de ter instalado:

- **Node.js** (versao 18 ou superior) — [nodejs.org](https://nodejs.org)
- **npm** (incluido com o Node.js)
- **Expo Go** no celular — disponivel na [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS) e [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)

## Rodando o Projeto Localmente

### 1. Clone o repositorio

```bash
git clone https://github.com/muhtorres/vibecoded-pomodoro-app.git
cd vibecoded-pomodoro-app
```

### 2. Instale as dependencias

```bash
npm install
```

### 3. Inicie o servidor de desenvolvimento

```bash
npx expo start
```

Isso vai iniciar o Metro Bundler e exibir um QR Code no terminal.

## Testando no Celular

### Com o Expo Go

1. Certifique-se de que o celular e o computador estao na **mesma rede Wi-Fi**
2. Abra o app **Expo Go** no celular
3. **Android**: Escaneie o QR Code exibido no terminal usando o Expo Go
4. **iOS**: Escaneie o QR Code usando a camera do iPhone — o link vai abrir no Expo Go

Se a conexao por Wi-Fi nao funcionar, use o modo tunnel:

```bash
npx expo start --tunnel
```

### Com emulador/simulador

```bash
# Android (requer Android Studio com emulador configurado)
npx expo start --android

# iOS (requer Xcode — apenas macOS)
npx expo start --ios
```

## Comandos Uteis

```bash
# Executar testes
npm test

# Executar testes com cobertura
npm run test:coverage

# Verificar tipos TypeScript
npx tsc --noEmit

# Lint
npx expo lint
```

## Licenca

Este projeto e privado e de uso pessoal.

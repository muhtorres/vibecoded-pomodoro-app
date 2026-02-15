# CLAUDE.md — Guia de Desenvolvimento

## Visao Geral do Projeto

App mobile **Pomodoro Timer** construido com React Native (Expo). O app deve funcionar em **Android** (celulares e tablets) e **iOS** (iPhone e iPad), seguindo as melhores praticas de usabilidade, compatibilidade e seguranca.

---

## Stack Tecnologico

| Camada | Tecnologia |
|---|---|
| Framework | React Native com Expo (Managed Workflow) |
| Linguagem | TypeScript (strict mode) |
| Navegacao | Expo Router (file-based routing) |
| Estado Global | Zustand |
| Estilizacao | StyleSheet nativo do React Native + Nativewind (Tailwind para RN) |
| Armazenamento Local | expo-secure-store (dados sensiveis) e @react-native-async-storage/async-storage (preferencias) |
| Notificacoes | expo-notifications |
| Testes | Jest + React Native Testing Library |
| Linting | ESLint com config do Expo |
| Formatacao | Prettier |

---

## Estrutura de Pastas

```
vibecoded-pomodoro-app/
├── app/                    # Rotas (Expo Router — file-based routing)
│   ├── (tabs)/             # Layout de tabs principais
│   │   ├── index.tsx       # Tela do Timer (home)
│   │   ├── stats.tsx       # Tela de Estatisticas
│   │   └── settings.tsx    # Tela de Configuracoes
│   ├── _layout.tsx         # Layout raiz
│   └── +not-found.tsx      # Tela 404
├── components/             # Componentes reutilizaveis
│   ├── ui/                 # Componentes de UI genericos (Button, Card, etc.)
│   └── timer/              # Componentes especificos do timer
├── constants/              # Constantes da aplicacao (cores, duracoes padrao, etc.)
├── hooks/                  # Custom hooks
├── stores/                 # Stores do Zustand
├── types/                  # Tipos TypeScript globais
├── utils/                  # Funcoes utilitarias
├── assets/                 # Imagens, fontes, sons
│   ├── fonts/
│   ├── images/
│   └── sounds/
├── __tests__/              # Testes
├── app.json                # Configuracao do Expo
├── tsconfig.json           # Configuracao TypeScript
├── package.json
└── CLAUDE.md               # Este arquivo
```

---

## Comandos de Desenvolvimento

```bash
# Instalar dependencias
npx expo install

# Iniciar servidor de desenvolvimento
npx expo start

# Rodar no Android
npx expo run:android

# Rodar no iOS
npx expo run:ios

# Executar testes
npx jest

# Executar testes com coverage
npx jest --coverage

# Lint
npx expo lint

# Formatar codigo
npx prettier --write .

# Type check
npx tsc --noEmit
```

---

## Convencoes de Codigo

### TypeScript

- **Strict mode obrigatorio** — nunca usar `any` sem justificativa explicita
- Preferir `interface` para objetos e `type` para unions/intersections
- Exportar tipos junto com seus modulos (co-location)
- Usar `as const` para constantes literais

### Componentes React Native

- **Componentes funcionais** com arrow functions
- Nomear arquivos em **PascalCase** para componentes: `TimerDisplay.tsx`
- Nomear arquivos em **camelCase** para hooks e utils: `useTimer.ts`, `formatTime.ts`
- Um componente por arquivo
- Props tipadas com interface dedicada:

```tsx
interface TimerDisplayProps {
  remainingSeconds: number;
  isRunning: boolean;
}

export const TimerDisplay = ({ remainingSeconds, isRunning }: TimerDisplayProps) => {
  // ...
};
```

### Estilos

- Usar `StyleSheet.create()` no final do arquivo do componente
- Evitar estilos inline exceto para valores dinamicos
- Usar constantes de design tokens (cores, espacamentos, tipografia) em `constants/theme.ts`
- Sempre testar layouts em telas de tamanhos variados (celular e tablet)

### Estado

- Estado local: `useState` e `useReducer`
- Estado global: Zustand stores em `stores/`
- Nomear stores como: `useTimerStore.ts`, `useSettingsStore.ts`
- Persistir estado quando necessario com middleware do Zustand + AsyncStorage

---

## Compatibilidade Multi-Plataforma

### Regras obrigatorias

1. **Nunca** usar APIs exclusivas de uma plataforma sem fallback para a outra
2. Usar `Platform.OS` e `Platform.select()` quando comportamento especifico for necessario
3. Testar dimensoes responsivas — usar `useWindowDimensions()` ao inves de `Dimensions.get()`
4. Suportar orientacao portrait e landscape em tablets
5. Respeitar Safe Areas com `SafeAreaView` ou `useSafeAreaInsets()`
6. Respeitar tamanhos de fonte do sistema (acessibilidade) — nao fixar fontScale
7. Suportar modo escuro e modo claro com `useColorScheme()`

### Tamanhos minimos de toque

- Seguir guidelines de acessibilidade: **minimo 44x44 pontos** para alvos de toque
- Usar `hitSlop` quando o elemento visual for menor que a area de toque

---

## Seguranca

- **Nunca** armazenar dados sensiveis em AsyncStorage — usar `expo-secure-store`
- **Nunca** fazer log de informacoes sensiveis em producao
- Validar toda entrada do usuario
- Manter dependencias atualizadas — rodar `npx expo doctor` regularmente
- Configurar `app.json` com permissoes minimas necessarias
- Usar HTTPS para qualquer comunicacao de rede

---

## Acessibilidade (a11y)

- Adicionar `accessibilityLabel` em todos os elementos interativos
- Adicionar `accessibilityRole` apropriado (button, timer, header, etc.)
- Adicionar `accessibilityState` para estados dinamicos (selected, disabled, etc.)
- Testar com leitor de tela (VoiceOver no iOS, TalkBack no Android)
- Garantir contraste minimo de 4.5:1 para texto
- Suportar reducao de movimento (`useReducedMotion()`)

---

## Testes

### Estrategia

- **Unitarios**: Funcoes utilitarias e stores — Jest puro
- **Componentes**: Renderizacao e interacao — React Native Testing Library
- **Nomenclatura**: `ComponentName.test.tsx` ou `utilName.test.ts`
- Co-locar testes com o codigo fonte ou no diretorio `__tests__/`

### Regras

- Todo novo componente deve ter pelo menos um teste de renderizacao
- Toda funcao utilitaria deve ter testes cobrindo edge cases
- Stores devem ter testes para cada action
- Mocks devem ficar em `__mocks__/` na raiz ou co-locados

---

## Performance

- Usar `React.memo()` apenas quando medido como necessario — nao otimizar prematuramente
- Usar `useCallback` e `useMemo` para referencias estaveis passadas como props
- Evitar re-renders desnecessarios — extrair estado para o nivel mais baixo possivel
- Usar `FlatList` para listas longas (nunca `ScrollView` com `.map()`)
- Minimizar o uso de `useEffect` — preferir event handlers

---

## Git e Workflow

### Branches

- `main` — branch de producao, protegida
- `develop` — branch de desenvolvimento
- `feature/*` — novas funcionalidades
- `fix/*` — correcoes de bugs
- `claude/*` — branches criadas por assistentes AI

### Commits

- Usar **Conventional Commits** em portugues:
  - `feat: adicionar tela de configuracoes`
  - `fix: corrigir contagem regressiva pausando incorretamente`
  - `refactor: extrair logica do timer para custom hook`
  - `test: adicionar testes para useTimerStore`
  - `docs: atualizar CLAUDE.md`
  - `chore: atualizar dependencias do Expo`
- Commits atomicos — uma mudanca logica por commit
- Mensagens claras e descritivas

### Pull Requests

- Titulo curto e descritivo (max 70 caracteres)
- Descricao com contexto, mudancas feitas e como testar
- Sempre rodar lint e testes antes de abrir PR

---

## Instrucoes para Assistentes AI

1. **Sempre** ler os arquivos existentes antes de modificar
2. **Nunca** criar arquivos desnecessarios — preferir editar existentes
3. **Sempre** seguir os padroes ja estabelecidos no codigo
4. **Rodar** lint e testes apos mudancas significativas
5. **Nao** adicionar dependencias sem justificativa clara
6. **Nao** sobre-engenheirar — manter solucoes simples e focadas
7. **Commitar** com mensagens seguindo Conventional Commits
8. **Respeitar** as convencoes de nomenclatura e estrutura de pastas
9. **Testar** compatibilidade cross-platform em mudancas de UI
10. **Priorizar** acessibilidade e seguranca em todas as implementacoes

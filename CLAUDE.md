# React Native + Expo Best Practices

You are an expert in React Native, Expo, and scalable mobile application development. You write maintainable, performant, and accessible code following Expo, React Native, and TypeScript best practices.

---

## TypeScript Best Practices

* Enable **`strict: true`** in `tsconfig.json`
* Prefer type inference when the type is obvious
* Avoid the `any` type; use `unknown` if you must widen
* Use discriminated unions for complex “either/or” props
* Mark optional props with `?` and define sane defaults via parameters

---

## Expo & Tooling Best Practices

* Use the **Managed Expo Workflow** for OTA updates and built-in APIs
* Co-locate configuration in **`app.json`/`app.config.ts`** (splash, icons, assets)
* Integrate **ESLint** (`@typescript-eslint`) + **Prettier** + **expo-yarn-workspaces**
* Keep **`babel.config.js`** minimal—only necessary transforms/plugins
* Leverage **Expo Dev Client** for testing custom native modules

---

## Project Structure

```
/src
  /components      — reusable UI pieces
  /screens         — route-level views
  /hooks           — custom hooks & logic
  /navigation      — React Navigation stacks & types
  /stores          — Zustand/Redux/MobX definitions
  /services        — API clients, analytics, auth
  /theme           — design tokens & styled-components
  /assets          — images, fonts, svgs
  App.tsx
```

* Flat, predictable layout; co-locate `Component.test.tsx` beside implementation

---

## Components

* **Function components only** (hooks everywhere; no classes)
* **Single responsibility**; \~100–200 LOC max
* Fully typed `Props` interface; prefer default parameters over `defaultProps`
* Memoize with `React.memo`, `useCallback`, `useMemo`
* Define static styles with `StyleSheet.create({})`; avoid inline object literals

---

## State Management

* **Local**: `useState` / `useReducer` for UI/form state
* **Global** (pick one):

    * **Zustand** for minimal API
    * **Redux Toolkit** for structured domains
    * **Context + `useContextSelector`** for theming or locale
* Encapsulate side-effects in custom hooks (`useFetch`, `useAuth`)

---

## Navigation

* **React Navigation v6** with TypeScript
* Use **`createNativeStackNavigator`** for performance
* Centralize params in `RootStackParamList` and screen props
* Configure deep linking via Expo’s `Linking` module

---

## Performance

* Use **virtualized lists** only (`FlatList` / `SectionList`) with `getItemLayout`
* **Lazy-load** heavy screens/components via `React.lazy` + `Suspense`
* Avoid unnecessary renders: `useCallback` / `useMemo` / `React.memo`
* Profile with **Flipper** and **React DevTools**

---

## Styling & Theming

* Use **`styled-components/native`** or **`@shopify/restyle`**
* Centralize colors, spacing, typography in `/theme/`
* Support dynamic font sizes (`allowFontScaling`) and dark mode
* For responsive sizes, use `Dimensions`, `%`, or libs like `react-native-size-matters`

---

## Assets & Images

* Store in `/assets` and run `expo-optimize` before release
* Use `<Image source={require(...)} />` or `uri` with `resizeMode`
* Inline SVGs via `react-native-svg-transformer`
* Pre-load critical assets with `Asset.loadAsync`

---

## Testing

* **Unit**: Jest + `@testing-library/react-native`
* **Mocks**: navigation, fetch/axios, native modules
* **E2E**: Detox or Cypress against Expo Go/Dev Client

---

## CI / CD

* **GitHub Actions**:

    * Lint & type-check on PR
    * Run Jest tests
    * `expo prebuild && expo run:android/ios`
* **EAS Build** + **EAS Submit** for automated channels

---

## Accessibility

* Add `accessible`, `accessibilityLabel`, `accessibilityRole` on all touchables
* Respect focus order with `AccessibilityInfo`
* Ensure color contrast & support font scaling

---

# CheckMate Theme System Rules

## Theming Guidelines

### 1. Always Use Theme Variables

* **NEVER** use hardcoded colors, spacing, or typography values in components
* **ALWAYS** use values from the centralized theme system located in `/theme/`
* Use `useTheme()` hook to access theme values in components

### 2. Theme Structure

```typescript
// Correct way to access theme values
const { theme } = useTheme();

// Use theme colors
backgroundColor: theme.colors.surface
color: theme.colors.text
borderColor: theme.colors.border

// Use theme spacing
padding: theme.spacing.md
margin: theme.spacing.lg

// Use theme typography
fontFamily: theme.typography.fontFamily.bold
fontSize: theme.typography.fontSize.md
letterSpacing: theme.typography.letterSpacing

// Use theme border radius
borderRadius: theme.borderRadius.md
```

### 3. Styling Pattern

```typescript
// Use the useThemedStyles hook for component styles
const styles = useThemedStyles((theme) => StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    text: {
        color: theme.colors.text,
        fontFamily: theme.typography.fontFamily.regular,
        fontSize: theme.typography.fontSize.md,
    },
}));
```

### 4. Card Colors for Task Items

```typescript
// Use the utility function for consistent card colors
import { getTaskCardColor } from '../theme';

const cardColor = getTaskCardColor(task.id, theme, task.isCompleted);
```

### 5. Theme Support Requirements

* **EVERY** component must support both light and dark themes
* **EVERY** component must support high contrast mode
* **ALL** colors must come from `theme.colors`
* **ALL** spacing must come from `theme.spacing`
* **ALL** typography must come from `theme.typography`

### 6. Forbidden Practices

❌ **NEVER** use hardcoded hex colors: `#ffffff`, `#000000`
❌ **NEVER** use hardcoded spacing: `margin: 16`, `padding: 24`
❌ **NEVER** use hardcoded font sizes: `fontSize: 14`
❌ **NEVER** create inline styles with hardcoded values
❌ **NEVER** use platform-specific color values without theme support

### 7. Best Practices

✅ **ALWAYS** use theme variables for all styling
✅ **ALWAYS** test components in both light and dark themes
✅ **ALWAYS** test with high contrast mode enabled
✅ **ALWAYS** use the `useThemedStyles` hook for component styles
✅ **ALWAYS** respect the reducedMotion setting from theme

### 8. Theme File Organization

```
/theme/
├── index.ts           # Main exports
├── types.ts           # TypeScript interfaces
├── base.ts            # Shared values (spacing, typography, etc.)
├── lightTheme.ts      # Light theme definition
├── darkTheme.ts       # Dark theme definition
└── highContrastThemes.ts # High contrast variants
```

### 9. Color Semantic Naming

* `background` - Main app background
* `surface` - Card/component backgrounds
* `surfaceVariant` - Secondary component backgrounds
* `border` - Border colors
* `text` - Primary text color
* `textSecondary` - Secondary text color
* `textMuted` - Muted/disabled text color
* `accent` - Primary accent/brand color
* `danger` - Error/destructive actions
* `success` - Success states
* `warning` - Warning states

### 10. Component Updates When Adding Theme Support

1. Replace all hardcoded values with theme variables
2. Update `StyleSheet.create` to use `useThemedStyles`
3. Test in both light and dark modes
4. Test with high contrast enabled
5. Ensure animations respect reducedMotion setting

---

*Continue workflow rules, development, database, and accessibility sections as needed...*

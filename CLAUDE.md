# CheckMate Theme System Rules

## Theming Guidelines

### 1. Always Use Theme Variables
- **NEVER** use hardcoded colors, spacing, or typography values in components
- **ALWAYS** use values from the centralized theme system located in `/theme/`
- Use `useTheme()` hook to access theme values in components

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
- **EVERY** component must support both light and dark themes
- **EVERY** component must support high contrast mode
- **ALL** colors must come from theme.colors
- **ALL** spacing must come from theme.spacing
- **ALL** typography must come from theme.typography

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
✅ **ALWAYS** use the useThemedStyles hook for component styles
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
- `background` - Main app background
- `surface` - Card/component backgrounds
- `surfaceVariant` - Secondary component backgrounds
- `border` - Border colors
- `text` - Primary text color
- `textSecondary` - Secondary text color
- `textMuted` - Muted/disabled text color
- `accent` - Primary accent/brand color
- `danger` - Error/destructive actions
- `success` - Success states
- `warning` - Warning states

### 10. Component Updates When Adding Theme Support
When updating an existing component:
1. Replace all hardcoded values with theme variables
2. Update StyleSheet.create to use useThemedStyles
3. Test in both light and dark modes
4. Test with high contrast enabled
5. Ensure animations respect reducedMotion setting

### Example Component Migration
```typescript
// ❌ Before - hardcoded values
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  text: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'JetBrainsMono_400Regular',
  },
});

// ✅ After - theme-based
const styles = useThemedStyles((theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily.regular,
  },
}));
```

## Development Workflow Rules

### 11. Code Review and Validation
- **ALWAYS** check existing theme structure before suggesting any styling
- **ALWAYS** show both "before" and "after" code with clear migration path
- **ALWAYS** prioritize fixing theme violations over adding new features
- **ALWAYS** verify TypeScript interfaces match the theme structure
- **ALWAYS** flag any hardcoded values immediately (colors, spacing, fonts)
- **ALWAYS** ensure every component uses `useThemedStyles` hook
- **ALWAYS** verify all new components support light/dark/high-contrast modes
- **ALWAYS** check that semantic color names are used correctly

### 12. File Structure and Organization
- **ALWAYS** keep theme files organized as specified in documentation
- **NEVER** modify theme base values without explicit discussion
- **ALWAYS** update TypeScript types when adding new theme properties
- **ALWAYS** maintain consistent export patterns from theme files

### 13. Testing Requirements for Theme Changes
Before considering any component complete, test:
1. Component in light mode
2. Component in dark mode
3. Component in high contrast mode
4. Verify `reducedMotion` is respected for animations
5. Test on both iOS and Android if possible

## React Native Expo Specific Rules

### 14. Platform Compatibility
- **ALWAYS** consider both iOS and Android platform differences
- **ONLY** use `Platform.OS` checks when absolutely necessary for theme-related code
- **ALWAYS** ensure theme values work across different screen densities
- **ALWAYS** test theme changes on both platforms when possible
- **NEVER** use platform-specific APIs without checking Expo compatibility

### 15. Expo SDK and Dependencies
- **ALWAYS** use Expo-compatible packages when available
- **ALWAYS** check Expo SDK version compatibility before suggesting packages
- **ALWAYS** prefer `expo install` over `npm install` for Expo-managed packages
- **NEVER** suggest packages that require ejecting from Expo managed workflow
- **ALWAYS** check if suggested packages work with EAS Build

### 16. Performance and Bundle Size
- **ALWAYS** consider bundle size impact when adding new dependencies
- **ALWAYS** use dynamic imports for large libraries when possible
- **ALWAYS** prefer lightweight alternatives when functionality is similar
- **NEVER** import entire libraries when only specific functions are needed
- **ALWAYS** use `react-native-reanimated` for complex animations over Animated API

### 17. Expo Router and Navigation
- **ALWAYS** use Expo Router file-based routing conventions
- **ALWAYS** follow the `/app/` directory structure
- **NEVER** mix React Navigation with Expo Router unless absolutely necessary
- **ALWAYS** use proper TypeScript types for route parameters
- **ALWAYS** handle deep linking considerations in route planning

### 18. Asset Management
- **ALWAYS** optimize images before including in the app
- **ALWAYS** use appropriate image formats (WebP when supported)
- **ALWAYS** provide multiple densities for images (@2x, @3x)
- **ALWAYS** use Expo's asset system for proper bundling
- **NEVER** reference assets with hardcoded paths

### 19. Environment and Configuration
- **ALWAYS** use Expo environment variables (.env) for configuration
- **ALWAYS** validate environment variables at app startup
- **NEVER** commit sensitive keys or tokens to version control
- **ALWAYS** use EAS Secrets for production environment variables
- **ALWAYS** configure app.json/app.config.js properly for builds

### 20. Development and Debugging
- **ALWAYS** use Expo dev tools and Flipper for debugging
- **ALWAYS** test with Expo Go app during development
- **ALWAYS** test with development builds for production features
- **NEVER** rely solely on Expo Go for testing native functionality
- **ALWAYS** use TypeScript strict mode
- **ALWAYS** configure ESLint and Prettier for code consistency

### 21. Build and Deployment
- **ALWAYS** use EAS Build for production builds
- **ALWAYS** configure proper build profiles (development, preview, production)
- **ALWAYS** test internal distribution builds before store submission
- **NEVER** include development dependencies in production builds
- **ALWAYS** configure proper app signing and provisioning

### 22. State Management and Data
- **ALWAYS** consider offline-first approach for data management
- **ALWAYS** use proper loading and error states
- **ALWAYS** implement proper data persistence strategies
- **NEVER** store sensitive data in AsyncStorage without encryption
- **ALWAYS** handle network connectivity changes gracefully

### 25. Expo SQLite Database Rules
- **ALWAYS** use `expo-sqlite` for local data persistence and store management
- **ALWAYS** implement proper database initialization and migration strategies
- **ALWAYS** use transactions for multiple related database operations
- **ALWAYS** handle database errors gracefully with proper error boundaries
- **NEVER** perform database operations on the main thread for large datasets

#### Database Structure and Schema
```typescript
// ✅ Proper database initialization
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('checkmate.db');

// Always use versioned schema management
const initializeDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  });
};
```

#### SQLite Best Practices
- **ALWAYS** use parameterized queries to prevent SQL injection
- **ALWAYS** handle database initialization before first use
- **ALWAYS** implement proper database migration versioning
- **NEVER** construct SQL queries with string concatenation
- **ALWAYS** use transactions for batch operations
- **ALWAYS** implement proper database connection management

#### Database Operations Patterns
```typescript
// ✅ Correct parameterized query pattern
const insertTask = (title: string, description: string) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'INSERT INTO tasks (title, description) VALUES (?, ?)',
          [title, description],
          (_, result) => resolve(result),
          (_, error) => reject(error)
        );
      },
      reject,
      resolve
    );
  });
};

// ❌ Never do this - SQL injection risk
const badInsert = (title: string) => {
  tx.executeSql(`INSERT INTO tasks (title) VALUES ('${title}')`);
};
```

#### Database Error Handling
- **ALWAYS** wrap database operations in try-catch blocks
- **ALWAYS** provide fallback strategies for database failures
- **ALWAYS** log database errors for debugging
- **ALWAYS** implement retry mechanisms for transient failures
- **NEVER** crash the app due to database errors

#### Database Performance Rules
- **ALWAYS** create indexes for frequently queried columns
- **ALWAYS** use LIMIT clauses for large result sets
- **ALWAYS** implement pagination for large datasets
- **NEVER** load entire tables into memory at once
- **ALWAYS** optimize queries with EXPLAIN QUERY PLAN when needed

```typescript
// ✅ Proper indexed table creation
tx.executeSql(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
  CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
`);
```

#### Database Migration Management
- **ALWAYS** implement version-based database migrations
- **ALWAYS** test migrations on sample data before production
- **ALWAYS** provide rollback strategies for failed migrations
- **NEVER** modify existing migration scripts
- **ALWAYS** backup data before major schema changes

```typescript
// ✅ Database versioning pattern
const DATABASE_VERSION = 2;

const migrateDatabase = (currentVersion: number) => {
  db.transaction(tx => {
    if (currentVersion < 2) {
      tx.executeSql('ALTER TABLE tasks ADD COLUMN priority INTEGER DEFAULT 0');
    }
    // Update version
    tx.executeSql('PRAGMA user_version = ?', [DATABASE_VERSION]);
  });
};
```

#### Store Integration Rules
- **ALWAYS** create database service layer separate from UI components
- **ALWAYS** use React hooks for database state management
- **ALWAYS** implement optimistic updates where appropriate
- **ALWAYS** synchronize database changes with component state
- **NEVER** directly call database operations from components

```typescript
// ✅ Database service pattern
export const TaskService = {
  async getTasks(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM tasks ORDER BY created_at DESC',
          [],
          (_, result) => resolve(result.rows._array),
          (_, error) => reject(error)
        );
      });
    });
  },
  
  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    // Implementation with proper error handling
  }
};

// ✅ React hook integration
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await TaskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { tasks, loading, loadTasks };
};
```

#### Database Testing Rules
- **ALWAYS** test database operations with sample data
- **ALWAYS** test database migrations with realistic datasets
- **ALWAYS** test database performance with larger datasets
- **ALWAYS** test database operations in both development and production builds
- **NEVER** assume database operations will always succeed

### 23. Accessibility and UX
- **ALWAYS** implement proper accessibility labels and hints
- **ALWAYS** test with VoiceOver (iOS) and TalkBack (Android)
- **ALWAYS** ensure proper color contrast ratios
- **ALWAYS** implement proper focus management
- **ALWAYS** consider reduced motion preferences
- **ALWAYS** provide haptic feedback where appropriate

### 24. Code Organization Best Practices
- **ALWAYS** use absolute imports with path mapping
- **ALWAYS** separate business logic from UI components
- **ALWAYS** create reusable hook abstractions for common functionality
- **ALWAYS** use proper TypeScript interfaces and types
- **NEVER** create overly large components (split into smaller ones)
- **ALWAYS** follow React Native performance best practices

## Implementation Priority
1. **High Priority**: Core components (layouts, cards, buttons, text)
2. **Medium Priority**: Feature components (forms, lists, modals)
3. **Low Priority**: Utility components (spacers, dividers)

## Development Focus Rules for ADHD
- **ALWAYS** break large tasks into smaller, numbered steps
- **ALWAYS** complete theme migration before adding new features
- **ALWAYS** ask for confirmation before expanding scope
- **ALWAYS** provide clear next steps at the end of each response
- **NEVER** suggest additional features unless explicitly requested
- **ALWAYS** stay within current task scope unless asked to expand
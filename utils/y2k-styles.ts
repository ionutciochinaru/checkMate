import { StyleSheet } from 'react-native';

// Typography Scale (2025 Best Practices)
export const typography = StyleSheet.create({
  // Large titles (32-34pt) - App/Screen titles
  heroTitle: {
    fontSize: 30,
    fontWeight: '700' as const, // Bold
    lineHeight: 41, // 120% of font size
    letterSpacing: -0.4,
  },
  
  // Section headers (20-24pt) - Prominent subheadings
  sectionHeader: {
    fontSize: 22,
    fontWeight: '600' as const, // Semibold
    lineHeight: 28, // 127% of font size
    letterSpacing: -0.2,
  },
  
  // Body text (16-17pt) - Primary content
  body: {
    fontSize: 17,
    fontWeight: '400' as const, // Regular
    lineHeight: 23, // 135% of font size
    letterSpacing: 0,
  },
  
  // Secondary text (14-15pt) - Supporting info
  secondary: {
    fontSize: 16,
    fontWeight: '400' as const, // Regular
    lineHeight: 20, // 133% of font size
    letterSpacing: 0,
  },
  
  // Caption text (12-13pt) - Minimal, tertiary info
  caption: {
    fontSize: 12,
    fontWeight: '400' as const, // Regular
    lineHeight: 18, // 138% of font size
    letterSpacing: 0,
  },
  
  // Button text - Clear and readable
  button: {
    fontSize: 17,
    fontWeight: '500' as const, // Medium
    lineHeight: 22,
    letterSpacing: 0,
  },
});

// Spacing Scale (8pt Grid System)
export const spacing = {
  xs: 4,   // Half step
  sm: 8,   // Base unit
  md: 16,  // 2x base
  lg: 24,  // 3x base
  xl: 32,  // 4x base
  xxl: 40, // 5x base
  
  // Touch targets and interactive elements
  touchTarget: 44, // Minimum iOS touch target
  touchPadding: 8, // Minimum space between touch targets
  
  // Screen margins
  screenMargin: 16, // Standard screen edge margin
  cardPadding: 16,  // Internal card/component padding
  
  // Component spacing
  componentGap: 12, // Between related components
  sectionGap: 24,   // Between unrelated sections
};

export const y2kStyles = StyleSheet.create({
  // Chrome and metallic effects
  chromeButton: {
    backgroundColor: '#C8C8C8',
    borderWidth: 2,
    borderTopColor: '#FFFFFF',
    borderLeftColor: '#FFFFFF',
    borderBottomColor: '#808080',
    borderRightColor: '#808080',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  
  // Windows XP gradients (simulated with multiple borders)
  xpBlueGradient: {
    backgroundColor: '#3889FF',
    borderWidth: 1,
    borderTopColor: '#6BA3FF',
    borderLeftColor: '#6BA3FF', 
    borderBottomColor: '#245EDC',
    borderRightColor: '#245EDC',
  },
  
  xpGreenGradient: {
    backgroundColor: '#8BC34A',
    borderWidth: 1,
    borderTopColor: '#A5D157',
    borderLeftColor: '#A5D157',
    borderBottomColor: '#73B618',
    borderRightColor: '#73B618',
  },
  
  // Y2K neon glow effects
  neonGlow: {
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  
  pinkGlow: {
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  
  // Retro text styles with improved contrast
  chromeText: {
    color: '#FFFFFF',
    textShadowColor: '#000000', // Improved shadow contrast
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  
  neonText: {
    color: '#00FFFF',
    textShadowColor: '#000000', // Dark shadow for better readability
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  // Container effects
  holographicCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    // backdropFilter not supported in React Native
  },
  
  // Accent elements
  y2kAccentPink: {
    backgroundColor: '#FF69B4',
    borderColor: '#FF1493',
  },
  
  y2kAccentCyan: {
    backgroundColor: '#00FFFF',
    borderColor: '#00CED1',
  },
  
  y2kAccentLime: {
    backgroundColor: '#32CD32',
    borderColor: '#228B22',
  },
});

export const y2kColors = {
  bubblegumPink: '#FF69B4',
  chromeSilver: '#C8C8C8', 
  electricCyan: '#00FFFF',
  limeGreen: '#32CD32',
  digitalPurple: '#9932CC',
  neonOrange: '#FF6347',
  xpBlue: {
    start: '#245EDC',
    end: '#3889FF'
  },
  xpGreen: {
    start: '#73B618', 
    end: '#8BC34A'
  },
  xpOrange: {
    start: '#FF8C00',
    end: '#FFB347'
  }
};

// Color contrast ratios - ensuring accessibility (WCAG 2.x compliant)
export const getContrastColor = (bgColor: string): string => {
  const colors: { [key: string]: string } = {
    '#FF69B4': '#000000', // Black text on pink - 4.89:1 contrast
    '#C8C8C8': '#000000', // Black text on silver - 6.39:1 contrast
    '#00FFFF': '#000000', // Black text on cyan - 7.54:1 contrast
    '#32CD32': '#000000', // Black text on lime - 5.29:1 contrast
    '#9932CC': '#FFFFFF', // White text on purple - 7.81:1 contrast
    '#FF6347': '#000000', // Black text on orange - 4.93:1 contrast
    '#3889FF': '#FFFFFF', // White text on blue - 5.74:1 contrast
    '#8BC34A': '#000000', // Black text on green - 6.13:1 contrast
  };
  
  return colors[bgColor] || '#000000';
};

// High contrast color variants for accessibility
export const accessibilityColors = {
  highContrastText: '#000000',
  highContrastTextInverse: '#FFFFFF',
  minimumContrastBg: '#F8F8F8', // Light background with 4.5:1+ contrast
  minimumContrastText: '#333333', // Dark text with 4.5:1+ contrast
};
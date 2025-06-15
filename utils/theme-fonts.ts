import { Platform } from 'react-native';

type ThemeStyle = 'terminal' | 'y2k' | 'material';

interface FontFamily {
  regular: string;
  medium: string;
  bold: string;
}

export const getThemeFonts = (themeStyle: ThemeStyle): FontFamily => {
  switch (themeStyle) {
    case 'material':
      // Material Design uses system fonts for better readability
      return {
        regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
        medium: Platform.OS === 'ios' ? 'System' : 'Roboto_medium', 
        bold: Platform.OS === 'ios' ? 'System' : 'Roboto_bold',
      };
    case 'y2k':
    case 'terminal':
    default:
      // Terminal and Y2K themes use monospace fonts
      return {
        regular: 'JetBrainsMono_400Regular',
        medium: 'JetBrainsMono_500Medium',
        bold: 'JetBrainsMono_700Bold',
      };
  }
};

export const getThemeTextStyles = (themeStyle: ThemeStyle) => {
  const fonts = getThemeFonts(themeStyle);
  
  switch (themeStyle) {
    case 'material':
      // Material Design typography with appropriate letter spacing
      return {
        heroTitle: {
          fontFamily: fonts.bold,
          letterSpacing: -0.25,
        },
        sectionHeader: {
          fontFamily: fonts.bold,
          letterSpacing: 0.15,
        },
        body: {
          fontFamily: fonts.regular,
          letterSpacing: 0.5,
        },
        button: {
          fontFamily: fonts.medium,
          letterSpacing: 1.25,
        },
        caption: {
          fontFamily: fonts.regular,
          letterSpacing: 0.4,
        },
      };
    case 'y2k':
      // Y2K retro style with wider letter spacing
      return {
        heroTitle: {
          fontFamily: fonts.bold,
          letterSpacing: 2.0,
        },
        sectionHeader: {
          fontFamily: fonts.bold,
          letterSpacing: 1.5,
        },
        body: {
          fontFamily: fonts.regular,
          letterSpacing: 1.0,
        },
        button: {
          fontFamily: fonts.bold,
          letterSpacing: 2.0,
        },
        caption: {
          fontFamily: fonts.regular,
          letterSpacing: 0.8,
        },
      };
    case 'terminal':
    default:
      // Terminal style with monospace and tight spacing
      return {
        heroTitle: {
          fontFamily: fonts.bold,
          letterSpacing: 1.2,
        },
        sectionHeader: {
          fontFamily: fonts.bold,
          letterSpacing: 1.0,
        },
        body: {
          fontFamily: fonts.regular,
          letterSpacing: 0.5,
        },
        button: {
          fontFamily: fonts.bold,
          letterSpacing: 1.0,
        },
        caption: {
          fontFamily: fonts.regular,
          letterSpacing: 0.5,
        },
      };
  }
};

export const getThemeBorderRadius = (themeStyle: ThemeStyle): number => {
  switch (themeStyle) {
    case 'material':
      return 12; // Material Design 3 uses rounded corners
    case 'y2k':
      return 4; // Y2K has subtle rounding
    case 'terminal':
    default:
      return 0; // Terminal is completely square
  }
};

export const getThemeElevation = (themeStyle: ThemeStyle, level: 'low' | 'medium' | 'high' = 'medium') => {
  const elevations = {
    material: {
      low: { elevation: 1, shadowOpacity: 0.1, shadowRadius: 2 },
      medium: { elevation: 3, shadowOpacity: 0.15, shadowRadius: 4 },
      high: { elevation: 6, shadowOpacity: 0.2, shadowRadius: 8 },
    },
    y2k: {
      low: { elevation: 2, shadowOpacity: 0.3, shadowRadius: 2 },
      medium: { elevation: 4, shadowOpacity: 0.4, shadowRadius: 4 },
      high: { elevation: 8, shadowOpacity: 0.5, shadowRadius: 8 },
    },
    terminal: {
      low: { elevation: 0, shadowOpacity: 0, shadowRadius: 0 },
      medium: { elevation: 0, shadowOpacity: 0, shadowRadius: 0 },
      high: { elevation: 0, shadowOpacity: 0, shadowRadius: 0 },
    },
  };

  return elevations[themeStyle][level];
};
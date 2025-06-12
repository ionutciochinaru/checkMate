import { StyleSheet } from 'react-native';

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
  
  // Retro text styles
  chromeText: {
    color: '#FFFFFF',
    textShadowColor: '#808080',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  neonText: {
    color: '#00FFFF',
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
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

// Color contrast ratios - ensuring accessibility
export const getContrastColor = (bgColor: string): string => {
  const colors: { [key: string]: string } = {
    '#FF69B4': '#000000', // Black text on pink
    '#C8C8C8': '#000000', // Black text on silver
    '#00FFFF': '#000000', // Black text on cyan
    '#32CD32': '#000000', // Black text on lime
    '#9932CC': '#FFFFFF', // White text on purple
    '#FF6347': '#000000', // Black text on orange
    '#3889FF': '#FFFFFF', // White text on blue
    '#8BC34A': '#000000', // Black text on green
  };
  
  return colors[bgColor] || '#000000';
};
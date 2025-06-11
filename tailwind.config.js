module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // E-ink inspired palette
        'eink': {
          'paper': '#f5f5f0',      // Warm off-white like e-paper
          'text': '#1a1a1a',       // Deep black for text
          'gray': '#4a4a4a',       // Mid-tone gray
          'light': '#e8e8e0',      // Light gray background
          'border': '#d0d0c8',     // Subtle borders
          'accent': '#2a2a2a',     // Dark accent
          'muted': '#8a8a8a',      // Muted text
        },
        // Retro-modern accents
        'nothing': {
          'red': '#ff3b30',        // Nothing red
          'green': '#34c759',      // Success green
          'blue': '#007aff',       // System blue
        }
      },
      fontFamily: {
        'mono': ['JetBrainsMono_400Regular', 'monospace'],
        'mono-medium': ['JetBrainsMono_500Medium', 'monospace'],
        'mono-bold': ['JetBrainsMono_700Bold', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    }
  },
  plugins: []
};
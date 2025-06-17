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
        },
        // Y2K Design Elements
        'y2k': {
          'pink': '#FF69B4',       // Bubblegum Pink
          'chrome': '#C8C8C8',     // Chrome Silver
          'electric': '#00FFFF',   // Electric Cyan
          'lime': '#ffaa44',       // Orange (red-shift compatible)
          'purple': '#9932CC',     // Digital Purple
          'orange': '#FF6347',     // Neon Orange
        },
        // Windows XP Gradients
        'xp': {
          'blue-start': '#245EDC', // XP Blue Start
          'blue-end': '#3889FF',   // XP Blue End
          'green-start': '#73B618', // XP Green Start
          'green-end': '#8BC34A',   // XP Green End
          'orange-start': '#FF8C00', // XP Orange Start
          'orange-end': '#FFB347',   // XP Orange End
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
        // 8pt Grid System (converted to rem)
        '1': '0.25rem',  // 4px
        '2': '0.5rem',   // 8px
        '3': '0.75rem',  // 12px
        '4': '1rem',     // 16px
        '6': '1.5rem',   // 24px
        '8': '2rem',     // 32px
        '10': '2.5rem',  // 40px
        '11': '2.75rem', // 44px - Touch target size
      },
      fontSize: {
        // Typography Scale (2025 Best Practices)
        'hero': ['2.125rem', { lineHeight: '2.5625rem', letterSpacing: '-0.025rem' }], // 34px
        'section': ['1.375rem', { lineHeight: '1.75rem', letterSpacing: '-0.0125rem' }], // 22px
        'body': ['1.0625rem', { lineHeight: '1.4375rem' }], // 17px
        'secondary': ['0.9375rem', { lineHeight: '1.25rem' }], // 15px
        'caption': ['0.8125rem', { lineHeight: '1.125rem' }], // 13px
        'button': ['1.0625rem', { lineHeight: '1.375rem' }], // 17px
      }
    }
  },
  plugins: []
};
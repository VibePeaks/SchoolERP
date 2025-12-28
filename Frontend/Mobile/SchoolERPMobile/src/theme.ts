// Theme configuration matching the web app's design system
export const theme = {
  colors: {
    // Background colors
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(222.2, 84%, 4.9%)',

    // Card colors
    card: 'hsl(0, 0%, 100%)',
    'card-foreground': 'hsl(222.2, 84%, 4.9%)',

    // Popover colors
    popover: 'hsl(0, 0%, 100%)',
    'popover-foreground': 'hsl(222.2, 84%, 4.9%)',

    // Primary colors (dark navy)
    primary: 'hsl(222.2, 47.4%, 11.2%)',
    'primary-foreground': 'hsl(210, 40%, 98%)',

    // Secondary colors
    secondary: 'hsl(210, 40%, 96.1%)',
    'secondary-foreground': 'hsl(222.2, 47.4%, 11.2%)',

    // Muted colors
    muted: 'hsl(210, 40%, 96.1%)',
    mutedForeground: 'hsl(215.4, 16.3%, 46.9%)',

    // Accent colors
    accent: 'hsl(210, 40%, 96.1%)',
    accentForeground: 'hsl(222.2, 47.4%, 11.2%)',

    // Destructive colors (red)
    destructive: 'hsl(0, 84.2%, 60.2%)',
    'destructive-foreground': 'hsl(210, 40%, 98%)',

    // Border and input colors
    border: 'hsl(214.3, 31.8%, 91.4%)',
    input: 'hsl(214.3, 31.8%, 91.4%)',
    ring: 'hsl(222.2, 84%, 4.9%)',

    // Sidebar colors
    sidebar: {
      background: 'hsl(0, 0%, 98%)',
      foreground: 'hsl(240, 5.3%, 26.1%)',
      primary: 'hsl(240, 5.9%, 10%)',
      'primary-foreground': 'hsl(0, 0%, 98%)',
      accent: 'hsl(240, 4.8%, 95.9%)',
      'accent-foreground': 'hsl(240, 5.9%, 10%)',
      border: 'hsl(220, 13%, 91%)',
      ring: 'hsl(217.2, 91.2%, 59.8%)',
    },

    // Dark theme colors
    dark: {
      background: 'hsl(222.2, 84%, 4.9%)',
      foreground: 'hsl(210, 40%, 98%)',
      card: 'hsl(222.2, 84%, 4.9%)',
      'card-foreground': 'hsl(210, 40%, 98%)',
      popover: 'hsl(222.2, 84%, 4.9%)',
      'popover-foreground': 'hsl(210, 40%, 98%)',
      primary: 'hsl(210, 40%, 98%)',
      'primary-foreground': 'hsl(222.2, 47.4%, 11.2%)',
      secondary: 'hsl(217.2, 32.6%, 17.5%)',
      'secondary-foreground': 'hsl(210, 40%, 98%)',
      muted: 'hsl(217.2, 32.6%, 17.5%)',
      'muted-foreground': 'hsl(215, 20.2%, 65.1%)',
      accent: 'hsl(217.2, 32.6%, 17.5%)',
      'accent-foreground': 'hsl(210, 40%, 98%)',
      destructive: 'hsl(0, 62.8%, 30.6%)',
      'destructive-foreground': 'hsl(210, 40%, 98%)',
      border: 'hsl(217.2, 32.6%, 17.5%)',
      input: 'hsl(217.2, 32.6%, 17.5%)',
      ring: 'hsl(212.7, 26.8%, 83.9%)',
      sidebar: {
        background: 'hsl(240, 5.9%, 10%)',
        foreground: 'hsl(240, 4.8%, 95.9%)',
        primary: 'hsl(224.3, 76.3%, 48%)',
        'primary-foreground': 'hsl(0, 0%, 100%)',
        accent: 'hsl(240, 3.7%, 15.9%)',
        'accent-foreground': 'hsl(240, 4.8%, 95.9%)',
        border: 'hsl(240, 3.7%, 15.9%)',
        ring: 'hsl(217.2, 91.2%, 59.8%)',
      },
    },
  },

  borderRadius: {
    none: 0,
    sm: 2,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    full: 9999,
  },

  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    24: 96,
  },

  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
} as const;

export type Theme = typeof theme;

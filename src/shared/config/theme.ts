import { createTheme, rem, ScrollArea, type MantineColorsTuple } from '@mantine/core';

const sage: MantineColorsTuple = [
  '#F1EAE3',
  '#E8DDD4', 
  '#D9C9BA', 
  '#CBAE98', 
  '#C09A7E', 
  '#B5886A', 
  '#C8AC95', 
  '#AC7D63', 
  '#8B5E44', 
  '#6B4530', 
];

export const theme = createTheme({
  primaryColor: 'sage',
  defaultRadius: 'md',

  colors: {
    sage,
  },

  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',

  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    /** 1500px — граница «ноутбук / большой монитор» для сайдбара и хедера */
    xl: '93.75em',
  },

  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    sizes: {
      h1: { fontSize: rem(40), lineHeight: rem(48) },
      h2: { fontSize: rem(32), lineHeight: rem(40) },
      h3: { fontSize: rem(24), lineHeight: rem(32) },
      h4: { fontSize: rem(20), lineHeight: rem(24) },
      h5: { fontSize: rem(16), lineHeight: rem(20) },
      h6: { fontSize: rem(12), lineHeight: rem(16) },
    },
  },

  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    lg: rem(16),
    xl: rem(24),
  },

  radius: {
    xs: rem(4),
    sm: rem(6),
    md: rem(8),
    lg: rem(12),
    xl: rem(16),
  },

  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
  },

  components: {
    Button: {
      defaultProps: { radius: 'md' },
    },
    Card: {
      defaultProps: { radius: 'lg', shadow: 'xs', padding: 'xl' },
    },
    TextInput: {
      defaultProps: { radius: 'md' },
    },
    Select: {
      defaultProps: { radius: 'md' },
    },
    ActionIcon: {
      defaultProps: { radius: 'md' },
    },
    SegmentedControl: {
      defaultProps: {
        size: 'sm',
        radius: 'xs',
        color: 'sage.6',
        withItemsBorders: false,
      },
    },
    Badge: {
      defaultProps: { radius: 'sm' },
    },
    Paper: {
      defaultProps: { radius: 'lg', shadow: 'xs' },
    },
    ScrollArea: {
      defaultProps: {
        type: 'auto',
        scrollbarSize: 6,
      },
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
        padding: 'xl',
        scrollAreaComponent: ScrollArea.Autosize,
      },
    },
    Drawer: {
      defaultProps: {
        padding: 'xl',
        scrollAreaComponent: ScrollArea.Autosize,
      },
    },
    Notification: {
      defaultProps: { radius: 'md' },
    },
  },
});

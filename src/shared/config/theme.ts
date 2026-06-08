import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
  colors: {
    blue: [
      '#eff8ff',
      '#d1e9ff',
      '#b2ddff',
      '#84caff',
      '#53b1fd',
      '#2e90fa',
      '#1570ef',
      '#175cd3',
      '#1849a9',
      '#194185'
    ]
  },

  fontFamily: 'Inter, sans-serif',
  headings: {
    sizes: {
      h1: { fontSize: rem(40), lineHeight: rem(48) },
      h2: { fontSize: rem(32), lineHeight: rem(40) },
      h3: { fontSize: rem(24), lineHeight: rem(32) },
      h4: { fontSize: rem(20), lineHeight: rem(24) },
      h5: { fontSize: rem(16), lineHeight: rem(20) },
      h6: { fontSize: rem(12), lineHeight: rem(16) }
    }
  },

  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    lg: rem(16),
    xl: rem(24)
  },

  radius: {
    xl: rem(24)
  }
});

import { useMediaQuery } from '@mantine/hooks';

export const MOBILE_QUERY = '(max-width: 47.99em)';

export const useIsMobile = (): boolean =>
  Boolean(useMediaQuery(MOBILE_QUERY, false, { getInitialValueInEffect: false }));

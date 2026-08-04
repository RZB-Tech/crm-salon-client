import { AppRouter } from './router';
import { useLoading } from '@/shared/lib/contexts/LoadingContext';
import { BrandedLoader } from '@/shared/ui/BrandedLoader';

export const App = () => {
  const { isLoading, isExiting } = useLoading();

  return (
    <>
      <AppRouter />
      {isLoading && <BrandedLoader exiting={isExiting} />}
    </>
  );
};

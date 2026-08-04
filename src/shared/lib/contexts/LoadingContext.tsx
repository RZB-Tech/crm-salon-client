import React from 'react';

const MIN_LOADER_MS = 6000;
const EXIT_MS = 280;

interface LoadingContextValue {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  message: string;
  setMessage: (message: string) => void;
  isExiting: boolean;
}

const LoadingContext = React.createContext<LoadingContextValue | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoadingInternal] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);
  const [message, setMessage] = React.useState('Загрузка...');
  const startedAtRef = React.useRef<number | null>(null);
  const exitTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoadingRef = React.useRef(false);

  const clearTimers = React.useCallback(() => {
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    exitTimerRef.current = null;
    hideTimerRef.current = null;
  }, []);

  React.useEffect(() => () => clearTimers(), [clearTimers]);

  const setIsLoading = React.useCallback(
    (loading: boolean) => {
      if (loading) {
        clearTimers();
        startedAtRef.current = Date.now();
        isLoadingRef.current = true;
        setIsLoadingInternal(true);
        setIsExiting(false);
        return;
      }

      if (!isLoadingRef.current) return;

      const startedAt = startedAtRef.current ?? Date.now();
      const remaining = Math.max(0, MIN_LOADER_MS - (Date.now() - startedAt));

      clearTimers();
      exitTimerRef.current = setTimeout(() => {
        setIsExiting(true);
        hideTimerRef.current = setTimeout(() => {
          isLoadingRef.current = false;
          setIsLoadingInternal(false);
          setIsExiting(false);
          startedAtRef.current = null;
        }, EXIT_MS);
      }, remaining);
    },
    [clearTimers],
  );

  const value = React.useMemo(
    () => ({ isLoading, setIsLoading, message, setMessage, isExiting }),
    [isLoading, message, isExiting, setIsLoading],
  );

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => {
  const context = React.useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

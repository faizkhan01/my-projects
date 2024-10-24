import { useCallback, useEffect } from 'react';

export const useConfirmUnload = (condition: boolean) => {
  const handleUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (condition) {
        (e || window.event).returnValue = '';
      }
    },
    [condition],
  );

  useEffect(() => {
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [handleUnload]);
};

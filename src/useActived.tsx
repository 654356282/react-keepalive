import { useContext, useLayoutEffect, useState } from 'react';
import Context from './context';

export function useActived(cb: () => void) {
  const { activedKey, deferActivedKey } = useContext(Context) || {};
  const [rootKey] = useState(activedKey);

  useLayoutEffect(() => {
    if (activedKey === deferActivedKey && activedKey === rootKey) {
      cb();
    }
  }, [deferActivedKey]);
}

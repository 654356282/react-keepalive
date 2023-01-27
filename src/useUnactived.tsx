import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Context from './context';
import { safelyCallFn } from './utils';

export function useUnactived(cb: () => void) {
  const { activedKey, store } = useContext(Context) || {};
  const [rootKey] = useState(activedKey);
  const fnRef = useRef(cb);
  fnRef.current = cb;

  const fn = useCallback(() => {
    safelyCallFn(fnRef.current);
  }, []);

  useEffect(() => {
    if (store) {
      const componentInfo = store.get(rootKey!);
      if (componentInfo && componentInfo.isKeepAlive) {
        componentInfo.unAnctivedCallbacks.push(fn);
      }
    }
  }, [store]);

  // 组件销毁时清除相应的unActived，并执行回调
  useEffect(() => {
    return () => {
      const componentInfo = store?.get(rootKey!);
      if (componentInfo && componentInfo.isKeepAlive && componentInfo.actived) {
        fn();
        const cbs = componentInfo.unAnctivedCallbacks;
        const idx = cbs.findIndex((item) => item === fn);
        cbs.splice(idx, 1);
      }
    };
  }, []);
}

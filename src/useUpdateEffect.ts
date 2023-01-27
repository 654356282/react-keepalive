import { useEffect, useRef } from 'react';

export default function useUpdateEffect<T>(cb: (newDeps: T[], oldDeps: T[]) => void, deps: T[]) {
  const prevRef = useRef(deps);

  function isSame(a: any[], b: any[]) {
    if (a.length !== b.length) return false;
    return a.every((v, idx) => {
      return Object.is(v, b[idx]);
    });
  }

  useEffect(() => {
    if (!isSame(deps, prevRef.current)) {
      cb(deps, prevRef.current);
      prevRef.current = deps;
    }
  }, deps);
}

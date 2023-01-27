import { createContext } from 'react';
import type { KeepAliveComponentInfo, Key } from './types';

export interface KeepAliveContext {
  store: Map<Key, KeepAliveComponentInfo>;
  activedKey: null | Key;
  deferActivedKey: Key | null;
  controller: {
    drop: (key: Key) => void;
  };
}

const Context = createContext<KeepAliveContext | null>(null);

export default Context;

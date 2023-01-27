import type { ReactElement } from 'react';
import type { resolve, pending } from './utils';

export type Key = string | number;
export type KeepAliveComponentInfo = {
  component: ReactElement;
  key: Key;
  actived: boolean;
  resource: Resource;
  isKeepAlive: boolean;
  activedCallbacks: (() => void)[];
  unAnctivedCallbacks: (() => void)[];
};
export type Resource = typeof resolve | typeof pending;
export type KeepAliveProps = {
  children: ReactElement;
  excludes?: Key[] | RegExp | ((key: Key) => boolean);
  includes?: Key[] | RegExp | ((key: Key) => boolean);
};

export type KeepAliveRef = {
  controller: {
    drop: (name: Key) => void;
  } | null;
};

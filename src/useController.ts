import { useContext } from 'react';
import Context from './context';

export function useController() {
  const { controller } = useContext(Context) || {};
  return controller;
}

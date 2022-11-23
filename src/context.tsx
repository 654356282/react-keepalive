import { createContext, ReactElement } from "react";

export interface KeepAliveContext {
  names: any[];
  comps: ReactElement[];
  resources: Function[];
  activedName?: any;
  id?: string | null;
  excludes?: any[];
  toggles?: boolean[];
}

const Context = createContext<KeepAliveContext>({
  names: [],
  comps: [],
  resources: [],
  activedName: null,
  id: null,
  excludes: [],
  toggles: [],
});

export default Context;

import { createContext, ReactElement } from "react";

export interface KeepAliveContext {
  names: any[];
  comps: ReactElement[];
  resources: Function[];
  activedName?: any;
  id?: string | null;
  toggles?: boolean[];
  excludes?: any[] | RegExp;
  includes?: any[] | RegExp;
}

const Context = createContext<KeepAliveContext>({
  names: [],
  comps: [],
  resources: [],
  activedName: null,
  id: null,
  excludes: [],
  toggles: [],
  includes: [],
});

export default Context;

import React, {
  FC,
  Suspense,
  isValidElement,
  useState,
  ReactElement,
  useLayoutEffect,
  useEffect,
} from "react";
import Context from "./context";
import { deleteCurActiveName, setCurActiveName } from "./curActiveName";
import { createId } from "./id";

function wrapPromise(p: Promise<void>) {
  let status = "pending";
  const s = p.then(() => (status = "success"));

  return () => {
    switch (status) {
      case "pending":
        throw s;
      case "success":
        return null;
    }
  };
}

function resolve() {
  return () => {};
}

function pending() {
  return wrapPromise(new Promise(() => {}));
}

function getCompName(comp: ReactElement) {
  return comp.key || comp.type;
}

const Wrapper: FC<{
  resource?: Function;
  children: ReactElement;
  active: boolean;
}> = ({ resource, children }) => {
  try {
    resource?.();
  } catch (e) {
    if ((e as any)?.then) {
      throw e;
    }
  }

  return children;
};

export type KeepAliveProps = {
  children: ReactElement;
  excludes?: any[] | RegExp;
  includes?: any[] | RegExp;
};

const KeepAlive: FC<KeepAliveProps> = (props) => {
  if (!isValidElement(props.children)) {
    throw Error("Please use valid ReactElement!");
  }
  const [id] = useState(createId);
  const { children } = props;

  const [activedName, setActivedName] = useState<any | null>(null);
  const [names] = useState<any[]>([]);
  const [comps, setComps] = useState<ReactElement[]>([]);
  const [resources, setResource] = useState<Function[]>([]);
  const [toggles, setToggles] = useState<boolean[]>([]);

  useEffect(() => {
    return () => {
      deleteCurActiveName(id);
    };
  }, []);

  function isExclude(name: any) {
    if (!props.excludes) {
      return false;
    }
    if (props.excludes instanceof RegExp) {
      return props.excludes.test(name);
    }

    return props.excludes.includes(name);
  }
  function isInclude(name: any) {
    if (!props.includes) return true;

    if (props.includes instanceof RegExp) {
      return props.includes.test(name);
    }

    return props.includes.includes(name);
  }

  function needKeepAlive(name: any) {
    return !isExclude(name) && isInclude(name);
  }

  const name = getCompName(children);
  if (!needKeepAlive(name)) {
    setCurActiveName(id, null);
  } else {
    setCurActiveName(id, name);
  }

  useLayoutEffect(() => {
    if (activedName !== name) {
      setActivedName(() => name);

      const nameIdx = names.indexOf(name);
      let newComps = comps;
      if (nameIdx === -1) {
        newComps = comps.concat(children);
        names.push(name);
      }

      const newResources = new Array(newComps.length).fill(pending());
      const newToggles = new Array(newComps.length).fill(false);
      newToggles[nameIdx === -1 ? newComps.length - 1 : nameIdx] = true;
      newResources[nameIdx === -1 ? newComps.length - 1 : nameIdx] = resolve();
      setResource(newResources);
      setToggles(newToggles);
      setComps(newComps);
    }
  }, [activedName, name]);

  return (
    <Context.Provider
      value={{
        names,
        comps,
        resources,
        activedName,
        id,
        excludes: props.excludes,
        toggles,
        includes: props.includes,
      }}
    >
      {comps.map((comp, idx) => {
        const isActive = toggles[idx];
        const name = getCompName(comp);
        const isExcluded = isExclude(name);
        const isIncluded = isInclude(name);
        const isKeepAlive = !isExcluded && isIncluded;

        return !isKeepAlive ? (
          <div key={idx}>{isActive ? comp : null}</div>
        ) : (
          <Suspense fallback={null} key={idx}>
            <Wrapper resource={resources[idx]} active={isActive}>
              {comp}
            </Wrapper>
          </Suspense>
        );
      })}
    </Context.Provider>
  );
};

export default KeepAlive;

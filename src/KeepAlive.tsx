import React, {
  FC,
  Suspense,
  isValidElement,
  useState,
  ReactElement,
  useLayoutEffect,
} from "react";
import Context from "./context";
import { setCurActiveName } from "./curActiveName";
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

function createRenderPromise() {
  return () => {};
}

function createPendingPromise() {
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
  excludes?: any[];
};

const KeepALive: FC<KeepAliveProps> = (props) => {
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

  function isExclude(name: any) {
    if (!props.excludes) {
      return false;
    }
    return props.excludes.includes(name);
  }

  const name = getCompName(children);
  if (isExclude(name)) {
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

      const newResources = new Array(newComps.length).fill(
        createPendingPromise()
      );
      const newToggles = new Array(newComps.length).fill(false);
      newToggles[nameIdx === -1 ? newComps.length - 1 : nameIdx] = true;
      newResources[nameIdx === -1 ? newComps.length - 1 : nameIdx] =
        createRenderPromise();
      setResource(newResources);
      setToggles(newToggles);
      setComps(newComps);
    }
  });

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
      }}
    >
      {comps.map((comp, idx) => {
        const isActive = toggles[idx];
        const isExcluded =
          isActive && props.excludes?.includes(getCompName(comp));

        return isExcluded ? (
          isActive ? (
            comp
          ) : null
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

export default KeepALive;

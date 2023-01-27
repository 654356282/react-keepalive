import type { FC, ReactElement } from "react";
import { useMemo } from "react";
import {
  Suspense,
  isValidElement,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import Context from "./context";
import type {
  KeepAliveComponentInfo,
  KeepAliveProps,
  KeepAliveRef,
  Key,
  Resource,
} from "./types";
import useUpdateEffect from "./useUpdateEffect";
import {
  isNumber,
  isString,
  isArray,
  resolve,
  pending,
  safelyCallFn,
  isNil,
} from "./utils";

const Wrapper: FC<{
  resource?: Resource;
  children: ReactElement;
}> = ({ resource, children }) => {
  resource?.();

  return children;
};

const KeepAlive = forwardRef<KeepAliveRef, KeepAliveProps>((props, ref) => {
  if (!isValidElement(props.children)) {
    throw Error("Please use valid ReactElement!");
  }
  const childrenKey = isNil(props.children.key)
    ? props.children.type.toString()
    : props.children.key!;
  if (isArray(props.includes) && isArray(props.excludes)) {
    throw Error("excludes and includes can't exist at the same time");
  }

  const { children } = props;

  const store = useMemo(() => {
    return new Map<Key, KeepAliveComponentInfo>();
  }, []);
  const [componentKeys, setComponentKeys] = useState<Key[]>([]);
  const [deferActivedKey, setDeferActivedKey] = useState<Key | null>(null);
  const [activedKey, setActivedKey] = useState<Key | null>(null);

  useEffect(() => {
    setDeferActivedKey(childrenKey);
  }, [childrenKey]);

  useUpdateEffect(
    (_, [oldKey]) => {
      if (oldKey !== null) {
        const cbs = store.get(oldKey)!.unAnctivedCallbacks;
        cbs.forEach((cb) => safelyCallFn(cb));
      }
    },
    [childrenKey]
  );

  const controller = {
    /** 丢弃缓存 */
    drop(name: Key) {
      if (store.has(name)) {
        store.delete(name);
        setComponentKeys((keys) => {
          const index = keys.findIndex((item) => item === name);
          keys.splice(index, 1);
          return [...keys];
        });
      }
    },
  };

  useImperativeHandle(ref, () => {
    return {
      controller,
    };
  });

  function isExclude(key: Key) {
    if (!props.excludes) {
      return false;
    }
    if (typeof props.excludes === "function") {
      return props.excludes(key);
    }
    if (props.excludes instanceof RegExp) {
      return props.excludes.test(key.toString());
    }

    return props.excludes.includes(key);
  }
  function isInclude(key: Key) {
    if (!props.includes) return true;
    if (typeof props.includes === "function") {
      return props.includes(key);
    }
    if (props.includes instanceof RegExp) {
      return props.includes.test(key.toString());
    }

    return props.includes.includes(key);
  }

  function isKeepAlive(key: Key) {
    return !isExclude(key) && isInclude(key);
  }

  if (store.has(childrenKey)) {
    const componentInfo = store.get(childrenKey)!;
    componentInfo.component = children;
  } else {
    store.set(childrenKey, {
      component: children,
      actived: false,
      key: childrenKey,
      resource: resolve,
      isKeepAlive: true,
      activedCallbacks: [],
      unAnctivedCallbacks: [],
    });
    setComponentKeys(componentKeys.concat(childrenKey));
  }
  if (activedKey !== childrenKey) {
    setActivedKey(childrenKey);
  }

  return (
    <Context.Provider
      value={{
        store,
        activedKey: isKeepAlive(childrenKey) ? childrenKey : null,
        deferActivedKey,
        controller,
      }}
    >
      {componentKeys.map((key) => {
        const componentInfo = store.get(key)!;
        componentInfo.isKeepAlive = isKeepAlive(key);

        if (!componentInfo.isKeepAlive) {
          componentInfo.actived = false;
          const shouldRender = componentInfo.key === childrenKey;
          return shouldRender ? children : null;
        }

        if (childrenKey === componentInfo.key) {
          componentInfo.actived = true;
          componentInfo.resource = resolve;
        } else {
          componentInfo.actived = false;
          componentInfo.resource = pending;
        }

        return (
          <Suspense fallback={null} key={key}>
            <Wrapper resource={componentInfo.resource}>
              {componentInfo.component}
            </Wrapper>
          </Suspense>
        );
      })}
    </Context.Provider>
  );
});

export default KeepAlive;

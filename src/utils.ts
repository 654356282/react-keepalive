export function wrapPromise(p: Promise<void>) {
  let status = "pending";
  const s = p.then(() => (status = "success"));

  return () => {
    switch (status) {
      case "pending":
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw s;
      case "success":
        return null;
    }
  };
}

export const resolve = (function resolve() {
  return () => {};
})();

export const pending = (function pending() {
  return wrapPromise(new Promise(() => {}));
})();

export function isString(val: any) {
  return typeof val === "string";
}

export function isNumber(val: any) {
  return typeof val === "number";
}

export function isArray(val: any) {
  return Array.isArray(val);
}

export function isNil(val: any) {
  return val === undefined || val === null;
}

export function safelyCallFn(fn: () => void) {
  try {
    fn();
  } catch {
    //noop
  }
}

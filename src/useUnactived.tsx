import { useContext, useEffect, useMemo, useState } from "react";
import Context from "./context";
import { getCurActiveName } from "./curActiveName";

export function useUnactived(cb: () => void) {
  const { id, excludes, toggles, names, includes } = useContext(Context);
  const parentName = useMemo(
    () => getCurActiveName(id!),
    [excludes, id, includes]
  );
  const parentIdx = useMemo(() => names.indexOf(parentName), [parentName]);

  const isActive = !!toggles?.[parentIdx];

  const [active, setActive] = useState(false);
  if (isActive && parentName === getCurActiveName(id!)) {
    !active && setActive(true);
  } else {
    active && setActive(false);
  }
  useEffect(() => {
    if (parentName === null) return;
    if (active) {
      return cb;
    }
  }, [active]);
}

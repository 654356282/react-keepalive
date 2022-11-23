import { useContext, useEffect, useMemo, useState } from "react";
import Context from "./context";
import { getCurActiveName } from "./curActiveName";

export function useActived(cb: () => void) {
  const { id, excludes, toggles, names } = useContext(Context);
  const parentName = useMemo(() => getCurActiveName(id!), [excludes, id]);
  const parentIdx = useMemo(() => names.indexOf(parentName), [parentName]);
  const [active, setActive] = useState(false);

  const isActive = !!toggles?.[parentIdx];


  if (isActive && parentName === getCurActiveName(id!)) {
    !active && setActive(true);
  } else {
    active && setActive(false);
  }
  useEffect(() => {
    if (parentName === null) return;
    if (active) {
      cb();
    }
  }, [active]);
}

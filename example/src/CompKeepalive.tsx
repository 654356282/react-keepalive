import { KeepAlive, useActived, useUnactived } from "../../src";
import React, { useState } from "react";
import { useLayoutEffect } from "react";

const Comp1 = (props: { count: number }) => {
  const [count, setCount] = useState(0);

  useActived(() => {
    console.log("Comp1 is actived");
  });

  useUnactived(() => {
    console.log("Comp1 is unactived");
  });

  useLayoutEffect(() => {
    console.log("Comp1 layout", count);
  }, [props.count]);

  return (
    <div>
      Comp1--{count}---{props.count}
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
};

const Comp2 = (props: { count: number }) => {
  const [count, setCount] = useState(0);

  useActived(() => {
    console.log("Comp2 is actived");
  });

  useUnactived(() => {
    console.log("Comp2 is unactived");
  });

  useLayoutEffect(() => {
    console.log("Comp2 layout", count);
  }, [props.count]);

  return (
    <div>
      Comp2--{count}---{props.count}
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
};

export function App() {
  const [toggle, setToggle] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <div>
      <KeepAlive>
        {toggle ? <Comp1 count={count} /> : <Comp2 count={count} />}
      </KeepAlive>
      <button onClick={() => setToggle(!toggle)}>change</button>
      <button onClick={() => setCount(count + 1)}>+1---{count}</button>
    </div>
  );
}

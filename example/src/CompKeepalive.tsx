import { KeepAlive, useActived, useUnactived } from "../../src";
import React, { useState } from "react";

const Comp1 = () => {
  const [count, setCount] = useState(0);

  useActived(() => {
    console.log("Comp1 is actived");
  });

  useUnactived(() => {
    console.log("Comp1 is unactived");
  });

  return (
    <div>
      Comp1
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
};

const Comp2 = () => {
  const [count, setCount] = useState(0);

  useActived(() => {
    console.log("Comp2 is actived");
  });

  useUnactived(() => {
    console.log("Comp2 is unactived");
  });

  return (
    <div>
      Comp2
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
};

function App() {
  const [toggle, setToggle] = useState(false);

  return (
    <div>
      <KeepAlive>{toggle ? <Comp1 /> : <Comp2 />}</KeepAlive>
      <button onClick={() => setToggle(!toggle)}>change</button>
    </div>
  );
}

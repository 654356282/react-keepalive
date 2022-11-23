# ReactKeepAlive

为组件提供 keepalive 能力，无数据断层！不操作 dom 节点！使用 suspense 作 keepalive!

缓存策略：优先使用 children 的 key 值作为缓存的 key，如果不存在 key 则使用 children 的 type

## Keepalive Props

`excludes: []`: 不需要缓存的 key

## usage

组件缓存

```ts
import { KeepAlive, useActived, useUnactived } from "@654356282/react-keepalive";
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

// 此时keepalive中缓存的key值为Comp1和Comp2
function App() {
  const [toggle, setToggle] = useState(false);

  return (
    <div>
      <KeepAlive>{toggle ? <Comp1 /> : <Comp2 />}</KeepAlive>
      <button onClick={() => setToggle(!toggle)}>change</button>
    </div>
  );
}
```

与`react-router`集成
```ts
import { ReactElement, useState } from "react";
import { KeepAlive, useActived, useUnactived } from "@654356282/react-keepalive";
import { RouterProvider, createBrowserRouter, NavLink } from "react-router-dom";
import React from "react";

function KeepAliveWrapper(props: { children: ReactElement }) {
  return <KeepAlive excludes={["/home"]}>{props.children}</KeepAlive>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <KeepAliveWrapper>
        <Root key="/" />
      </KeepAliveWrapper>
    ),
  },
  {
    path: "/home",
    element: (
      <KeepAliveWrapper>
        <Home key="/home" />
      </KeepAliveWrapper>
    ),
  },
]);

function Root() {
  const [count, setCount] = useState(0);

  useActived(() => {
    console.log("Root is actived");
  });

  useUnactived(() => {
    console.log("Root is unactived");
  });

  return (
    <div>
      <div>Root</div>
      <div>
        {count}
        <button onClick={() => setCount(count + 1)}>+1</button>
      </div>
      <NavLink to={"/home"}>跳转</NavLink>
    </div>
  );
}

function Home() {
  const [count, setCount] = useState(0);

  useActived(() => {
    console.log("Home is actived");
  });

  useUnactived(() => {
    console.log("Home is unactived");
  });

  return (
    <div>
      <div>Home</div>
      <div>
        {count}
        <button onClick={() => setCount(count + 1)}>+1</button>
      </div>
      <NavLink to={"/"} replace>
        跳转
      </NavLink>
    </div>
  );
}

export default function App() {
  return <RouterProvider router={router} />;
}

```

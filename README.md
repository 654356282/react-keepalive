# ReactKeepAlive

为组件提供 keepalive 能力，无数据断层！不操作 dom 节点！使用 suspense 作 keepalive!

缓存策略：优先使用 children 的 key 值作为缓存的 key，如果不存在 key 则使用 children 的 type

## Keepalive Props

`excludes: []|Regexp|(key: string|number)=>boolean`: 传入不需要缓存的组件的`key`，或者可传入正则表达式或函数

`includes: []|Regexp|(key: string|number)=>boolean`: 传入需要换的的组件的`key`，或者可传入正则表达式或函数

## Ref

```ts
type KeepAliveRef = {
  controller: {
    // 丢弃缓存的组件
    drop: (name: Key) => void;
  } | null;
};
```

## Hooks

`useActived`: 组件从初次渲染或者从隐藏切换到显示时激活
`useUnactived`: 组件销毁或者从显示切换到隐藏时激活
`useController`: 获取`ref`中`controller`对象

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

与`react-router`集成，使用`createBrowserRouter`
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
使用嵌套式路由

```tsx
import React, { ReactElement, useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { KeepAlive, useActived, useUnactived } from "@654356282/react-keepalive";

function wrapKeepAlive(children: ReactElement) {
  return <KeepAlive includes={/^\/home.*/}>{children}</KeepAlive>;
}

const Home = () => {
  useActived(() => {
    console.log("home actived");
  });

  useUnactived(() => {
    console.log("home unactived");
  });
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>home--{count}</div>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <NavLink to="/user">跳转 user</NavLink>
      <Outlet />
    </div>
  );
};

const HomeSon = () => {
  const [count, setCount] = useState(0);

  useActived(() => {
    console.log("home son actived");
  });

  useUnactived(() => {
    console.log("home son unactived");
  });

  return (
    <div>
      <div>home son--{count}</div>
      <button onClick={() => setCount(count + 1)}>son + 1</button>
      <NavLink to="/user/son">跳转user son</NavLink>
    </div>
  );
};

const User = () => {
  const [count, setCount] = useState(0);
  useActived(() => {
    console.log("user actived");
  });

  useUnactived(() => {
    console.log("user unactived");
  });

  return (
    <div>
      <div>user--{count}</div>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <NavLink to="/home">跳转 home</NavLink>
      <Outlet />
    </div>
  );
};

const UserSon = () => {
  const [count, setCount] = useState(0);

  useActived(() => {
    console.log("user son actived");
  });

  useUnactived(() => {
    console.log("user son unactived");
  });

  return (
    <div>
      <div>user son--{count}</div>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <NavLink to="/home/son">跳转home son</NavLink>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={wrapKeepAlive(<Home key="/home" />)}>
          <Route
            path="son"
            element={wrapKeepAlive(<HomeSon key="/home/son"></HomeSon>)}
          />
        </Route>
        <Route path="/user" element={wrapKeepAlive(<User key="/user" />)}>
          <Route
            path="son"
            element={wrapKeepAlive(<UserSon key="/user/son" />)}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

```

> tips: 如果需要缓存子路由，请保证父级路由需要`keepAlive`
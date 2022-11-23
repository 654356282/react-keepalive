import { ReactElement, useState } from "react";
import { KeepAlive, useActived, useUnactived } from "../../src";
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

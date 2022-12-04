import React, { ReactElement, useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { KeepAlive, useActived, useUnactived } from "../../src";

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

import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./CompKeepalive";
import RouterKeepalive from "./RouterKeepalive";
import RouterKeepalive2 from './RouterKeepalive2'

// const container = document.getElementById("root") as HTMLElement;
// render(<App />, container);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);

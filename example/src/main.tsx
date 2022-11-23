import React from "react";
import ReactDOM from "react-dom/client";
import RouterKeepalive from "./RouterKeepalive";

// const container = document.getElementById("root") as HTMLElement;
// render(<App />, container);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterKeepalive />
);

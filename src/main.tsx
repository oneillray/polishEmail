import React from "react";
import ReactDOM from "react-dom/client";
import { registerElements } from "genesys-spark-components";
import "genesys-spark-components/dist/genesys-webcomponents/genesys-webcomponents.css";
import { App } from "./App";
import "./styles.css";

registerElements();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);


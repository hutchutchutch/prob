import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeCanvasSubscriptions } from "./stores/canvasStore";

// Don't initialize canvas subscriptions - WorkflowCanvas manages nodes directly
// initializeCanvasSubscriptions();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

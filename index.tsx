import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Make sure this matches your "root" div in index.html
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Check your index.html file.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

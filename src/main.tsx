import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/arya-green/theme.css";

createRoot(document.getElementById("root")!).render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>
);

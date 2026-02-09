import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App";
import {Provider} from "./components/ui/provider.tsx";

// @ts-ignore
createRoot(document.getElementById("root")).render(
    (
        <Provider>
            <App/>
        </Provider>
    )
);

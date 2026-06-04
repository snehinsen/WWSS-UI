(window as any).global = window;

(window as any).process = {
    env: {},
};

import {createRoot} from "react-dom/client";
import "./syles/index.css";
import App from "./App";
import {Provider} from "./components/ui/provider.tsx";
import {UserContextProvider} from "./context/userContext.tsx";

// @ts-ignore
createRoot(document.getElementById("root")).render(
    (
        <Provider>
            <UserContextProvider>
                <App />
            </UserContextProvider>
        </Provider>
    )
);
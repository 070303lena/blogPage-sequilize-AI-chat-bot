import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import CheckIsLoginProvider from "./provider/checkIsLoginProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <CheckIsLoginProvider>
            <App />
        </CheckIsLoginProvider>
    </StrictMode>,
);

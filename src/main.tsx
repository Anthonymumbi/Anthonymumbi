import { createRoot } from "react-dom/client";
// Import router early so its future flags initialize before other react-router imports
import "./router";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

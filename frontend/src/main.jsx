import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";
import { EventProvider } from "./context/EventContext.jsx";
import { LocationProvider } from "./context/LocationContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EventProvider>
      <LocationProvider>
        <App />
      </LocationProvider>
    </EventProvider>
  </StrictMode>
);

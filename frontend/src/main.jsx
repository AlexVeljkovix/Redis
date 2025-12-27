import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";
import { EventProvider } from "./context/EventContext.jsx";
import { LocationProvider } from "./context/LocationContext.jsx";
import { ReservationProvider } from "./context/ReservationContext.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EventProvider>
      <LocationProvider>
        <ReservationProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
        </ReservationProvider>
      </LocationProvider>
    </EventProvider>
  </StrictMode>
);

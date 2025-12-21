import { useState, useContext, useEffect, createContext } from "react";
import {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../api/locationApi";

const LocationsContext = createContext();

export const LocationsProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getAllLocations();
        setLocations(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const getLocationById = (id) => {
    return locations.find((loc) => loc.id === id);
  };

  const addLocation = async (location) => {
    const loc = await createLocation(location);
    setLocations((prevLocations) => [...prevLocations, loc]);
  };

  const changeLocation = async (locationId, updatedLocation) => {
    await updateLocation(locationId, updatedLocation);
    setLocations((prevLocations) =>
      prevLocations.map((loc) =>
        loc.id === locationId ? updatedLocation : loc
      )
    );
  };

  const removeLocation = async (locationId) => {
    await deleteLocation(locationId);
    setLocations((prevLocations) =>
      prevLocations.filter((loc) => loc.id !== locationId)
    );
  };

  return (
    <LocationsContext.Provider
      value={{
        locations,
        isLoading,
        error,
        getLocationById,
        addLocation,
        changeLocation,
        removeLocation,
      }}
    >
      {children}
    </LocationsContext.Provider>
  );
};

export const useLocations = () => {
  return useContext(LocationsContext);
};

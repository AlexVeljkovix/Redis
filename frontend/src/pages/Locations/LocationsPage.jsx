import { useState } from "react";
import { useLocations } from "../../context/LocationContext";
import CreateLocationForm from "../../components/Location/CreateLocationForm";
import LocationCard from "../../components/Location/LocationCard";

const LocationsPage = () => {
  const { locations, isLoading, error } = useLocations();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-gray-500 text-lg">Loading locations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-red-500 text-lg">Error loading locations.</p>
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-gray-500 text-lg">No locations found.</p>
      </div>
    );
  }
  if (showForm) {
    return (
      <div className="min-h-screen bg-slate-100 p-8">
        <div className="flex justify-between mb-5">
          <CreateLocationForm setShowForm={setShowForm} />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="flex justify-between mb-5">
        <h1 className="text-4xl font-bold mb-6 text-gray-900 t">
          All Locations
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white py-2 px-4 h-10 justify-center rounded-lg font-semibold hover:bg-indigo-700 transition pointer-events-auto cursor-pointer"
        >
          Add New Location
        </button>
      </div>

      <div className="flex flex-col items-center gap-6 w-4/5 mx-auto">
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
    </div>
  );
};

export default LocationsPage;

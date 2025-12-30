import { useState } from "react";
import { useLocations } from "../../context/LocationContext";
import { useAuth } from "../../context/AuthContext";
import CreateLocationForm from "../../components/Location/CreateLocationForm";
import LocationCard from "../../components/Location/LocationCard";
import { useSearch } from "../../context/SearchContext";

const LocationsPage = () => {
  const { locations, isLoading, error } = useLocations();
  const { isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const { searchTerm } = useSearch();

  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (showForm) {
    return (
      <div className="min-h-screen bg-slate-100 p-8">
        <CreateLocationForm setShowForm={setShowForm} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-4xl font-bold text-gray-900">All Locations</h1>

        {/* Samo admin vidi dugme za kreiranje */}
        {isAdmin() && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white py-2 px-4 h-10 rounded-lg font-semibold hover:bg-indigo-700 transition cursor-pointer"
          >
            Add New Location
          </button>
        )}
      </div>

      {!filteredLocations || filteredLocations.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500 text-lg">No locations found.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6 w-4/5 mx-auto">
          {filteredLocations.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationsPage;

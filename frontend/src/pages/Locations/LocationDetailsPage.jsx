import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLocations } from "../../context/LocationContext";
import { useAuth } from "../../context/AuthContext";
import EditLocationForm from "../../components/Location/EditLocationForm";

const LocationDetailsPage = () => {
  const { locationId } = useParams();
  const { isAdmin } = useAuth();
  const {
    getLocationById,
    isLoading: locationsLoading,
    removeLocation,
  } = useLocations();

  const [showForm, setShowForm] = useState(false);

  const handleDelete = () => {
    removeLocation(locationId);
  };

  const location = getLocationById(locationId);

  if (locationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-gray-500 text-lg">Loading location...</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-red-500 text-lg">Location not found</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-slate-100 p-8">
        <EditLocationForm setShowForm={setShowForm} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto bg-linear-to-br from-indigo-600 to-purple-600 p-0.5 shadow-xl">
        <div className="bg-white p-8">
          <div className="mb-6 flex justify-between items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {location.name}
            </h1>

            {isAdmin() && (
              <div className="flex gap-5">
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 transition cursor-pointer"
                >
                  Delete
                </button>

                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition cursor-pointer"
                >
                  Edit Location
                </button>
              </div>
            )}
          </div>

          <p className="text-gray-500 mb-8">📍 {location.address}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-3">About the location</h2>
              <p className="text-gray-700 leading-relaxed">
                {location.description}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold mb-4 text-center">
                See all events at this location
              </h3>
              <Link
                to={`/locations/${locationId}/events`}
                className="w-full max-w-xs block text-center bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition hover:cursor-pointer"
              >
                See events
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetailsPage;

import { Link } from "react-router-dom";
import { useLocations } from "../../context/LocationContext";
import { useAuth } from "../../context/AuthContext";

const LocationCard = ({ location }) => {
  const { removeLocation } = useLocations();
  const { isAdmin } = useAuth();

  return (
    <div className="bg-linear-to-br from-indigo-600 to-purple-600 p-0.5 shadow-lg hover:shadow-xl transition w-full max-w-3xl mx-auto">
      <div className="bg-white p-5 h-full flex flex-col">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-2xl font-bold text-gray-900">{location.name}</h3>
        </div>

        {/* INFO */}
        <div className="text-gray-600 space-y-1 mb-4">
          <p>📍 {location.address}</p>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end mt-auto">
          <div className="flex gap-3 justify-end w-full">
            {/* Samo admin vidi Delete dugme */}
            {isAdmin() && (
              <button
                onClick={() => removeLocation(location.id)}
                className="text-center bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition hover:cursor-pointer"
              >
                Delete
              </button>
            )}
            <Link
              to={`/locations/${location.id}`}
              className="text-center bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;

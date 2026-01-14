import { useEffect, useState } from "react";
import { useLocations } from "../../context/LocationContext";
import { useParams } from "react-router-dom";

const EditLocationForm = ({ setShowForm }) => {
  const { locationId } = useParams();
  const {
    getLocationById,
    changeLocation,
    isLoading: locationsLoading,
  } = useLocations();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (locationsLoading) return;

    try {
      const loc = getLocationById(locationId);

      if (!loc) {
        setError("Location not found");
        setLoading(false);
        return;
      }

      setName(loc.name);
      setAddress(loc.address);
      setDescription(loc.description);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load location data:", err);
      setError("Failed to load location data");
      setLoading(false);
    }
  }, [locationId, locationsLoading, getLocationById]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !address) return;
    changeLocation(locationId, { name, address, description });
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-gray-500 text-lg">Loading location data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100 bg-opacity-30">
      <div className="bg-linear-to-br from-indigo-600 to-purple-600 p-0.5 shadow-lg">
        <div className="w-full max-w-2xl bg-white shadow-lg p-8 relative">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Edit Location
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Location Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter location name"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe the location"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition cursor-pointer"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditLocationForm;

import { useState } from "react";
import { useLocations } from "../../context/LocationContext";

const CreateLocationForm = ({ setShowForm }) => {
  const { addLocation } = useLocations();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addLocation({
      name,
      address,
      description,
    });
    setShowForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stale-100 bg-opacity-30">
      <div className="bg-linear-to-br from-indigo-600 to-purple-600 p-0.5 shadow-lg">
        <div className="w-full max-w-2xl bg-white shadow-lg p-8 relative">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Create New Location
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Event Name */}
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
            {/* Address */}
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
            {/* Description */}
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

            {/* Actions */}
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
                Create Location
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLocationForm;

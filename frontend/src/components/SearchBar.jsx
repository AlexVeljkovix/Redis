import { useSearch } from "../context/SearchContext";

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useSearch();
  return (
    <div>
      <div className="sm:w-48 mt-2">
        <div className="flex items-center">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            id="search"
            name="search"
            type="text"
            placeholder="Search"
            className="block min-w-0 grow bg-gray-800 py-1.5 pr-3 pl-1 text-base text-white font-bold focus:outline-none sm:text-sm/6"
          />
        </div>
      </div>
    </div>
  );
}

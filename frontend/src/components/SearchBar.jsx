import { useSearch } from "../context/SearchContext";

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useSearch();

  const inputId = `search-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div>
      <div className="sm:w-48 mt-2">
        <div className="flex items-center">
          <input
            id={inputId}
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            name="search"
            type="text"
            placeholder="Search"
            className="rounded-md block min-w-0 grow bg-gray-800 py-1.5 pr-3 pl-1 text-base text-white font-bold focus:outline-none sm:text-sm/6"
          />
        </div>
      </div>
    </div>
  );
}

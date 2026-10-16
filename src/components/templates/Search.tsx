import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useDebounce } from "../../hooks/cutomHooks";

interface SearchProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
}

export function Search({
  onSearch,
  placeholder = "Search...",
  delay = 500,
}: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, delay);

  useEffect(() => {
    onSearch(debouncedSearch.trim());
  }, [debouncedSearch, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="relative flex items-center w-full">
      <FiSearch className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-300 bg-white placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5"
        >
          <FiX className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default Search;

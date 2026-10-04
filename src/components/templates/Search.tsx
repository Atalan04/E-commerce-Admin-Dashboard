import  { useEffect, useState } from "react";
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
  delay = 500
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
    <div>
      <FiSearch  />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}/>
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}>
          <FiX  />
        </button>
      )}
    </div>
  );
}

export default Search;

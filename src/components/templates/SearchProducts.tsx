import { useState, useEffect } from "react";
import { useDebounce } from "../../hooks/customHooks";
import { useSearchParams } from "react-router-dom";

function SearchProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";

  const [search, setSearch] = useState<string>(initialSearch);
  const debounceSearch = useDebounce(search, 500);

 useEffect(() => {
    setSearchParams(
      (prevParams) => {
        const currentParamValue = prevParams.get("search") ?? "";
        const nextValue = debounceSearch.trim();

        if (currentParamValue === nextValue) {
          return prevParams;
        }

        const newParams = new URLSearchParams(prevParams);

        if (nextValue) {
          newParams.set("search", nextValue);
        } else {
          newParams.delete("search");
        }
        newParams.set("page", "1");
        return newParams;
      },
      { replace: true }
    );
  }, [debounceSearch, setSearchParams]);
  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleClear = () => {
    setSearch("");
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        id="search"
        placeholder="Search products by title..."
        value={search}
        onChange={searchHandler}
        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
      />
      {search && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default SearchProducts;

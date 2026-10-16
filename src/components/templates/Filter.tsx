import { useSearchParams } from "react-router-dom";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSortBy = searchParams.get("sortBy") ?? "";
  const currentSortOrder = searchParams.get("sortOrder") ?? "";

  const currentFilterValue = currentSortBy
    ? `${currentSortBy}-${currentSortOrder}`
    : "";

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (!value) {
      newParams.delete("sortBy");
      newParams.delete("sortOrder");
    } else {
      const [field, order] = value.split("-");
      newParams.set("sortBy", field);
      newParams.set("sortOrder", order);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const sortHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleSortChange(e.target.value);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-xs font-medium text-slate-500 whitespace-nowrap">
        Sort By:
      </label>
      <select
        id="sort-select"
        value={currentFilterValue}
        onChange={sortHandler}
        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 cursor-pointer transition"
      >
        <option value="">Default</option>
        <option value="createdAt-desc">Newest</option>
        <option value="createdAt-asc">Oldest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}

export default Filter;

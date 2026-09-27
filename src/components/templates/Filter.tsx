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
    setSearchParams(newParams);
  };

  const sortHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleSortChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor="sort-select">Sort By:</label>
      <select
        id="sort-select"
        value={currentFilterValue}
        onChange={sortHandler}
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

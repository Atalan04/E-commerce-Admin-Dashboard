import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { getProducts } from "../services/api";
import Search from "../components/templates/Search";
import Filter from "../components/templates/Filter";

function Products() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const [searchParams]=useSearchParams()
  const categoryId =searchParams.get("categoryId") || undefined
  const sortBy = searchParams.get("sortBy") || undefined
  const sortOrder= searchParams.get("sortOrder") || undefined



  const { data, isPending, isError, error } = useQuery({
    queryKey: ["products", page, limit, categoryId, sortBy, sortOrder],
    queryFn: () => {
      return getProducts({ page, limit, categoryId, sortBy,sortOrder });
    },
  });
  const products = data?.data;

  const meta = data?.meta;

  if (isPending) return <div>getting products ....</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const totalPages = meta?.totalPages ?? 1;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      <Search />
      <Filter/>
      <ul>
        {products?.map((item) => (
          <li key={item.id}>
            {item.title} - ${item.price}
          </li>
        ))}
      </ul>
      <div>
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={!meta?.hasPrevPage}
        >
          Back
        </button>
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            disabled={pageNum === page}
          >
            {pageNum}
          </button>
        ))}
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={!meta?.hasNextPage}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default Products;

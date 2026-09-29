import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { getProducts, deleteProduct } from "../services/api";
import type { ProductTypes } from "../types/productsCategoryTypes";

import Search from "../components/templates/Search";
import Filter from "../components/templates/Filter";
import ProductModal from "../components/ProductsModal";
import ProductDetailsModal from "../components/ProductDetailsModal";

function Products() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductTypes | null>(
    null,
  );

  const [detailProductId, setDetailProductId] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = searchParams.get("sortOrder") || undefined;
  const search = searchParams.get("search") || undefined;

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["products", page, limit, categoryId, sortBy, sortOrder, search],
    queryFn: () => {
      return getProducts({
        page,
        limit,
        categoryId,
        sortBy,
        sortOrder,
        search,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      alert("Product is successfully deleted.");
    },
    onError: (err: any) => {
      alert(
        `Error on deleting: ${err?.response?.data?.message || err.message}`,
      );
    },
  });

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: ProductTypes) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    const isConfirmed = window.confirm(` Do you want to delete ${title}?`);
    if (isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  if (isPending) return <div>getting products ....</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const products = data?.data;
  const meta = data?.meta;

  const totalPages = meta?.totalPages ?? 1;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      <div>
        <button type="button" onClick={handleAddNew}>
          + Add Product
        </button>
      </div>

      <Search />
      <Filter />

      <ul>
        {products?.map((item) => (
          <li key={item.id}>
            <div>
              <strong>{item.title}</strong> - ${item.price}
              <span>(Stock: {item.stock})</span>
            </div>

            <div>
              <button type="button" onClick={() => handleEdit(item)}>
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id, item.title)}
                disabled={deleteMutation.isPending}
              >
                Delete
              </button>
              <button
                onClick={() => setDetailProductId(item.id)}
                title="View Details"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
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

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={selectedProduct}
      />
      <ProductDetailsModal
        isOpen={!!detailProductId}
        productId={detailProductId}
        onClose={() => setDetailProductId(null)}
      />
    </>
  );
}

export default Products;

import { useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData  } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import { getProducts, deleteProduct } from "../services/api";
import type { ProductTypes } from "../types/productsCategoryTypes";

import SearchProducts from "../components/templates/SearchProducts";
import Filter from "../components/templates/Filter";
import ProductModal from "../components/ProductsModal";
import ProductDetailsModal from "../components/ProductDetailsModal";

function Products() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductTypes | null>(null);
  const [detailProductId, setDetailProductId] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();


  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 9;
  const categoryId = searchParams.get("categoryId") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = searchParams.get("sortOrder") || undefined;
  const search = searchParams.get("search") || undefined;

  const { data, isPending,isPlaceholderData, isError, error } = useQuery({
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
    placeholderData: keepPreviousData,
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

   const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    setSearchParams(newParams);
  };

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

  if (isPending) return <div className="p-6 text-sm text-slate-500">getting products ....</div>;
  if (isError) return <div className="p-6 text-sm text-rose-600">Error: {error.message}</div>;

 const products = data?.data;
const pagination = (data as any)?.pagination;

const totalPages = pagination?.totalPages ?? 1;
const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

const hasPrevPage = page > 1;
const hasNextPage = page < totalPages;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            Products Catalog
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Manage your store items, pricing, and stocks
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddNew}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition"
        >
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <SearchProducts />
        <Filter />
      </div>

       <ul
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity ${
          isPlaceholderData ? "opacity-60" : "opacity-100"
        }`}
        >
        {products?.map((item) => (
          <li
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-2">
              <strong className="text-base font-semibold text-slate-800 line-clamp-1">
                {item.title}
              </strong>
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono tabular-nums font-bold text-blue-600 text-base">
                  ${item.price}
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  (Stock: {item.stock})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleEdit(item)}
                className="px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id, item.title)}
                disabled={deleteMutation.isPending}
                className="px-3 py-1.5 text-xs font-medium bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition disabled:opacity-50"
              >
                Delete
              </button>
              <button
                onClick={() => setDetailProductId(item.id)}
                title="View Details"
                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <svg
                  className="w-4 h-4"
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

     <div className="flex items-center justify-center gap-1.5 pt-4">
        <button
          onClick={() => handlePageChange(Math.max(page - 1, 1))}
          disabled={!hasPrevPage}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Back
        </button>
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            disabled={pageNum === page}
            className={`min-w-8 h-8 rounded-lg text-xs font-semibold transition ${
              pageNum === page
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {pageNum}
          </button>
        ))}
      <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNextPage}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
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
    </div>
  );
}

export default Products;

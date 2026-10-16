import { useState, useEffect } from "react";

import { addProduct, updateProduct } from "../services/api";
import { getCategories } from "../services/CategoriesFn";
import type {
  ProductTypes,
  CreateProductInput,
} from "../types/productsCategoryTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: ProductTypes | null;
}

const initialFormState: CreateProductInput = {
  title: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  categoryId: "",
};

function ProductsModal({ isOpen, onClose, productToEdit }: ProductsModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] =
    useState<CreateProductInput>(initialFormState);

  const { data: categoryRes } = useQuery({
    queryKey: ["category"],
    queryFn: getCategories,
  });
  const categories = categoryRes?.data ?? [];

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        title: productToEdit.title,
        description: productToEdit.description ?? "",
        price: productToEdit.price,
        stock: productToEdit.stock,
        imageUrl: productToEdit.imageUrl ?? "",
        categoryId: productToEdit.categoryId,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [productToEdit, isOpen]);

  const addMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    },
    onError: (err: any) => {
      alert(
        `Error on Creating Product: ${err?.response?.data?.message || err.message}`,
      );
    },
  });

  const editMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
    },
    onError: (err: any) => {
      alert(
        `Error on Editing Product: ${err?.response?.data?.message || err.message}`,
      );
    },
  });

  if (!isOpen) return null;

  const isSubmitting = addMutation.isPending || editMutation.isPending;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
    };

    if (productToEdit) {
      editMutation.mutate({ id: productToEdit.id, ...payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition";

  const labelClass =
    "block text-2xs font-semibold uppercase text-slate-500 tracking-wider mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        <h3 className="text-lg font-bold text-slate-800 mb-5">
          {productToEdit ? "Edit Product" : "Add New Product"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Price:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Stock:</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min={0}
                className={inputClass}
              />
            </div>
          </div>

          <div className={labelClass}>
            <label>Category:</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Image URL:</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={inputClass}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : productToEdit
                  ? "Update Product"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductsModal;

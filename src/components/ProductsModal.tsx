import { useState, useEffect } from "react";

import { addProduct, updateProduct } from "../services/api";
import {getCategories} from "../services/CategoriesFn"
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
      onClose()
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
        `Error on Editing Product: ${err?.response?.data.message || err.message}`,
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
        ? value === "" ? "" : Number(value)
       : value,
    }));
  };

  const handleSumit = (e: React.FormEvent) => {
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

  return (
    <div>
      <div>
        <h3>{productToEdit ? "Edit Product" : "Add New Product"}</h3>
        <form onSubmit={handleSumit}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Stock:</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min={0}
            />
          </div>
          <div>
            <label>Category:</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
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
            <label>Image URL:</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div>
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}>
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

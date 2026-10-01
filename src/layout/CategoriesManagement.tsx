import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/CategoriesFn";
import CategoryIcons from "../constants/CategoryIcons";
import { AVAILABLE_CATEGORY_ICONS } from "../constants/CategoryIcons";
import type { Category } from "../types/productsCategoryTypes";

function CategoriesManagement() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("tag");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    data: categoryRes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["category"],
    queryFn: getCategories,
  });

  const categories: Category[] = categoryRes?.data ?? [];

  const resetForm = () => {
    setName("");
    setSelectedIcon("tag");
    setEditingCategory(null);
  };

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; icon: string }) =>
      createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      resetForm();
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string; name: string; icon: string }) =>
      updateCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      resetForm();
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || "Failed to delete category");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name: name.trim(),
      icon: selectedIcon,
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEditClick = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSelectedIcon((cat as any).icon || "tag");
  };

  const handleDelete = (cat: Category) => {
    if (cat._count && cat._count.products > 0) {
      if (
        !confirm(
          `Warning: "${cat.name}" has ${cat._count.products} products. Delete anyway?`,
        )
      )
        return;
    } else {
      if (!confirm(`Are you sure you want to delete "${cat.name}"?`)) return;
    }
    deleteMutation.mutate(cat.id);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Category Management
        </h1>
        <p className="text-sm text-gray-500">
          Create, edit, and assign icons to store categories
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-8"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <CategoryIcons
              iconName={selectedIcon}
              className="w-6 h-6 text-blue-600"
            />
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name (e.g. Laptops, Running Shoes...)"
            className="flex-1 w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            disabled={isSubmitting}
          />

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
            >
              {isSubmitting
                ? "Saving..."
                : editingCategory
                  ? "Update Category"
                  : "Add Category"}
            </button>

            {editingCategory && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-gray-100">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
            Select Category Icon:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {AVAILABLE_CATEGORY_ICONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedIcon === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedIcon(opt.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/80 text-blue-700 ring-2 ring-blue-500/20 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-md ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium truncate">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </form>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50/70 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">Categories List</h2>
          <span className="text-xs bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full font-medium">
            {categories.length} items
          </span>
        </div>

        {isLoading && (
          <div className="p-8 text-center text-gray-500">
            Loading categories...
          </div>
        )}

        {isError && (
          <div className="p-8 text-center text-red-500">
            Failed to load categories.
          </div>
        )}

        {!isLoading && categories.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No categories found. Create your first category above!
          </div>
        )}

        <ul className="divide-y divide-gray-100">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50/80 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <CategoryIcons
                    iconName={(cat as any).icon}
                    categoryName={cat.name}
                    className="w-5 h-5 text-blue-600"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-800">
                      {cat.name}
                    </span>
                    {/* <span className="text-xs text-gray-400 font-mono">
                      /{cat.slug}
                    </span> */}
                    {cat._count?.products !== undefined && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-medium border border-gray-200 whitespace-nowrap">
                        {cat._count.products} products
                      </span>
                    )}
                  </div>
                  {/* {cat.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {cat.description}
                    </p>
                  )} */}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEditClick(cat)}
                  className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md transition"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat)}
                  disabled={deleteMutation.isPending}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default CategoriesManagement;

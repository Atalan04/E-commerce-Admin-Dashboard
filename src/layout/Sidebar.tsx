import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/CategoriesFn";
import CategoryIcons from "../constants/CategoryIcons";

function Sidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: categoryRes, isLoading } = useQuery({
    queryKey: ["category"],
    queryFn: getCategories,
  });

  const categories = categoryRes?.data ?? [];

  const cateHandler = () => {
    setIsOpen((prev) => !prev);
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? "bg-blue-50 text-blue-700 font-semibold shadow-xs"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 bg-white p-3 md:p-4 shrink-0 flex flex-col gap-1.5 shadow-xs">
      <NavLink to="/" className={navItemClass}>
        Dashboard
      </NavLink>
      <NavLink to="/users" className={navItemClass}>
        Users
      </NavLink>
      <NavLink to="/orders" className={navItemClass}>
        Orders
      </NavLink>
      <div className="w-full">
        <button
          type="button"
          onClick={cateHandler}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <span>Categories</span>
          <span className="text-xs text-slate-400">{isOpen ? "▲" : "▼"}</span>
        </button>
        {isOpen && (
          <div className="mt-1 pl-4 space-y-1 border-l-2 border-slate-100 ml-3">
            {isLoading && (
              <span className="block px-3 py-1.5 text-xs text-slate-400">
                Loading...
              </span>
            )}
            <NavLink to="/products" className={navItemClass}>
              All Products
            </NavLink>
            <NavLink to="/categories" className={navItemClass}>
              Manage Categories
            </NavLink>
            {categories.map((cat: any) => (
              <NavLink
                key={cat.id}
                to={`/products?categoryId=${cat.id}`}
                className={navItemClass}
              >
                <CategoryIcons
                  iconName={cat.icon}
                  categoryName={cat.name}
                  className="w-4 h-4 shrink-0 text-slate-500"
                />
                <span className="truncate">{cat.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
      <NavLink to="/products" className={navItemClass}>
        Products
      </NavLink>
    </aside>
  );
}

export default Sidebar;

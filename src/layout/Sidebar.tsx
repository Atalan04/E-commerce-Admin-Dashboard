import { useState } from "react";
import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories } from "../services/CategoriesFn";
import CategoryIcons from "../components/CategoryIcons";
import type { Category } from "../types/productsCategoryTypes";
import { logoutApi } from "../services/api"; 

function Sidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();


  const activeCategoryId = searchParams.get("categoryId");

  const { data: categoryRes, isLoading } = useQuery<{ data: Category[] }>({
    queryKey: ["category"],
    queryFn: getCategories,
  });

  const categories = categoryRes?.data ?? [];

  const cateHandler = () => {
    setIsOpen((prev) => !prev);
  };

 
  const baseItemClass =
    "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150";
  const activeClass = "bg-blue-50 text-blue-700 font-semibold shadow-xs";
  const inactiveClass = "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `${baseItemClass} ${isActive ? activeClass : inactiveClass}`;

  
  const handleLogout = async () => {
    try {
      await logoutApi();
    } finally {
    
      queryClient.clear();
 
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className="w-full md:w-64 min-h-screen border-b md:border-b-0 md:border-r border-slate-200 bg-white p-3 md:p-4 shrink-0 flex flex-col justify-between shadow-xs">
    
      <div className="flex flex-col gap-1.5">
        <NavLink to="/" end className={navItemClass}>
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

              <NavLink to="/categories" end className={navItemClass}>
                Manage Categories
              </NavLink>


              {categories.map((cat: Category) => {
                const isCatActive =
                  location.pathname === "/products" &&
                  activeCategoryId === String(cat.id);

                return (
                  <NavLink
                    key={cat.id}
                    to={`/products?categoryId=${cat.id}`}
                    className={`${baseItemClass} ${
                      isCatActive ? activeClass : inactiveClass
                    }`}
                  >
                    <CategoryIcons
                      iconName={cat.icon}
                      categoryName={cat.name}
                      className={`w-4 h-4 shrink-0 ${
                        isCatActive ? "text-blue-600" : "text-slate-500"
                      }`}
                    />
                    <span className="truncate">{cat.name}</span>
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>

        <NavLink
          to="/products"
          end
          className={() => {
            const isAllProductsActive =
              location.pathname === "/products" && !activeCategoryId;
            return `${baseItemClass} ${
              isAllProductsActive ? activeClass : inactiveClass
            }`;
          }}
        >
          Products
        </NavLink>
      </div>


      <div className="pt-4 mt-auto border-t border-slate-100">
        <button
          type="button"
          onClick={handleLogout}
          className={`${baseItemClass} w-full text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors group cursor-pointer`}
        >
          <svg
            className="w-4 h-4 shrink-0 text-rose-500 group-hover:text-rose-700 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

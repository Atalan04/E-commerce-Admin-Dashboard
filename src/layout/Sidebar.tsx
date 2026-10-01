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

  return (
    <aside>
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/users">Users</NavLink>
      <NavLink to="/orders">Orders</NavLink>
      <div>
        <button type="button" onClick={cateHandler}>
          <span>Categories</span>
          <span>{isOpen ? "▲" : "▼"}</span>
        </button>
        {isOpen && (
          <div>
            {isLoading && <span>Loading...</span>}
            <NavLink to="/products">All Products</NavLink>
            <NavLink to="/categories">Manage Categories</NavLink>
            {categories.map((cat: any) => (
              <NavLink
                key={cat.id}
                to={`/products?categoryId=${cat.id}`}
              >
                <CategoryIcons
                  iconName={cat.icon}
                  categoryName={cat.name}
                  className="w-3.5 h-3.5 shrink-0 text-gray-500"
                />
                <span className="truncate">{cat.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
      <NavLink to="/products">products</NavLink>
    </aside>
  );
}

export default Sidebar;

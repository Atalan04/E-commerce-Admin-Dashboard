import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/api";

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
            {categories.map((cat) => (
              <NavLink key={cat.id} to={`/products?categoryId=${cat.id}`}>
                {cat.name}
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

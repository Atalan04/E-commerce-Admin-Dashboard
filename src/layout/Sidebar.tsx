import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <nav>
      <NavLink to="categories">Categories</NavLink>
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/users">Users</NavLink>
      <NavLink to="/orders">Orders</NavLink>
      <NavLink to="/products">products</NavLink>
    </nav>
  );
}

export default Sidebar;

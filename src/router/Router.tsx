import { Routes, Route } from "react-router-dom";
import PageNotFound from "../pages/404";
import Admin from "../pages/Admin";
import AuthenticationPage from "../pages/AuthenticationPage";
import Products from "../pages/Products";
import CategoriesManagement from "../layout/CategoriesManagement";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Admin />}>
        <Route index element={<h1>Dashboard</h1>} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<CategoriesManagement/>} />
        <Route path="users" element={<h1>Users</h1>} />
        <Route path="orders" element={<h1>Orders</h1>} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
      <Route path="/login" element={<AuthenticationPage />} />
    </Routes>
  );
}

export default Router;

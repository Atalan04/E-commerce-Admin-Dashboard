import { Routes, Route } from "react-router-dom";

import PageNotFound from "../pages/404";
import Admin from "../pages/Admin";
import AuthenticationPage from "../pages/AuthenticationPage";
import Products from "../pages/Products";
import CategoriesManagement from "../layout/CategoriesManagement";
import UsersManagement from "../layout/UsersManagement";
import OrdersManagements from "../layout/OrdersManagements";
import ProtectedRoute from "../components/ProtectedRoute";

function Router() {
  return (
    <Routes>
      <Route path="/login" element={<AuthenticationPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Admin />}>
          <Route index element={<h1>Dashboard</h1>} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="orders" element={<OrdersManagements />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default Router;

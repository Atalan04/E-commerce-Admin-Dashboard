import { Routes,Route } from "react-router-dom";
import PageNotFound from "../pages/404";
import AdminDashboard from "../pages/AdminDashboard";
import AuthenticationPage from "../pages/AuthenticationPage";


function Router() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard/>}/>
      <Route path="*" element={<PageNotFound/>}/>
      <Route path="/login" element={<AuthenticationPage/>}/>
    </Routes>
  )
}

export default Router
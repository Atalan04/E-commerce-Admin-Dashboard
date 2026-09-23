import { Outlet } from "react-router-dom"
import Header from "../layout/Header"
import Sidebar from "../layout/Sidebar"

function Admin() {
      console.log("ADMIN RENDER");

  return (
    <div>
      <Header/>
      <Sidebar/>
      <Outlet/>
    </div>
  )
}

export default Admin
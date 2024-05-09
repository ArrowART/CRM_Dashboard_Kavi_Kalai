import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Main } from "../core/Main/Main";
import SigninPage from "../components/SignIn/SigninPage";
import { Dashboardpage } from "../components/DashboardPage/Dashboardpage";
import ProductivityPage from "../components/ProductivityPage/ProductivityPage";
import LeadsandWipPage from "../components/LeadsandWipPage/LeadsandWipPage";
import Userpage from "../components/UsersPage/Userpage";
import { TeamPage } from "../components/TeamPage/TeamPage";
import AllocationPage from "../components/AllocationPage/AllocationPage";


const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SigninPage />} />
          <Route element={<Main/>}>
            <Route path="/dashboard" element={<Dashboardpage />}/>
            <Route path="/productivity" element={<ProductivityPage />}/>
            <Route path="/leadsandwip" element={<LeadsandWipPage />}/>
            <Route path="/users" element={<Userpage/>}/>
            <Route path="/allocation" element={<AllocationPage/>}/>
            <Route path="/teams" element={<TeamPage/>}/>

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default AppRouter;
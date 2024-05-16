import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Main } from "../core/Main/Main";
import SigninPage from "../components/SignIn/SigninPage";
import { Dashboardpage } from "../components/DashboardPage/Dashboardpage";
import LeadsandWipPage from "../components/LeadsandWipPage/LeadsandWipPage";
import Userpage from "../components/UsersPage/Userpage";
import { TeamPage } from "../components/TeamPage/TeamPage";
import AllocationPage from "../components/AllocationPage/AllocationPage";
import ProtectedRoute from "../shared/services/token/ProtectedRoute";
import { TelecallerleadsPage } from "../components/TelecallerleadsPage/TelecallerleadsPage";
import { FollowupPage } from "../components/Followup/FollowupPage";
import { ProductivityPage } from "../components/ProductivityPage/ProductivityPage";



const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SigninPage />} />
        <Route element={<Main />}>
          <Route path="/dashboard" element={<ProtectedRoute> <Dashboardpage /> </ProtectedRoute>} />
          <Route path="/productivity" element={<ProtectedRoute>  <ProductivityPage /></ProtectedRoute>}/>
          <Route path="/leadsandwip" element={ <ProtectedRoute> <LeadsandWipPage /> </ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute> <Userpage /></ProtectedRoute>} />
          <Route path="/allocation" element={<ProtectedRoute><AllocationPage /></ProtectedRoute>} />
          <Route path="/teams" element={<ProtectedRoute><TeamPage /></ProtectedRoute>} />
          <Route path="/telecallerleads" element={<ProtectedRoute><TelecallerleadsPage /></ProtectedRoute>} />
          <Route path="/followup" element={<ProtectedRoute><FollowupPage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/User/HomePage";
import AdminUser from "../pages/Admin/User/AdminUser";
import LayoutAdmin from "../layout/LayoutAdmin";
import AdminMovie from "../pages/Admin/Movie/AdminMovie";
import AdminGenre from "../pages/Admin/Genre/AdminGenre";
import AdminRegion from "../pages/Admin/Region/AdminRegion";
import AdminDirector from "../pages/Admin/Director/AdminDirector";
import AdminCast from "../pages/Admin/Cast/AdminCast";
import ProtectRoute from "./ProtectRoute";
import LoginAdminPage from "../pages/Admin/LoginAdminPage";
import AdminCinemas from "../pages/Admin/Cinema/AdminCinema";
import AdminScreen from "../pages/Admin/Screen/AdminScreen";
import SeatLayout from "../pages/Admin/Screen/SeatLayOut";
import AdminSchedule from "../pages/Admin/Schedule/AdminSchedule";
import AdminShowTime from "../pages/Admin/ShowTime/AdminShowTime";
import AdminOrder from "../pages/Admin/Order/AdminOrder";
import AdminTicketPrice from "../pages/Admin/TicketPrice/AdminTicketPrice";
import AdminCoupon from "../pages/Admin/Coupon/AdminCoupon";
import AdminNew from "../pages/Admin/News/AdminNew";
import AdminCombo from "../pages/Admin/Combo/AdminCombo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login/admin",
    element: <LoginAdminPage />, // Trang đăng nhập admin
  },
  {
    path: "/testing",
    element: <SeatLayout />,
  },
  {
    path: "/admin",
    element: (
      <ProtectRoute>
        <LayoutAdmin />
      </ProtectRoute>
    ),
    children: [
      {
        path: "user",
        index: true,
        element: <AdminUser />,
      },
      {
        path: "movie",
        element: <AdminMovie />,
      },
      {
        path: "cinemas",
        element: <AdminCinemas />,
      },
      {
        path: "screen",
        element: <AdminScreen />,
      },
      {
        path: "schedule",
        element: <AdminSchedule />,
      },
      {
        path: "showtime",
        element: <AdminShowTime />,
      },
      {
        path: "order",
        element: <AdminOrder />,
      },
      {
        path: "ticketprice",
        element: <AdminTicketPrice />,
      },
      {
        path: "coupon",
        element: <AdminCoupon />,
      },
      {
        path: "news",
        element: <AdminNew />,
      },

      {
        path: "genre",
        element: <AdminGenre />,
      },
      {
        path: "region",
        element: <AdminRegion />,
      },
      {
        path: "director",
        element: <AdminDirector />,
      },
      {
        path: "cast",
        element: <AdminCast />,
      },
      {
        path: "combo",
        element: <AdminCombo />,
      },
    ],
  },
]);
export default router;

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
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
    ],
  },
]);
export default router;

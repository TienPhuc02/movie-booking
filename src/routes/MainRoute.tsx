import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/User/HomePage";
import AdminUser from "../pages/Admin/User/AdminUser";
import LayoutAdmin from "../layout/LayoutAdmin";
import AdminMovie from "../pages/Admin/Movie/AdminMovie";
import AdminGenre from "../pages/Admin/Genre/AdminGenre";
import AdminRegion from "../pages/Admin/Region/AdminRegion";
import AdminDirector from "../pages/Admin/Director/AdminDirector";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
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
        path:"region",
        element: <AdminRegion />,
      },
      {
        path:"director",
        element: <AdminDirector />,
      }
    ],
  },
]);
export default router;

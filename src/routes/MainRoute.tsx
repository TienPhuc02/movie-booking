import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/User/HomePage";
import AdminUser from "../pages/Admin/User/AdminUser";
import LayoutAdmin from "../layout/LayoutAdmin";
import AdminMovie from "../pages/Admin/Move/AdminMovie";
import AdminGenre from "../pages/Admin/Genre/AdminGenre";

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
    ],
  },
]);
export default router;

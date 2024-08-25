import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/User/HomePage";
import AdminUser from "../pages/Admin/User/AdminUser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/admin",
    children: [
      {
        index: true,
        element: <>Layout Admin</>,
      },
      {
        path: "/admin/user",
        element: <AdminUser />,
      },
    ],
  },
  // {
  //   path: "/login",
  //   element: <LoginPage />,
  // },
]);
export default router;

import { createBrowserRouter } from "react-router-dom";

import HomePage from "../pages/User/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  // {
  //   path: "/login",
  //   element: <LoginPage />,
  // },
]);
export default router;

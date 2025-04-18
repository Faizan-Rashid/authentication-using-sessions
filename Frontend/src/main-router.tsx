import { createBrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import VerifyEmail from "./pages/VerifyEmail.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import AppContainer from "./components/AppContainer.tsx";
import Profile from "./pages/Profile.tsx";
import Settings from "./pages/Settings.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/protected-route",
        element: <AppContainer />,
        children: [
          // {
          //   path: "/protected-route",
          //   element: null,
          //   children: [
          {
            path: "/protected-route/profile",
            element: <Profile />,
          },
          {
            path: "/protected-route/settings",
            element: <Settings />,
          },
          //   ],
          // },
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/email/verify/:code",
        element: <VerifyEmail />,
      },
      {
        path: "/password/forgot",
        element: <ForgotPassword />,
      },
      {
        path: "/password/reset",
        element: <ResetPassword />,
      },
    ],
  },
]);

export default router;

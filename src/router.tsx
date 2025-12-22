import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Members from "./pages/Members";
import Analytics from "./pages/Analytics";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// Create router early so future flags are applied before other react-router imports
export const router = createBrowserRouter(
  [
    { path: "/", element: <Index /> },
    { path: "/admin-login", element: <AdminLogin /> },
    {
      path: "/members",
      element: (
        <ProtectedRoute>
          <Members />
        </ProtectedRoute>
      ),
    },
    {
      path: "/analytics",
      element: (
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      ),
    },
    { path: "*", element: <NotFound /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

export default router;

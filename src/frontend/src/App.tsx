import Layout from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsAdmin } from "@/hooks/useAuth";
import LoginPage from "@/pages/LoginPage";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const EventsPage = lazy(() => import("@/pages/EventsPage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));
const OAuthCallbackPage = lazy(() => import("@/pages/OAuthCallbackPage"));

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
        <div className="space-y-3 w-full max-w-sm">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: isAdmin, isLoading } = useIsAdmin();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Skeleton className="h-32 w-full max-w-sm rounded-2xl" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="p-8 space-y-4 max-w-2xl mx-auto">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-2 gap-4">
              {["a", "b", "c", "d", "e", "f"].map((k) => (
                <Skeleton key={k} className="h-32 rounded-3xl" />
              ))}
            </div>
          </div>
        }
      >
        <EventsPage />
      </Suspense>
    </AuthGuard>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <AuthGuard>
      <AdminGuard>
        <Suspense
          fallback={
            <div className="p-8">
              <Skeleton className="h-48 w-full max-w-lg rounded-2xl" />
            </div>
          }
        >
          <AdminPage />
        </Suspense>
      </AdminGuard>
    </AuthGuard>
  ),
});

const oauthCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/oauth/callback",
  component: () => (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center p-8">
            <Skeleton className="h-32 w-full max-w-sm rounded-2xl" />
          </div>
        }
      >
        <OAuthCallbackPage />
      </Suspense>
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute,
  oauthCallbackRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

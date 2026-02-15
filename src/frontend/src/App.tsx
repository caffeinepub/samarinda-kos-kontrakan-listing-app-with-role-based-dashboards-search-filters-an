import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppShell from './components/layout/AppShell';
import PublicListingsPage from './pages/PublicListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import OwnerDashboardLayout from './pages/OwnerDashboardLayout';
import AdminDashboardLayout from './pages/AdminDashboardLayout';
import OwnerMyListingsPage from './pages/owner/OwnerMyListingsPage';
import OwnerCreateListingPage from './pages/owner/OwnerCreateListingPage';
import OwnerRequestsPage from './pages/owner/OwnerRequestsPage';
import OwnerEditRequestPage from './pages/owner/OwnerEditRequestPage';
import AdminAllListingsPage from './pages/admin/AdminAllListingsPage';
import AdminCreateListingPage from './pages/admin/AdminCreateListingPage';
import AdminRequestsQueuePage from './pages/admin/AdminRequestsQueuePage';

const rootRoute = createRootRoute({
  component: AppShell,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: PublicListingsPage,
});

const listingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listings/$id',
  component: ListingDetailPage,
});

const ownerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner',
  component: OwnerDashboardLayout,
});

const ownerMyListingsRoute = createRoute({
  getParentRoute: () => ownerRoute,
  path: '/',
  component: OwnerMyListingsPage,
});

const ownerCreateRoute = createRoute({
  getParentRoute: () => ownerRoute,
  path: '/create',
  component: OwnerCreateListingPage,
});

const ownerRequestsRoute = createRoute({
  getParentRoute: () => ownerRoute,
  path: '/requests',
  component: OwnerRequestsPage,
});

const ownerEditRequestRoute = createRoute({
  getParentRoute: () => ownerRoute,
  path: '/edit-request/$id',
  component: OwnerEditRequestPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardLayout,
});

const adminAllListingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: AdminAllListingsPage,
});

const adminCreateRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/create',
  component: AdminCreateListingPage,
});

const adminRequestsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/requests',
  component: AdminRequestsQueuePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  listingDetailRoute,
  ownerRoute.addChildren([
    ownerMyListingsRoute,
    ownerCreateRoute,
    ownerRequestsRoute,
    ownerEditRequestRoute,
  ]),
  adminRoute.addChildren([
    adminAllListingsRoute,
    adminCreateRoute,
    adminRequestsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}


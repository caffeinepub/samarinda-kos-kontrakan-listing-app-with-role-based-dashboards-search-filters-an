import { Outlet, Link, useLocation } from '@tanstack/react-router';
import { Home, Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RoleGate from '@/components/auth/RoleGate';

export default function OwnerDashboardLayout() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <RoleGate requiredRole="user">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Property Owner Dashboard</h1>
          <p className="text-muted-foreground">Manage your listings and requests</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-64 shrink-0">
            <nav className="space-y-2">
              <Link to="/owner">
                <Button
                  variant={isActive('/owner') ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  <Home className="h-4 w-4 mr-2" />
                  My Listings
                </Button>
              </Link>
              <Link to="/owner/create">
                <Button
                  variant={isActive('/owner/create') ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Listing
                </Button>
              </Link>
              <Link to="/owner/requests">
                <Button
                  variant={isActive('/owner/requests') ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  My Requests
                </Button>
              </Link>
            </nav>
          </aside>

          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </RoleGate>
  );
}


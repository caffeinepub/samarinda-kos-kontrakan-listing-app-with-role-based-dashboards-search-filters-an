import { Outlet, Link, useLocation } from '@tanstack/react-router';
import { List, Plus, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RoleGate from '@/components/auth/RoleGate';

export default function AdminDashboardLayout() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <RoleGate requiredRole="admin">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all listings and moderation requests</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-64 shrink-0">
            <nav className="space-y-2">
              <Link to="/admin">
                <Button
                  variant={isActive('/admin') ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  <List className="h-4 w-4 mr-2" />
                  All Listings
                </Button>
              </Link>
              <Link to="/admin/create">
                <Button
                  variant={isActive('/admin/create') ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Listing
                </Button>
              </Link>
              <Link to="/admin/requests">
                <Button
                  variant={isActive('/admin/requests') ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Requests Queue
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


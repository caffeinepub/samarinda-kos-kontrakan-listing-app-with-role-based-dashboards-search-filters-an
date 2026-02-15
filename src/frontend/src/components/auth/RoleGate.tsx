import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

interface RoleGateProps {
  children: ReactNode;
  requiredRole: 'user' | 'admin';
}

export default function RoleGate({ children, requiredRole }: RoleGateProps) {
  const { isAuthenticated, role, profileLoading } = useAuth();

  if (profileLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-12 max-w-2xl">
        <Alert variant="destructive">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription className="mt-2">
            You must be logged in to access this page.
          </AlertDescription>
          <div className="mt-4">
            <Link to="/">
              <Button variant="outline">Go to Home</Button>
            </Link>
          </div>
        </Alert>
      </div>
    );
  }

  if (role !== requiredRole) {
    return (
      <div className="container py-12 max-w-2xl">
        <Alert variant="destructive">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription className="mt-2">
            You do not have permission to access this page.
          </AlertDescription>
          <div className="mt-4">
            <Link to="/">
              <Button variant="outline">Go to Home</Button>
            </Link>
          </div>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}


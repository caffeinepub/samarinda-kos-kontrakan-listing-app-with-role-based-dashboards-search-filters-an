import { Link } from '@tanstack/react-router';
import { Building2 } from 'lucide-react';
import LoginButton from '../auth/LoginButton';
import ProfileSetupModal from '../auth/ProfileSetupModal';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { isAuthenticated, role } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Building2 className="h-6 w-6" />
            <span>Samarinda Kos</span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost">Browse</Button>
            </Link>
            
            {isAuthenticated && role && (
              <>
                {role === 'user' && (
                  <Link to="/owner">
                    <Button variant="ghost">My Dashboard</Button>
                  </Link>
                )}
                {role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="ghost">Admin Dashboard</Button>
                  </Link>
                )}
              </>
            )}
            
            <LoginButton />
          </nav>
        </div>
      </header>
      <ProfileSetupModal />
    </>
  );
}


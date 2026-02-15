import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSaveCallerUserProfile } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const { isAuthenticated, profile, profileLoading, isFetched } = useAuth();
  const saveProfile = useSaveCallerUserProfile();
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Owner' | 'Admin'>('Owner');
  const [saving, setSaving] = useState(false);

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && profile === null;

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    setSaving(true);
    try {
      await saveProfile({ name: name.trim(), role });
      toast.success('Profile created successfully!');
    } catch (error) {
      console.error('Profile save error:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={showProfileSetup}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome! Set up your profile</DialogTitle>
          <DialogDescription>
            Please provide your name and select your role to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as 'Owner' | 'Admin')} disabled={saving}>
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Owner">Property Owner</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


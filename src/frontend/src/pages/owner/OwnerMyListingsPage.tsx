import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetListingsByOwner } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import { formatRupiah } from '@/utils/format';

export default function OwnerMyListingsPage() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  const { data: listings = [], isLoading } = useGetListingsByOwner(principal!);

  if (!principal) {
    return <p className="text-muted-foreground">Please log in to view your listings.</p>;
  }

  if (isLoading) {
    return <p className="text-muted-foreground">Loading your listings...</p>;
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">You haven't created any listings yet.</p>
        <Link to="/owner/create">
          <Button>Create Your First Listing</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Listings</h2>
        <Link to="/owner/create">
          <Button>Create New Listing</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {listings.map((listing) => (
          <Card key={listing.id.toString()}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{listing.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{listing.location}</p>
                </div>
                <Badge
                  variant={
                    listing.status.__kind__ === 'approved' ? 'default' :
                    listing.status.__kind__ === 'pending' ? 'secondary' :
                    'destructive'
                  }
                >
                  {listing.status.__kind__ === 'approved' ? 'Approved' :
                   listing.status.__kind__ === 'pending' ? 'Pending' :
                   'Rejected'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-xl font-bold text-primary">{formatRupiah(listing.priceRupiah)}</p>
                <div className="flex gap-2">
                  <Link to="/listings/$id" params={{ id: listing.id.toString() }}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link to="/owner/edit-request/$id" params={{ id: listing.id.toString() }}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Request Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


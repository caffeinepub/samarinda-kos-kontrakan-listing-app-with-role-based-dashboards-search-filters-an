import { Link } from '@tanstack/react-router';
import { useGetAllListings, useApproveListing } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle } from 'lucide-react';
import { formatRupiah } from '@/utils/format';
import { toast } from 'sonner';

export default function AdminAllListingsPage() {
  const { data: listings = [], isLoading } = useGetAllListings();
  const approveListing = useApproveListing();

  const handleApprove = async (listingId: bigint) => {
    try {
      await approveListing.mutateAsync(listingId);
      toast.success('Listing approved successfully!');
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Failed to approve listing');
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading listings...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">All Listings</h2>
        <Link to="/admin/create">
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
                  {listing.status.__kind__ === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleApprove(listing.id)}
                      disabled={approveListing.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


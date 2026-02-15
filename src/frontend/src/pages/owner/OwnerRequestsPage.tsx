import { useGetAllEditRequests, useGetAllDeleteRequests } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function OwnerRequestsPage() {
  const { identity } = useInternetIdentity();
  const { data: editRequests = [] } = useGetAllEditRequests();
  const { data: deleteRequests = [] } = useGetAllDeleteRequests();

  const myEditRequests = editRequests.filter(
    (req) => req.owner.toString() === identity?.getPrincipal().toString()
  );
  
  const myDeleteRequests = deleteRequests.filter(
    (req) => req.owner.toString() === identity?.getPrincipal().toString()
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Requests</h2>

      <div>
        <h3 className="text-lg font-semibold mb-4">Edit Requests</h3>
        {myEditRequests.length === 0 ? (
          <p className="text-muted-foreground">No edit requests</p>
        ) : (
          <div className="space-y-4">
            {myEditRequests.map((request, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{request.editedListing.title}</CardTitle>
                    <Badge
                      variant={
                        request.status.__kind__ === 'approved' ? 'default' :
                        request.status.__kind__ === 'pending' ? 'secondary' :
                        'destructive'
                      }
                    >
                      {request.status.__kind__ === 'approved' ? 'Approved' :
                       request.status.__kind__ === 'pending' ? 'Pending' :
                       'Rejected'}
                    </Badge>
                  </div>
                </CardHeader>
                {request.status.__kind__ === 'rejected' && request.rejectionReason && (
                  <CardContent>
                    <p className="text-sm text-destructive">
                      <strong>Rejection Reason:</strong> {request.rejectionReason}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Delete Requests</h3>
        {myDeleteRequests.length === 0 ? (
          <p className="text-muted-foreground">No delete requests</p>
        ) : (
          <div className="space-y-4">
            {myDeleteRequests.map((request, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">Listing ID: {request.listingId.toString()}</CardTitle>
                    <Badge
                      variant={
                        request.status.__kind__ === 'approved' ? 'default' :
                        request.status.__kind__ === 'pending' ? 'secondary' :
                        'destructive'
                      }
                    >
                      {request.status.__kind__ === 'approved' ? 'Approved' :
                       request.status.__kind__ === 'pending' ? 'Pending' :
                       'Rejected'}
                    </Badge>
                  </div>
                </CardHeader>
                {request.status.__kind__ === 'rejected' && request.rejectionReason && (
                  <CardContent>
                    <p className="text-sm text-destructive">
                      <strong>Rejection Reason:</strong> {request.rejectionReason}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


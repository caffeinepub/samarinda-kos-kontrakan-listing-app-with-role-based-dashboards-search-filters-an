import { useState } from 'react';
import { useGetAllEditRequests, useGetAllDeleteRequests, useProcessEditRequest, useProcessDeleteRequest, useGetListing } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EditRequestDiff from '@/components/moderation/EditRequestDiff';
import { toast } from 'sonner';

export default function AdminRequestsQueuePage() {
  const { data: editRequests = [] } = useGetAllEditRequests();
  const { data: deleteRequests = [] } = useGetAllDeleteRequests();
  const processEdit = useProcessEditRequest();
  const processDelete = useProcessDeleteRequest();

  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

  const pendingEditRequests = editRequests.filter((req) => req.status.__kind__ === 'pending');
  const pendingDeleteRequests = deleteRequests.filter((req) => req.status.__kind__ === 'pending');

  const handleApproveEdit = async (listingId: bigint) => {
    try {
      await processEdit.mutateAsync({ listingId, approved: true, rejectionReason: null });
      toast.success('Edit request approved!');
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Failed to approve edit request');
    }
  };

  const handleRejectEdit = async (listingId: bigint) => {
    const reason = rejectionReasons[listingId.toString()] || 'No reason provided';
    try {
      await processEdit.mutateAsync({ listingId, approved: false, rejectionReason: reason });
      toast.success('Edit request rejected');
      setRejectionReasons((prev) => {
        const newReasons = { ...prev };
        delete newReasons[listingId.toString()];
        return newReasons;
      });
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Failed to reject edit request');
    }
  };

  const handleApproveDelete = async (listingId: bigint) => {
    try {
      await processDelete.mutateAsync({ listingId, approved: true, rejectionReason: null });
      toast.success('Delete request approved!');
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Failed to approve delete request');
    }
  };

  const handleRejectDelete = async (listingId: bigint) => {
    const reason = rejectionReasons[listingId.toString()] || 'No reason provided';
    try {
      await processDelete.mutateAsync({ listingId, approved: false, rejectionReason: reason });
      toast.success('Delete request rejected');
      setRejectionReasons((prev) => {
        const newReasons = { ...prev };
        delete newReasons[listingId.toString()];
        return newReasons;
      });
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Failed to reject delete request');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Moderation Queue</h2>

      <Tabs defaultValue="edit">
        <TabsList>
          <TabsTrigger value="edit">
            Edit Requests ({pendingEditRequests.length})
          </TabsTrigger>
          <TabsTrigger value="delete">
            Delete Requests ({pendingDeleteRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-6">
          {pendingEditRequests.length === 0 ? (
            <p className="text-muted-foreground">No pending edit requests</p>
          ) : (
            pendingEditRequests.map((request) => (
              <EditRequestCard
                key={request.listingId.toString()}
                request={request}
                rejectionReason={rejectionReasons[request.listingId.toString()] || ''}
                onReasonChange={(reason) =>
                  setRejectionReasons((prev) => ({ ...prev, [request.listingId.toString()]: reason }))
                }
                onApprove={() => handleApproveEdit(request.listingId)}
                onReject={() => handleRejectEdit(request.listingId)}
                isProcessing={processEdit.isPending}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="delete" className="space-y-6">
          {pendingDeleteRequests.length === 0 ? (
            <p className="text-muted-foreground">No pending delete requests</p>
          ) : (
            pendingDeleteRequests.map((request) => (
              <Card key={request.listingId.toString()}>
                <CardHeader>
                  <CardTitle>Delete Request for Listing ID: {request.listingId.toString()}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`reason-${request.listingId}`}>Rejection Reason (if rejecting)</Label>
                    <Textarea
                      id={`reason-${request.listingId}`}
                      value={rejectionReasons[request.listingId.toString()] || ''}
                      onChange={(e) =>
                        setRejectionReasons((prev) => ({ ...prev, [request.listingId.toString()]: e.target.value }))
                      }
                      placeholder="Enter reason for rejection..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApproveDelete(request.listingId)}
                      disabled={processDelete.isPending}
                    >
                      Approve Delete
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleRejectDelete(request.listingId)}
                      disabled={processDelete.isPending}
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EditRequestCard({
  request,
  rejectionReason,
  onReasonChange,
  onApprove,
  onReject,
  isProcessing,
}: {
  request: any;
  rejectionReason: string;
  onReasonChange: (reason: string) => void;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}) {
  const { data: originalListing } = useGetListing(request.listingId.toString());

  if (!originalListing) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="space-y-4">
      <EditRequestDiff original={originalListing} edited={request.editedListing} />
      
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor={`reason-${request.listingId}`}>Rejection Reason (if rejecting)</Label>
            <Textarea
              id={`reason-${request.listingId}`}
              value={rejectionReason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Enter reason for rejection..."
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={onApprove} disabled={isProcessing}>
              Approve Changes
            </Button>
            <Button variant="destructive" onClick={onReject} disabled={isProcessing}>
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


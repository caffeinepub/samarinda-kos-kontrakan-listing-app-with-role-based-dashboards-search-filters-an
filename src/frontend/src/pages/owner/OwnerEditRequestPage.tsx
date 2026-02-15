import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import ListingForm, { ListingFormData } from '@/components/listings/ListingForm';
import PhotoManager from '@/components/photos/PhotoManager';
import { useGetListing, useSubmitEditRequest } from '@/hooks/useQueries';
import { ExternalBlob, PropertyType } from '@/backend';
import { toast } from 'sonner';

export default function OwnerEditRequestPage() {
  const { id } = useParams({ from: '/owner/edit-request/$id' });
  const navigate = useNavigate();
  const { data: listing, isLoading } = useGetListing(id);
  const submitEditRequest = useSubmitEditRequest();
  
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    priceRupiah: '',
    location: '',
    propertyType: PropertyType.kos,
    facilities: [],
    rentalDurations: [],
    description: '',
  });
  
  const [photos, setPhotos] = useState<ExternalBlob[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title,
        priceRupiah: listing.priceRupiah.toString(),
        location: listing.location,
        propertyType: listing.propertyType,
        facilities: listing.facilities,
        rentalDurations: listing.rentalDurations,
        description: listing.description,
      });
      setPhotos(listing.photos);
    }
  }, [listing]);

  const handleSubmit = async () => {
    if (!listing) return;

    if (!formData.title || !formData.priceRupiah || !formData.location || formData.rentalDurations.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const editedListing = {
        ...listing,
        title: formData.title,
        priceRupiah: BigInt(formData.priceRupiah),
        location: formData.location,
        propertyType: formData.propertyType,
        facilities: formData.facilities,
        rentalDurations: formData.rentalDurations,
        description: formData.description,
        photos,
      };

      await submitEditRequest.mutateAsync({
        listingId: listing.id,
        editedListing,
      });
      
      toast.success('Edit request submitted successfully!');
      navigate({ to: '/owner/requests' });
    } catch (error) {
      console.error('Submit edit request error:', error);
      toast.error('Failed to submit edit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (!listing) {
    return <p className="text-muted-foreground">Listing not found</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Request Edit for Listing</h2>
        <p className="text-muted-foreground">Make changes and submit for admin approval</p>
      </div>

      <ListingForm data={formData} onChange={setFormData} />
      
      <PhotoManager photos={photos} onPhotosChange={setPhotos} />

      <div className="flex gap-4">
        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Submitting...' : 'Submit Edit Request'}
        </Button>
        <Button variant="outline" onClick={() => navigate({ to: '/owner' })} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </div>
  );
}


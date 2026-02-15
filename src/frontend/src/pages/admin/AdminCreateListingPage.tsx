import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import ListingForm, { ListingFormData } from '@/components/listings/ListingForm';
import PhotoManager from '@/components/photos/PhotoManager';
import { useCreateListing } from '@/hooks/useQueries';
import { PropertyType, ExternalBlob } from '@/backend';
import { toast } from 'sonner';

export default function AdminCreateListingPage() {
  const navigate = useNavigate();
  const createListing = useCreateListing();
  
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

  const handleSubmit = async () => {
    if (!formData.title || !formData.priceRupiah || !formData.location || formData.rentalDurations.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createListing.mutateAsync({
        title: formData.title,
        priceRupiah: BigInt(formData.priceRupiah),
        location: formData.location,
        propertyType: formData.propertyType,
        facilities: formData.facilities,
        rentalDurations: formData.rentalDurations,
        description: formData.description,
        photos,
      });
      
      toast.success('Listing created successfully!');
      navigate({ to: '/admin' });
    } catch (error) {
      console.error('Create listing error:', error);
      toast.error('Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Create New Listing</h2>
        <p className="text-muted-foreground">Fill in the details for the property</p>
      </div>

      <ListingForm data={formData} onChange={setFormData} />
      
      <PhotoManager photos={photos} onPhotosChange={setPhotos} />

      <div className="flex gap-4">
        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Creating...' : 'Create Listing'}
        </Button>
        <Button variant="outline" onClick={() => navigate({ to: '/admin' })} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </div>
  );
}


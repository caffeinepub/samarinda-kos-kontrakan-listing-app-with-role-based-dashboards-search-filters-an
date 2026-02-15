import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, MapPin, Home, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PhotoGallery from '@/components/listings/PhotoGallery';
import { useGetListing } from '@/hooks/useQueries';
import { formatRupiah } from '@/utils/format';

export default function ListingDetailPage() {
  const { id } = useParams({ from: '/listings/$id' });
  const { data: listing, isLoading } = useGetListing(id);

  if (isLoading) {
    return (
      <div className="container py-12">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container py-12">
        <p className="text-center text-muted-foreground">Listing not found</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Link to="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Listings
        </Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <PhotoGallery photos={listing.photos} />

          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.location}</span>
                </div>
              </div>
              <Badge variant={listing.propertyType === 'kos' ? 'default' : 'secondary'} className="text-base px-4 py-1">
                {listing.propertyType === 'kos' ? 'Kos' : 'Kontrakan'}
              </Badge>
            </div>

            <Separator className="my-6" />

            <div>
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{listing.description || 'No description provided.'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{formatRupiah(listing.priceRupiah)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rental Duration Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {listing.rentalDurations.map((duration) => (
                  <Badge key={duration} variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {duration === 'daily' ? 'Daily' : duration === 'monthly' ? 'Monthly' : 'Yearly'}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Facilities</CardTitle>
            </CardHeader>
            <CardContent>
              {listing.facilities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {listing.facilities.map((facility) => (
                    <Badge key={facility} variant="secondary">
                      {facility === 'wifi' ? 'WiFi' :
                       facility === 'parking' ? 'Parking' :
                       facility === 'airConditioning' ? 'Air Conditioning' :
                       facility === 'furniture' ? 'Furniture' :
                       facility === 'laundry' ? 'Laundry' :
                       'Shared Bathroom'}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No facilities listed</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


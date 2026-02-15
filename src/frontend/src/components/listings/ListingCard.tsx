import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home } from 'lucide-react';
import { formatRupiah } from '@/utils/format';
import type { Listing } from '@/backend';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const thumbnailUrl = listing.photos.length > 0 ? listing.photos[0].getDirectURL() : null;

  return (
    <Link to="/listings/$id" params={{ id: listing.id.toString() }}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="aspect-video bg-muted relative overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant={listing.propertyType === 'kos' ? 'default' : 'secondary'}>
              {listing.propertyType === 'kos' ? 'Kos' : 'Kontrakan'}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1 mb-2">{listing.title}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>
          <p className="text-xl font-bold text-primary">{formatRupiah(listing.priceRupiah)}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex gap-1 flex-wrap">
          {listing.rentalDurations.slice(0, 3).map((duration) => (
            <Badge key={duration} variant="outline" className="text-xs">
              {duration === 'daily' ? 'Daily' : duration === 'monthly' ? 'Monthly' : 'Yearly'}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}


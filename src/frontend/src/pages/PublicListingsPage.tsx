import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ListingCard from '@/components/listings/ListingCard';
import FiltersPanel, { FilterState } from '@/components/listings/FiltersPanel';
import { useGetAllListings } from '@/hooks/useQueries';
import type { Listing } from '@/backend';

// Fixed location list in the specified order
const FIXED_LOCATIONS = [
  'Samarinda Kota',
  'Samarinda Ulu',
  'Samarinda Ilir',
  'Samarinda Seberang',
  'Samarinda Utara',
  'Sungai Pinang',
  'Sungai Kunjang',
  'Palaran',
  'Sambutan',
  'Loa Janan Ilir',
];

export default function PublicListingsPage() {
  const { data: listings = [], isLoading } = useGetAllListings();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [filters, setFilters] = useState<FilterState>({
    minPrice: '',
    maxPrice: '',
    selectedLocations: [],
    propertyType: 'all',
    facilities: [],
    rentalDurations: [],
  });

  const filteredListings = useMemo(() => {
    let result = listings.filter((listing) => {
      // Only show approved listings
      if (listing.status.__kind__ !== 'approved') return false;

      // Search
      if (searchTerm && !listing.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Price range
      if (filters.minPrice && Number(listing.priceRupiah) < parseInt(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && Number(listing.priceRupiah) > parseInt(filters.maxPrice)) {
        return false;
      }

      // Location - multi-select: if any specific locations are selected, match any of them
      if (filters.selectedLocations.length > 0) {
        if (!filters.selectedLocations.includes(listing.location)) {
          return false;
        }
      }

      // Property type
      if (filters.propertyType !== 'all' && listing.propertyType !== filters.propertyType) {
        return false;
      }

      // Facilities
      if (filters.facilities.length > 0) {
        const hasAllFacilities = filters.facilities.every((f) => listing.facilities.includes(f));
        if (!hasAllFacilities) return false;
      }

      // Rental durations
      if (filters.rentalDurations.length > 0) {
        const hasAnyDuration = filters.rentalDurations.some((d) => listing.rentalDurations.includes(d));
        if (!hasAnyDuration) return false;
      }

      return true;
    });

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => Number(b.createdAt - a.createdAt));
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => Number(a.priceRupiah - b.priceRupiah));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => Number(b.priceRupiah - a.priceRupiah));
    }

    return result;
  }, [listings, searchTerm, filters, sortBy]);

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Your Perfect Kos or Kontrakan</h1>
        <p className="text-muted-foreground">Discover comfortable living spaces in Samarinda, East Kalimantan</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FiltersPanel filters={filters} onFiltersChange={setFilters} locations={FIXED_LOCATIONS} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-6">
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-20">
            <h2 className="font-semibold text-lg mb-4">Filters</h2>
            <FiltersPanel filters={filters} onFiltersChange={setFilters} locations={FIXED_LOCATIONS} />
          </div>
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading listings...</p>
            </div>
          ) : paginatedListings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No listings found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {paginatedListings.length} of {filteredListings.length} listings
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedListings.map((listing) => (
                  <ListingCard key={listing.id.toString()} listing={listing} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(page)}
                        size="sm"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

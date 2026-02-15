import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Facility, PropertyType, RentalDuration } from '@/backend';

export interface FilterState {
  minPrice: string;
  maxPrice: string;
  selectedLocations: string[];
  propertyType: PropertyType | 'all';
  facilities: Facility[];
  rentalDurations: RentalDuration[];
}

interface FiltersPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  locations: string[];
}

export default function FiltersPanel({ filters, onFiltersChange, locations }: FiltersPanelProps) {
  const handleFacilityToggle = (facility: Facility) => {
    const newFacilities = filters.facilities.includes(facility)
      ? filters.facilities.filter((f) => f !== facility)
      : [...filters.facilities, facility];
    onFiltersChange({ ...filters, facilities: newFacilities });
  };

  const handleDurationToggle = (duration: RentalDuration) => {
    const newDurations = filters.rentalDurations.includes(duration)
      ? filters.rentalDurations.filter((d) => d !== duration)
      : [...filters.rentalDurations, duration];
    onFiltersChange({ ...filters, rentalDurations: newDurations });
  };

  const handleLocationToggle = (location: string) => {
    const newLocations = filters.selectedLocations.includes(location)
      ? filters.selectedLocations.filter((l) => l !== location)
      : [...filters.selectedLocations, location];
    onFiltersChange({ ...filters, selectedLocations: newLocations });
  };

  const handleAllLocationsToggle = () => {
    // If "All locations" is checked (no specific locations selected), do nothing
    // If any specific locations are selected, clear them all
    if (filters.selectedLocations.length > 0) {
      onFiltersChange({ ...filters, selectedLocations: [] });
    }
  };

  const isAllLocationsSelected = filters.selectedLocations.length === 0;

  const handleReset = () => {
    onFiltersChange({
      minPrice: '',
      maxPrice: '',
      selectedLocations: [],
      propertyType: 'all',
      facilities: [],
      rentalDurations: [],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-2">
          <div>
            <Label htmlFor="minPrice" className="text-sm">Min Price (Rp)</Label>
            <Input
              id="minPrice"
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="maxPrice" className="text-sm">Max Price (Rp)</Label>
            <Input
              id="maxPrice"
              type="number"
              placeholder="10000000"
              value={filters.maxPrice}
              onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value })}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Location</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="location-all"
              checked={isAllLocationsSelected}
              onCheckedChange={handleAllLocationsToggle}
            />
            <Label htmlFor="location-all" className="text-sm font-normal cursor-pointer">
              All locations
            </Label>
          </div>
          {locations.map((location) => (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox
                id={`location-${location}`}
                checked={filters.selectedLocations.includes(location)}
                onCheckedChange={() => handleLocationToggle(location)}
              />
              <Label htmlFor={`location-${location}`} className="text-sm font-normal cursor-pointer">
                {location}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label htmlFor="propertyType" className="font-semibold mb-3 block">Property Type</Label>
        <Select value={filters.propertyType} onValueChange={(v) => onFiltersChange({ ...filters, propertyType: v as PropertyType | 'all' })}>
          <SelectTrigger id="propertyType">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="kos">Kos</SelectItem>
            <SelectItem value="kontrakan">Kontrakan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="facilities">
          <AccordionTrigger className="font-semibold">Facilities</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {Object.values(Facility).map((facility) => (
                <div key={facility} className="flex items-center space-x-2">
                  <Checkbox
                    id={`facility-${facility}`}
                    checked={filters.facilities.includes(facility)}
                    onCheckedChange={() => handleFacilityToggle(facility)}
                  />
                  <Label htmlFor={`facility-${facility}`} className="text-sm font-normal cursor-pointer">
                    {facility === 'wifi' ? 'WiFi' :
                     facility === 'parking' ? 'Parking' :
                     facility === 'airConditioning' ? 'Air Conditioning' :
                     facility === 'furniture' ? 'Furniture' :
                     facility === 'laundry' ? 'Laundry' :
                     'Shared Bathroom'}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="durations">
          <AccordionTrigger className="font-semibold">Rental Duration</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {Object.values(RentalDuration).map((duration) => (
                <div key={duration} className="flex items-center space-x-2">
                  <Checkbox
                    id={`duration-${duration}`}
                    checked={filters.rentalDurations.includes(duration)}
                    onCheckedChange={() => handleDurationToggle(duration)}
                  />
                  <Label htmlFor={`duration-${duration}`} className="text-sm font-normal cursor-pointer">
                    {duration === 'daily' ? 'Daily' : duration === 'monthly' ? 'Monthly' : 'Yearly'}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button variant="outline" onClick={handleReset} className="w-full">
        Reset Filters
      </Button>
    </div>
  );
}

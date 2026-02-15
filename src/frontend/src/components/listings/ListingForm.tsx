import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Facility, PropertyType, RentalDuration } from '@/backend';
import { parseRupiah } from '@/utils/format';

export interface ListingFormData {
  title: string;
  priceRupiah: string;
  location: string;
  propertyType: PropertyType;
  facilities: Facility[];
  rentalDurations: RentalDuration[];
  description: string;
}

interface ListingFormProps {
  data: ListingFormData;
  onChange: (data: ListingFormData) => void;
}

export default function ListingForm({ data, onChange }: ListingFormProps) {
  const handleFacilityToggle = (facility: Facility) => {
    const newFacilities = data.facilities.includes(facility)
      ? data.facilities.filter((f) => f !== facility)
      : [...data.facilities, facility];
    onChange({ ...data, facilities: newFacilities });
  };

  const handleDurationToggle = (duration: RentalDuration) => {
    const newDurations = data.rentalDurations.includes(duration)
      ? data.rentalDurations.filter((d) => d !== duration)
      : [...data.rentalDurations, duration];
    onChange({ ...data, rentalDurations: newDurations });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => onChange({ ...data, title: e.target.value })}
              placeholder="e.g., Cozy Kos near University"
            />
          </div>

          <div>
            <Label htmlFor="price">Price (Rp) *</Label>
            <Input
              id="price"
              type="number"
              value={data.priceRupiah}
              onChange={(e) => onChange({ ...data, priceRupiah: e.target.value })}
              placeholder="1000000"
            />
          </div>

          <div>
            <Label htmlFor="location">Location in Samarinda *</Label>
            <Input
              id="location"
              value={data.location}
              onChange={(e) => onChange({ ...data, location: e.target.value })}
              placeholder="e.g., Jl. Pramuka, Samarinda"
            />
          </div>

          <div>
            <Label htmlFor="propertyType">Property Type *</Label>
            <Select value={data.propertyType} onValueChange={(v) => onChange({ ...data, propertyType: v as PropertyType })}>
              <SelectTrigger id="propertyType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kos">Kos</SelectItem>
                <SelectItem value="kontrakan">Kontrakan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Facilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.values(Facility).map((facility) => (
              <div key={facility} className="flex items-center space-x-2">
                <Checkbox
                  id={`form-facility-${facility}`}
                  checked={data.facilities.includes(facility)}
                  onCheckedChange={() => handleFacilityToggle(facility)}
                />
                <Label htmlFor={`form-facility-${facility}`} className="font-normal cursor-pointer">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rental Duration Options *</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {Object.values(RentalDuration).map((duration) => (
              <div key={duration} className="flex items-center space-x-2">
                <Checkbox
                  id={`form-duration-${duration}`}
                  checked={data.rentalDurations.includes(duration)}
                  onCheckedChange={() => handleDurationToggle(duration)}
                />
                <Label htmlFor={`form-duration-${duration}`} className="font-normal cursor-pointer">
                  {duration === 'daily' ? 'Daily' : duration === 'monthly' ? 'Monthly' : 'Yearly'}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            placeholder="Describe your property..."
            rows={6}
          />
        </CardContent>
      </Card>
    </div>
  );
}


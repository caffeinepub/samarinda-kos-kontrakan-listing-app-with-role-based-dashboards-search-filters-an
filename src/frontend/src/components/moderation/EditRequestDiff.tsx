import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/utils/format';
import type { Listing } from '@/backend';

interface EditRequestDiffProps {
  original: Listing;
  edited: Listing;
}

export default function EditRequestDiff({ original, edited }: EditRequestDiffProps) {
  const hasChanged = (field: keyof Listing) => {
    if (field === 'facilities' || field === 'rentalDurations') {
      return JSON.stringify(original[field]) !== JSON.stringify(edited[field]);
    }
    return original[field] !== edited[field];
  };

  const DiffField = ({ label, originalValue, editedValue, changed }: { label: string; originalValue: string; editedValue: string; changed: boolean }) => (
    <div className="space-y-1">
      <p className="text-sm font-medium">{label}</p>
      <div className="grid md:grid-cols-2 gap-2">
        <div className={`p-2 rounded border ${changed ? 'bg-destructive/10 border-destructive/30' : 'bg-muted'}`}>
          <p className="text-xs text-muted-foreground mb-1">Original</p>
          <p className="text-sm">{originalValue}</p>
        </div>
        <div className={`p-2 rounded border ${changed ? 'bg-primary/10 border-primary/30' : 'bg-muted'}`}>
          <p className="text-xs text-muted-foreground mb-1">Edited</p>
          <p className="text-sm">{editedValue}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Changes Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DiffField
          label="Title"
          originalValue={original.title}
          editedValue={edited.title}
          changed={hasChanged('title')}
        />
        
        <DiffField
          label="Price"
          originalValue={formatRupiah(original.priceRupiah)}
          editedValue={formatRupiah(edited.priceRupiah)}
          changed={hasChanged('priceRupiah')}
        />
        
        <DiffField
          label="Location"
          originalValue={original.location}
          editedValue={edited.location}
          changed={hasChanged('location')}
        />
        
        <DiffField
          label="Property Type"
          originalValue={original.propertyType === 'kos' ? 'Kos' : 'Kontrakan'}
          editedValue={edited.propertyType === 'kos' ? 'Kos' : 'Kontrakan'}
          changed={hasChanged('propertyType')}
        />
        
        <div className="space-y-1">
          <p className="text-sm font-medium">Facilities</p>
          <div className="grid md:grid-cols-2 gap-2">
            <div className={`p-2 rounded border ${hasChanged('facilities') ? 'bg-destructive/10 border-destructive/30' : 'bg-muted'}`}>
              <p className="text-xs text-muted-foreground mb-2">Original</p>
              <div className="flex flex-wrap gap-1">
                {original.facilities.map((f) => (
                  <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                ))}
              </div>
            </div>
            <div className={`p-2 rounded border ${hasChanged('facilities') ? 'bg-primary/10 border-primary/30' : 'bg-muted'}`}>
              <p className="text-xs text-muted-foreground mb-2">Edited</p>
              <div className="flex flex-wrap gap-1">
                {edited.facilities.map((f) => (
                  <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium">Rental Durations</p>
          <div className="grid md:grid-cols-2 gap-2">
            <div className={`p-2 rounded border ${hasChanged('rentalDurations') ? 'bg-destructive/10 border-destructive/30' : 'bg-muted'}`}>
              <p className="text-xs text-muted-foreground mb-2">Original</p>
              <div className="flex flex-wrap gap-1">
                {original.rentalDurations.map((d) => (
                  <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
                ))}
              </div>
            </div>
            <div className={`p-2 rounded border ${hasChanged('rentalDurations') ? 'bg-primary/10 border-primary/30' : 'bg-muted'}`}>
              <p className="text-xs text-muted-foreground mb-2">Edited</p>
              <div className="flex flex-wrap gap-1">
                {edited.rentalDurations.map((d) => (
                  <Badge key={d} variant="outline" className="text-xs">{d}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <DiffField
          label="Description"
          originalValue={original.description}
          editedValue={edited.description}
          changed={hasChanged('description')}
        />
        
        <div className="space-y-1">
          <p className="text-sm font-medium">Photos</p>
          <div className="grid md:grid-cols-2 gap-2">
            <div className={`p-2 rounded border ${hasChanged('photos') ? 'bg-destructive/10 border-destructive/30' : 'bg-muted'}`}>
              <p className="text-xs text-muted-foreground mb-1">Original</p>
              <p className="text-sm">{original.photos.length} photo(s)</p>
            </div>
            <div className={`p-2 rounded border ${hasChanged('photos') ? 'bg-primary/10 border-primary/30' : 'bg-muted'}`}>
              <p className="text-xs text-muted-foreground mb-1">Edited</p>
              <p className="text-sm">{edited.photos.length} photo(s)</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


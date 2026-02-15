import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import type { ExternalBlob } from '@/backend';

interface PhotoGalleryProps {
  photos: ExternalBlob[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (photos.length === 0) {
    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
        <Home className="h-16 w-16 text-muted-foreground" />
      </div>
    );
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="space-y-4">
        <div
          className="w-full aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <img
            src={photos[selectedIndex].getDirectURL()}
            alt={`Photo ${selectedIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
        
        {photos.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`aspect-video rounded overflow-hidden border-2 transition-colors ${
                  index === selectedIndex ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img
                  src={photo.getDirectURL()}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative">
            <img
              src={photos[selectedIndex].getDirectURL()}
              alt={`Photo ${selectedIndex + 1}`}
              className="w-full h-auto"
            />
            {photos.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={handleNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


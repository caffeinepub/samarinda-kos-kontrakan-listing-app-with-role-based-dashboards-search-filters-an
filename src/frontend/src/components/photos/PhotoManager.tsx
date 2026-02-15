import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, Upload } from 'lucide-react';
import { validateImage } from '@/utils/imageValidation';
import { ExternalBlob } from '@/backend';
import { toast } from 'sonner';

interface PhotoManagerProps {
  photos: ExternalBlob[];
  onPhotosChange: (photos: ExternalBlob[]) => void;
  maxPhotos?: number;
}

export default function PhotoManager({ photos, onPhotosChange, maxPhotos = 10 }: PhotoManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (photos.length + files.length > maxPhotos) {
      toast.error(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    for (const file of files) {
      const error = validateImage(file);
      if (error) {
        toast.error(error);
        continue;
      }

      try {
        setUploading(true);
        setUploadProgress(0);

        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });

        onPhotosChange([...photos, blob]);
        toast.success('Photo added successfully');
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to add photo');
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    }

    e.target.value = '';
  };

  const handleRemove = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photos ({photos.length}/{maxPhotos})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden border">
                <img
                  src={photo.getDirectURL()}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
            <Progress value={uploadProgress} />
          </div>
        )}

        {photos.length < maxPhotos && (
          <div>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload">
              <Button variant="outline" className="w-full" disabled={uploading} asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Add Photos
                </span>
              </Button>
            </label>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


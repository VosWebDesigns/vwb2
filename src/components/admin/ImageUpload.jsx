
import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import SmartImage from '@/components/SmartImage';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ImageUpload = ({ value, onChange, className }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Selecteer een afbeelding om te uploaden.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('fotos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from('fotos').getPublicUrl(filePath);
      
      onChange(data.publicUrl);
      toast({ title: "Succes", description: "Afbeelding geüpload" });
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Upload mislukt", 
        description: error.message 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {value ? (
        <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-gray-700 bg-black">
          <SmartImage
            src={value}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-[#111827] hover:bg-[#252525] transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <Loader2 className="animate-spin text-gray-400 mb-2" size={24} />
              ) : (
                <Upload className="text-gray-400 mb-2" size={24} />
              )}
              <p className="text-sm text-gray-400">
                {uploading ? 'Uploaden...' : 'Klik om te uploaden'}
              </p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Star, Trash2, Upload } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const BUCKET_NAME = 'portfolio-media';

const logSupabaseError = (label, error, context = {}) => {
  if (!error) return;
  console.error(label, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
    ...context,
  });
};

const ProjectGalleryManager = ({ projectId, onCoverChange }) => {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const fetchImages = async () => {
    if (!projectId) {
      setImages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('portfolio_images')
      .select('*')
      .eq('portfolio_id', projectId)
      .order('is_cover', { ascending: false })
      .order('sort_order', { ascending: true });

    if (error) {
      logSupabaseError('PORTFOLIO_IMAGES_FETCH_ERROR', error, { projectId });
      toast({ variant: 'destructive', title: 'Fout', description: error.message });
      setImages([]);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, [projectId]);

  const uploadFiles = async (files) => {
    if (!projectId || files.length === 0) return;
    setBusy(true);

    try {
      const currentMax = images.reduce((max, item) => Math.max(max, item.sort_order || 0), -1);
      const records = [];

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
        const path = `portfolio/${projectId}/${crypto.randomUUID()}.${ext}`;
        const contentType = file.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(path, file, { cacheControl: '3600', upsert: false, contentType });

        if (uploadError) {
          logSupabaseError('UPLOAD_ERROR', uploadError, { path, contentType, fileName: file.name, size: file.size });
          throw uploadError;
        }

        const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

        records.push({
          portfolio_id: projectId,
          path,
          url: publicData.publicUrl,
          alt: file.name.replace(/\.[^.]+$/, ''),
          sort_order: currentMax + index + 1,
          is_cover: images.length === 0 && index === 0,
        });
      }

      const { error: insertError } = await supabase
        .from('portfolio_images')
        .insert(records)
        .select('*');
      if (insertError) {
        logSupabaseError('PORTFOLIO_IMAGES_ERROR', insertError, { projectId });
        throw insertError;
      }

      toast({ title: 'Succes', description: `${records.length} afbeelding(en) geüpload` });
      await fetchImages();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Upload mislukt', description: error.message });
    } finally {
      setBusy(false);
    }
  };

  const setCover = async (image) => {
    setBusy(true);
    try {
      const { error: unsetError } = await supabase
        .from('portfolio_images')
        .update({ is_cover: false })
        .eq('portfolio_id', image.portfolio_id);

      if (unsetError) {
        logSupabaseError('PORTFOLIO_IMAGES_ERROR', unsetError, { projectId });
        throw unsetError;
      }

      const { error: setError } = await supabase
        .from('portfolio_images')
        .update({ is_cover: true })
        .eq('id', image.id);

      if (setError) {
        logSupabaseError('PORTFOLIO_IMAGES_ERROR', setError, { projectId });
        throw setError;
      }

      const { error: heroError } = await supabase
        .from('projects')
        .update({ hero_image: image.url })
        .eq('id', image.portfolio_id);

      if (heroError) {
        logSupabaseError('PROJECTS_ERROR', heroError, { projectId });
        throw heroError;
      }

      onCoverChange?.(image.url);
      toast({ title: 'Cover bijgewerkt' });
      await fetchImages();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Fout', description: error.message });
    } finally {
      setBusy(false);
    }
  };

  const deleteImage = async (image) => {
    setBusy(true);
    try {
      if (image.path) {
        const { error: storageError } = await supabase.storage.from(BUCKET_NAME).remove([image.path]);
        if (storageError) {
          logSupabaseError('PORTFOLIO_IMAGE_STORAGE_REMOVE_WARNING', storageError, { path: image.path });
          toast({ title: 'Storage waarschuwing', description: 'Bestand niet gevonden of al verwijderd; database wordt opgeschoond.' });
        }
      }

      const { error } = await supabase.from('portfolio_images').delete().eq('id', image.id);
      if (error) {
        logSupabaseError('PORTFOLIO_IMAGES_ERROR', error, { projectId });
        throw error;
      }

      toast({ title: 'Afbeelding verwijderd' });
      await fetchImages();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Fout', description: error.message });
    } finally {
      setBusy(false);
    }
  };

  const reorderImages = async (ordered) => {
    if (!ordered.length) return;
    setBusy(true);
    try {
      const updates = ordered.map((item, index) => ({
        id: item.id,
        portfolio_id: projectId,
        url: item.url,
        path: item.path || null,
        alt: item.alt || null,
        sort_order: index,
        is_cover: Boolean(item.is_cover),
      }));

      const { error } = await supabase
        .from('portfolio_images')
        .upsert(updates, { onConflict: 'id' })
        .select('*');

      if (error) {
        logSupabaseError('PORTFOLIO_IMAGES_ERROR', error, { projectId });
        throw error;
      }
      setImages(ordered);
      toast({ title: 'Volgorde opgeslagen' });
      await fetchImages();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Fout', description: error.message });
    } finally {
      setBusy(false);
    }
  };

  const moveImage = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;

    const cloned = [...images];
    const [moved] = cloned.splice(index, 1);
    cloned.splice(newIndex, 0, moved);
    await reorderImages(cloned);
  };

  const onInputChange = async (event) => {
    const fileList = Array.from(event.target.files || []);
    await uploadFiles(fileList);
    event.target.value = '';
  };

  const onDrop = async (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files || []);
    await uploadFiles(droppedFiles);
  };

  return (
    <section className="space-y-4 rounded-xl border border-gray-800 bg-[#0b1220] p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Afbeeldingen</h3>
        {busy && <Loader2 size={18} className="animate-spin text-[#38bdf8]" />}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={onInputChange} />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(event) => event.preventDefault()}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-700 px-4 py-5 text-sm text-gray-300 hover:border-[#38bdf8]"
      >
        <Upload size={16} />
        Upload meerdere afbeeldingen (of sleep ze hierheen)
      </button>

      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#38bdf8]" /></div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-gray-500">
          <ImagePlus size={20} />
          Nog geen gallery afbeeldingen toegevoegd.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {images.map((image, index) => (
            <article key={image.id} className="rounded-lg border border-gray-800 bg-[#111827] p-2">
              <div className="relative overflow-hidden rounded-md">
                <img src={image.url} alt={image.alt || 'Portfolio afbeelding'} className="h-28 w-full object-cover" />
                {image.is_cover && (
                  <span className="absolute left-2 top-2 rounded bg-[#38bdf8] px-2 py-1 text-[11px] font-semibold text-black">
                    Cover
                  </span>
                )}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setCover(image)} disabled={image.is_cover || busy}>
                  <Star size={14} className="mr-1" /> Maak cover
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => deleteImage(image)} disabled={busy}>
                  <Trash2 size={14} className="mr-1 text-red-400" /> Verwijder
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => moveImage(index, -1)} disabled={index === 0 || busy}>
                  <ArrowUp size={14} className="mr-1" /> Omhoog
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1 || busy}>
                  <ArrowDown size={14} className="mr-1" /> Omlaag
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectGalleryManager;

import React, { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Link, Loader2, RefreshCw, Upload, X } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const IMAGE_EXTENSIONS = ['avif', 'gif', 'jpeg', 'jpg', 'png', 'webp'];
const DEFAULT_PREFIX_BY_BUCKET = {
  'newsletter-media': 'newsletter',
  'portfolio-media': 'portfolio',
};

const isHttpUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const fileNameToAlt = (fileName = '') => fileName
  .replace(/\.[^.]+$/, '')
  .replace(/[-_]+/g, ' ')
  .trim();

const getExtension = (fileName = '', fallbackType = '') => {
  const fromName = fileName.split('.').pop()?.toLowerCase();
  if (fromName && IMAGE_EXTENSIONS.includes(fromName)) return fromName;
  const fromType = fallbackType.split('/').pop()?.toLowerCase();
  if (fromType === 'jpeg') return 'jpg';
  return IMAGE_EXTENSIONS.includes(fromType) ? fromType : 'png';
};

const isImageObject = (item) => {
  const name = item?.name || '';
  const extension = name.split('.').pop()?.toLowerCase();
  return IMAGE_EXTENSIONS.includes(extension) || item?.metadata?.mimetype?.startsWith?.('image/');
};

const joinPath = (...parts) => parts.filter(Boolean).join('/').replace(/\/+/g, '/');

const ImagePickerModal = ({
  isOpen,
  onClose,
  onSelect,
  bucketOptions = ['newsletter-media', 'portfolio-media'],
  defaultBucket = 'newsletter-media',
  campaignId,
}) => {
  const { toast } = useToast();
  const buckets = useMemo(() => bucketOptions?.length ? bucketOptions : ['newsletter-media'], [bucketOptions]);
  const [activeTab, setActiveTab] = useState('upload');
  const [bucket, setBucket] = useState(defaultBucket);
  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [manualAlt, setManualAlt] = useState('');

  const selectedBucket = buckets.includes(bucket) ? bucket : buckets[0];

  const selectImage = ({ url, alt = '' }) => {
    onSelect?.({ url, alt });
    onClose?.();
  };

  const loadGallery = async () => {
    if (!isOpen || !selectedBucket) return;
    setGalleryLoading(true);
    try {
      const rootPrefix = DEFAULT_PREFIX_BY_BUCKET[selectedBucket] || '';
      const found = [];

      const listPrefix = async (prefix = '', depth = 0) => {
        const { data, error } = await supabase.storage
          .from(selectedBucket)
          .list(prefix, { limit: 50, sortBy: { column: 'created_at', order: 'desc' } });
        if (error) throw error;

        for (const item of data || []) {
          const path = joinPath(prefix, item.name);
          if (!item.id && depth < 3) {
            await listPrefix(path, depth + 1);
          } else if (isImageObject(item)) {
            const { data: publicData } = supabase.storage.from(selectedBucket).getPublicUrl(path);
            found.push({
              bucket: selectedBucket,
              path,
              url: publicData.publicUrl,
              alt: fileNameToAlt(item.name),
              created_at: item.created_at || item.updated_at || '',
            });
          }
        }
      };

      await listPrefix(rootPrefix);
      found.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
      setGallery(found.slice(0, 50));
    } catch (error) {
      toast({ variant: 'destructive', title: 'Galerij laden mislukt', description: error.message });
      setGallery([]);
    } finally {
      setGalleryLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setBucket(defaultBucket);
      setManualUrl('');
      setManualAlt('');
    }
  }, [isOpen, defaultBucket]);

  useEffect(() => {
    if (isOpen && activeTab === 'gallery') loadGallery();
  }, [isOpen, activeTab, selectedBucket]);

  const uploadFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      toast({ variant: 'destructive', title: 'Upload geweigerd', description: 'Kies een afbeeldingsbestand.' });
      return;
    }

    setUploading(true);
    try {
      const ext = getExtension(file.name, file.type);
      const owner = campaignId || 'draft';
      const rootPrefix = DEFAULT_PREFIX_BY_BUCKET[selectedBucket] || 'newsletter';
      const path = `${rootPrefix}/${owner}/${crypto.randomUUID()}.${ext}`;
      const contentType = file.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`;
      const { error } = await supabase.storage
        .from(selectedBucket)
        .upload(path, file, { cacheControl: '3600', contentType, upsert: false });
      if (error) throw error;

      const { data } = supabase.storage.from(selectedBucket).getPublicUrl(path);
      toast({ title: 'Afbeelding geüpload', description: 'De public URL is geselecteerd.' });
      selectImage({ url: data.publicUrl, alt: fileNameToAlt(file.name) });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Upload mislukt', description: error.message });
    } finally {
      setUploading(false);
    }
  };

  const selectManualUrl = () => {
    const url = manualUrl.trim();
    if (!isHttpUrl(url)) {
      toast({ variant: 'destructive', title: 'Ongeldige URL', description: 'Gebruik een absolute http(s)-URL.' });
      return;
    }
    selectImage({ url, alt: manualAlt.trim() });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#07111f] shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#8cd6ff]">Afbeelding kiezen</p>
            <h2 className="text-xl font-black text-white">Upload, galerij of URL</h2>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} className="text-slate-300 hover:text-white"><X size={18} /></Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-5">
          <TabsList className="grid h-auto w-full grid-cols-3 bg-black/30 text-slate-300">
            <TabsTrigger value="upload" className="gap-2 data-[state=active]:bg-[#8cd6ff] data-[state=active]:text-black"><Upload size={15} /> Upload</TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2 data-[state=active]:bg-[#8cd6ff] data-[state=active]:text-black"><ImagePlus size={15} /> Galerij</TabsTrigger>
            <TabsTrigger value="url" className="gap-2 data-[state=active]:bg-[#8cd6ff] data-[state=active]:text-black"><Link size={15} /> URL</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-5">
            <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/20 p-8 text-center transition hover:border-[#8cd6ff]/70">
              {uploading ? <Loader2 className="mb-3 animate-spin text-[#8cd6ff]" /> : <Upload className="mb-3 text-[#8cd6ff]" />}
              <span className="font-bold text-white">Upload naar {selectedBucket}</span>
              <span className="mt-2 text-sm text-slate-400">Bestanden worden public-read opgeslagen in de gekozen bucket onder een nette campagne-map.</span>
              <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={uploadFile} />
            </label>
          </TabsContent>

          <TabsContent value="gallery" className="mt-5 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Label>Bucket</Label>
                <select value={selectedBucket} onChange={(event) => setBucket(event.target.value)} className="mt-2 rounded-md border border-white/10 bg-[#050b14] px-3 py-2 text-sm text-white">
                  {buckets.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <Button type="button" variant="outline" onClick={loadGallery} disabled={galleryLoading} className="gap-2 border-white/10 bg-transparent text-white hover:bg-white/10">
                {galleryLoading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />} Vernieuwen
              </Button>
            </div>

            {galleryLoading ? (
              <div className="flex min-h-48 items-center justify-center text-slate-400"><Loader2 className="mr-2 animate-spin" /> Galerij laden...</div>
            ) : gallery.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-slate-400">Geen afbeeldingen gevonden in deze bucket.</div>
            ) : (
              <div className="grid max-h-[52vh] grid-cols-2 gap-3 overflow-y-auto pr-1 md:grid-cols-3 lg:grid-cols-4">
                {gallery.map((item) => (
                  <button key={`${item.bucket}:${item.path}`} type="button" onClick={() => selectImage(item)} className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-2 text-left transition hover:border-[#8cd6ff]">
                    <img src={item.url} alt={item.alt} className="h-32 w-full rounded-xl object-cover" loading="lazy" />
                    <span className="mt-2 block truncate text-xs text-slate-300">{item.path}</span>
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="url" className="mt-5 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Afbeelding URL</Label>
                <Input value={manualUrl} onChange={(event) => setManualUrl(event.target.value)} placeholder="https://..." className="mt-2 bg-[#050b14]" />
              </div>
              <div>
                <Label>Alt tekst</Label>
                <Input value={manualAlt} onChange={(event) => setManualAlt(event.target.value)} placeholder="Beschrijf de afbeelding" className="mt-2 bg-[#050b14]" />
              </div>
            </div>
            {isHttpUrl(manualUrl.trim()) && <img src={manualUrl.trim()} alt={manualAlt} className="max-h-72 w-full rounded-2xl border border-white/10 object-contain" />}
            <Button type="button" onClick={selectManualUrl} className="bg-[#8cd6ff] text-black hover:bg-[#7dd3fc]">Selecteer URL</Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ImagePickerModal;

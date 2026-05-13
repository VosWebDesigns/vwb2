import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Mail, Plus, Save, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImagePickerModal from '@/components/admin/ImagePickerModal';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const emptyCampaign = {
  id: null,
  title: 'Nieuwe nieuwsbrief',
  subject: '',
  preheader: '',
  hero_image_url: '',
  content_json: { blocks: [{ type: 'paragraph', text: '' }] },
  status: 'draft',
  stats: { sent: 0, failed: 0, skipped: 0 },
};

const blockLabels = {
  heading: 'Kop',
  paragraph: 'Paragraaf',
  image: 'Afbeelding',
  divider: 'Scheiding',
  cta: 'CTA knop',
  quote: 'Quote',
};

const blockTemplate = (type) => ({
  type,
  ...(type === 'cta' ? { label: 'Bekijk meer', href: 'https://www.voswebdesigns.nl/contact' } : {}),
  ...(type === 'image' ? { url: '', alt: '' } : {}),
  ...(type !== 'image' && type !== 'divider' && type !== 'cta' ? { text: '' } : {}),
});

const NewsletterPage = () => {
  const { toast } = useToast();
  const { session } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState(emptyCampaign);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [imagePicker, setImagePicker] = useState({ isOpen: false, target: null, blockIndex: null });

  const blocks = useMemo(() => (
    Array.isArray(selected?.content_json?.blocks) ? selected.content_json.blocks : []
  ), [selected]);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${session?.access_token || ''}`,
  });

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/newsletter/admin/campaigns', { headers: authHeaders() });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || 'Campagnes laden mislukt.');
      setCampaigns(data.campaigns || []);
      if (!selected.id && data.campaigns?.[0]) setSelected(data.campaigns[0]);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Nieuwsbrief', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.access_token) fetchCampaigns();
  }, [session?.access_token]);

  const updateField = (field, value) => setSelected((current) => ({ ...current, [field]: value }));
  const updateContentJson = (updater) => setSelected((current) => {
    const currentContent = current.content_json && typeof current.content_json === 'object' ? current.content_json : { blocks: [] };
    return { ...current, content_json: updater(currentContent) };
  });
  const updateBlock = (index, field, value) => updateContentJson((content) => ({
    ...content,
    blocks: (Array.isArray(content.blocks) ? content.blocks : []).map((block, blockIndex) => (blockIndex === index ? { ...block, [field]: value } : block)),
  }));
  const updateHeroAlt = (value) => updateContentJson((content) => ({ ...content, hero_alt: value }));
  const addBlock = (type) => updateContentJson((content) => ({ ...content, blocks: [...(Array.isArray(content.blocks) ? content.blocks : []), blockTemplate(type)] }));
  const removeBlock = (index) => updateContentJson((content) => ({ ...content, blocks: (Array.isArray(content.blocks) ? content.blocks : []).filter((_, blockIndex) => blockIndex !== index) }));
  const moveBlock = (index, direction) => {
    const next = [...blocks];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateContentJson((content) => ({ ...content, blocks: next }));
  };

  const openHeroImagePicker = () => setImagePicker({ isOpen: true, target: 'hero', blockIndex: null });
  const openBlockImagePicker = (index) => setImagePicker({ isOpen: true, target: 'block', blockIndex: index });
  const closeImagePicker = () => setImagePicker({ isOpen: false, target: null, blockIndex: null });
  const handleImageSelect = ({ url, alt = '' }) => {
    if (imagePicker.target === 'hero') {
      updateField('hero_image_url', url);
      if (alt) updateHeroAlt(alt);
      return;
    }
    if (imagePicker.target === 'block' && imagePicker.blockIndex !== null) {
      updateContentJson((content) => ({
        ...content,
        blocks: (Array.isArray(content.blocks) ? content.blocks : []).map((block, blockIndex) => (
          blockIndex === imagePicker.blockIndex ? { ...block, url, alt: alt || block.alt || '' } : block
        )),
      }));
    }
  };

  const saveCampaign = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/newsletter/admin/campaigns', {
        method: selected.id ? 'PUT' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify(selected),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || 'Opslaan mislukt.');
      await fetchCampaigns();
      setSelected(data.campaign);
      toast({ title: 'Nieuwsbrief opgeslagen', description: 'De campagne is bijgewerkt.' });
      return data.campaign;
    } catch (error) {
      toast({ variant: 'destructive', title: 'Nieuwsbrief', description: error.message });
    } finally {
      setSaving(false);
    }
  };

  const sendCampaign = async (mode) => {
    const campaign = selected.id ? selected : await saveCampaign();
    if (!campaign?.id) return;
    if (mode === 'send' && !window.confirm('Weet u zeker dat u deze nieuwsbrief naar alle actieve subscribers wilt versturen?')) return;
    setSending(true);
    try {
      let cursor = 0;
      let totals = { processed: 0, sent: 0, failed: 0 };
      do {
        const response = await fetch('/api/newsletter/admin/send', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ campaign_id: campaign.id, mode, test_email: testEmail, cursor, batchSize: 50 }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || data?.success === false) throw new Error(data?.error || 'Versturen mislukt.');
        if (mode === 'test') {
          toast({ title: 'Testmail verstuurd', description: data.message });
          break;
        }
        totals = {
          processed: totals.processed + (data.processed || 0),
          sent: totals.sent + (data.sentCount ?? data.sent ?? 0),
          failed: totals.failed + (data.failedCount ?? data.failed ?? 0),
        };
        cursor = data.nextCursor ?? data.next_offset;
        if (!cursor) break;
      } while (mode === 'send');

      if (mode === 'send') {
        toast({ title: 'Nieuwsbrief verstuurd', description: `${totals.processed} verwerkt, ${totals.sent} verzonden, ${totals.failed} mislukt.` });
      }
      await fetchCampaigns();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Nieuwsbrief', description: error.message });
    } finally {
      setSending(false);
    }
  };

  const renderPreviewBlock = (block, index) => {
    if (block.type === 'heading') return <h2 key={index} className="mt-6 text-2xl font-black text-white">{block.text || 'Koptekst'}</h2>;
    if (block.type === 'image') return block.url ? <figure key={index} className="my-5"><img src={block.url} alt={block.alt || ''} className="w-full rounded-2xl border border-white/10" />{block.caption && <figcaption className="mt-2 text-sm text-slate-500">{block.caption}</figcaption>}</figure> : <div key={index} className="my-5 rounded-2xl border border-dashed border-white/20 p-6 text-slate-500">Afbeelding</div>;
    if (block.type === 'divider') return <hr key={index} className="my-6 border-white/10" />;
    if (block.type === 'cta') return <a key={index} href={block.href} className="my-5 inline-flex rounded-full bg-[#38bdf8] px-5 py-3 font-black text-black">{block.label || 'CTA'}</a>;
    if (block.type === 'quote') return <blockquote key={index} className="my-5 rounded-2xl border-l-4 border-[#38bdf8] bg-[#07111f] p-5 text-slate-200">{block.text || 'Quote'}</blockquote>;
    return <p key={index} className="my-4 leading-8 text-slate-300 whitespace-pre-wrap">{block.text || 'Paragraaftekst...'}</p>;
  };

  return (
    <div className="space-y-6">
      <Helmet><title>Nieuwsbrief beheer | Vos Admin</title></Helmet>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.18em] text-[#38bdf8]">Vos Admin</p>
          <h1 className="text-3xl font-black tracking-tight text-white">Nieuwsbrief</h1>
        </div>
        <Button onClick={() => setSelected(emptyCampaign)} className="gap-2 bg-[#38bdf8] text-black hover:bg-[#7dd3fc]"><Plus size={18} /> Nieuwe campagne</Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-[#07111f]/80 p-4">
          <h2 className="mb-4 font-bold text-white">Campagnes</h2>
          {loading ? <div className="flex items-center gap-2 text-slate-400"><Loader2 className="animate-spin" size={18} /> Laden...</div> : (
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <button key={campaign.id} onClick={() => setSelected(campaign)} className={`w-full rounded-2xl border p-4 text-left transition ${selected.id === campaign.id ? 'border-[#38bdf8] bg-[#38bdf8]/10' : 'border-white/10 bg-black/10 hover:border-white/30'}`}>
                  <span className="block font-bold text-white">{campaign.title}</span>
                  <span className="mt-1 block text-xs uppercase tracking-wider text-slate-500">{campaign.status} · sent {campaign.stats?.sent || 0} · failed {campaign.stats?.failed || 0}</span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="grid gap-6 2xl:grid-cols-2">
          <div className="space-y-5 rounded-3xl border border-white/10 bg-[#07111f]/80 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Titel intern</Label><Input value={selected.title} onChange={(e) => updateField('title', e.target.value)} className="mt-2 bg-[#050b14]" /></div>
              <div><Label>Onderwerp</Label><Input value={selected.subject} onChange={(e) => updateField('subject', e.target.value)} className="mt-2 bg-[#050b14]" /></div>
            </div>
            <div><Label>Preheader</Label><Input value={selected.preheader || ''} onChange={(e) => updateField('preheader', e.target.value)} className="mt-2 bg-[#050b14]" /></div>
            <div className="space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Label>Hero afbeelding</Label>
                  <p className="mt-1 text-sm text-slate-500">Kies via upload, storage galerij of handmatige URL.</p>
                </div>
                <Button type="button" onClick={openHeroImagePicker} className="gap-2 bg-[#38bdf8] text-black hover:bg-[#7dd3fc]"><ImagePlus size={16} /> Kies hero afbeelding</Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Input placeholder="Hero image URL" value={selected.hero_image_url || ''} onChange={(e) => updateField('hero_image_url', e.target.value)} className="bg-[#050b14]" />
                <Input placeholder="Hero alt tekst" value={selected.content_json?.hero_alt || ''} onChange={(e) => updateHeroAlt(e.target.value)} className="bg-[#050b14]" />
              </div>
              {selected.hero_image_url && <img src={selected.hero_image_url} alt={selected.content_json?.hero_alt || ''} className="max-h-64 w-full rounded-2xl border border-white/10 object-cover" />}
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.keys(blockLabels).map((type) => <Button key={type} type="button" variant="outline" onClick={() => addBlock(type)} className="border-white/10 bg-transparent text-white hover:bg-white/10">+ {blockLabels[type]}</Button>)}
            </div>

            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div key={`${block.type}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <strong className="text-[#38bdf8]">{blockLabels[block.type] || block.type}</strong>
                    <div className="flex gap-2">
                      <Button type="button" size="sm" variant="ghost" onClick={() => moveBlock(index, -1)}><ArrowUp size={16} /></Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => moveBlock(index, 1)}><ArrowDown size={16} /></Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => removeBlock(index)} className="text-red-300"><Trash2 size={16} /></Button>
                    </div>
                  </div>
                  {block.type === 'image' ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button type="button" onClick={() => openBlockImagePicker(index)} className="gap-2 bg-[#38bdf8] text-black hover:bg-[#7dd3fc]"><ImagePlus size={16} /> Kies afbeelding</Button>
                        {block.url && <span className="truncate text-sm text-slate-500">{block.url}</span>}
                      </div>
                      <div className="grid gap-3 md:grid-cols-3"><Input placeholder="Afbeelding URL" value={block.url || ''} onChange={(e) => updateBlock(index, 'url', e.target.value)} /><Input placeholder="Alt tekst" value={block.alt || ''} onChange={(e) => updateBlock(index, 'alt', e.target.value)} /><Input placeholder="Caption" value={block.caption || ''} onChange={(e) => updateBlock(index, 'caption', e.target.value)} /></div>
                      {block.url && <img src={block.url} alt={block.alt || ''} className="max-h-56 w-full rounded-xl border border-white/10 object-cover" />}
                    </div>
                  ) : block.type === 'cta' ? (
                    <div className="grid gap-3 md:grid-cols-2"><Input placeholder="Knoptekst" value={block.label || ''} onChange={(e) => updateBlock(index, 'label', e.target.value)} /><Input placeholder="URL" value={block.href || ''} onChange={(e) => updateBlock(index, 'href', e.target.value)} /></div>
                  ) : block.type === 'divider' ? <p className="text-sm text-slate-500">Visuele scheidingslijn.</p> : (
                    <Textarea rows={block.type === 'heading' ? 2 : 5} value={block.text || ''} onChange={(e) => updateBlock(index, 'text', e.target.value)} placeholder="Tekst..." />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
              <Button onClick={saveCampaign} disabled={saving} className="gap-2 bg-white text-black hover:bg-slate-200"><Save size={16} /> {saving ? 'Opslaan...' : 'Opslaan'}</Button>
              <Input placeholder="test@email.nl" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="bg-[#050b14] sm:max-w-xs" />
              <Button onClick={() => sendCampaign('test')} disabled={sending || !selected.id} variant="outline" className="gap-2 border-[#38bdf8]/40 bg-transparent text-[#38bdf8]"><Mail size={16} /> Testmail sturen</Button>
              <Button onClick={() => sendCampaign('send')} disabled={sending || !selected.id} className="gap-2 bg-[#38bdf8] text-black hover:bg-[#7dd3fc]"><Send size={16} /> Verstuur nieuwsbrief</Button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#050b14] p-5">
            <div className="mb-4 flex items-center justify-between text-sm text-slate-500"><span>Live preview</span><span>{selected.status}</span></div>
            <article className="mx-auto max-w-2xl rounded-[1.5rem] border border-white/10 bg-[#0b1524] p-6">
              <p className="mb-4 text-xs font-black uppercase tracking-[.2em] text-[#38bdf8]">Vos Web Designs</p>
              <h1 className="text-3xl font-black text-white">{selected.subject || selected.title}</h1>
              {selected.preheader && <p className="mt-3 text-slate-400">{selected.preheader}</p>}
              {selected.hero_image_url && <img src={selected.hero_image_url} alt={selected.content_json?.hero_alt || ''} className="my-6 w-full rounded-2xl border border-white/10" />}
              {blocks.map(renderPreviewBlock)}
            </article>
          </div>
        </section>
      </div>
      <ImagePickerModal
        isOpen={imagePicker.isOpen}
        onClose={closeImagePicker}
        onSelect={handleImageSelect}
        bucketOptions={['newsletter-media', 'portfolio-media']}
        defaultBucket="newsletter-media"
        campaignId={selected.id}
      />
    </div>
  );
};

export default NewsletterPage;

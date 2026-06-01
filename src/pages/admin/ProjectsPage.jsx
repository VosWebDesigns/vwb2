import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import {
  Trash, Eye, EyeOff, Edit, Plus, Loader2,
  Image as ImageIcon, FolderKanban
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import ImageUpload from '@/components/admin/ImageUpload';
import SmartImage from '@/components/SmartImage';
import ProjectGalleryManager from '@/components/admin/ProjectGalleryManager';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';

/* ===== INPUT STYLE ===== */
const INPUT =
  'w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white ' +
  'placeholder:text-gray-500 focus:border-[#38bdf8] focus:outline-none';

const INITIAL_FORM_STATE = {
  title: '',
  slug: '',
  category_id: '',
  short_description: '',
  description: '',
  hero_image: '',
  live_url: '',
  stack: '',
  resultaat: '',
  problem: '',
  solution: '',
  tags: '',
  featured_preview_image: '',
  client: '',
  industry: '',
  year: '2026',
  duration: '',
  is_featured: false,
  is_published: true,
};

const ProjectsPage = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [activeProjectId, setActiveProjectId] = useState(null);

  /* ================= DATA ================= */
  const fetchData = async () => {
    try {
      setLoading(true);

      const { data: projects, error: pErr } = await supabase
        .from('projects')
        .select(`
          *,
          category:categories (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (pErr) throw pErr;

      const { data: categories, error: cErr } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (cErr) throw cErr;

      setProjects(projects || []);
      setCategories(categories || []);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Fout', description: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /* ================= EDIT ================= */
  const openEdit = (project) => {
    setFormData({ ...INITIAL_FORM_STATE, ...project });
    setIsEditing(project.id);
    setActiveProjectId(project.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(null);
    setActiveProjectId(null);
    setFormData(INITIAL_FORM_STATE);
  };

  /* ================= SAVE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { category, project_status, ...cleanData } = formData;

      if (project_status === 'concept') {
        cleanData.is_published = false;
        cleanData.is_featured = false;
      } else if (project_status === 'published') {
        cleanData.is_published = true;
        cleanData.is_featured = false;
      } else if (project_status === 'featured') {
        cleanData.is_published = true;
        cleanData.is_featured = true;
      }

      if (!cleanData.slug && cleanData.title) {
        cleanData.slug = cleanData.title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '');
      }

      const isUpdate = Boolean(isEditing);
      const currentId = isEditing || '00000000-0000-0000-0000-000000000000';

      if (cleanData.home_featured) {
        const { error: resetError } = await supabase
          .from('projects')
          .update({ home_featured: false })
          .neq('id', currentId);

        if (resetError) throw resetError;
      }

      const projectQuery = isUpdate
        ? supabase.from('projects').update(cleanData).eq('id', isEditing).select('id').single()
        : supabase.from('projects').insert([cleanData]).select('id').single();

      const { data: savedProject, error } = await projectQuery;

      if (error) throw error;

      // 🟡 ACTIVITY LOG
      await supabase.from('activity_log').insert([{
        type: 'project',
        action: isUpdate ? 'updated' : 'created',
        title: cleanData.title,
        user_id: user?.id
      }]);

      toast({
        title: 'Succes',
        description: isUpdate ? 'Project bijgewerkt' : 'Project aangemaakt'
      });

      if (savedProject?.id) {
        setActiveProjectId(savedProject.id);
        setIsEditing(savedProject.id);
      }
      fetchData();
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Fout',
        description: e.message
      });
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      const item = projects.find(p => p.id === deleteId);

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      // 🟡 ACTIVITY LOG
      await supabase.from('activity_log').insert([{
        type: 'project',
        action: 'deleted',
        title: item?.title,
        user_id: user?.id
      }]);

      setProjects(p => p.filter(x => x.id !== deleteId));
      toast({ title: 'Verwijderd', description: 'Project verwijderd' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Fout', description: e.message });
    } finally {
      setDeleteId(null);
    }
  };

  /* ================= PUBLISH ================= */
  const togglePublish = async (id, current) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ is_published: !current })
        .eq('id', id);

      if (error) throw error;

      setProjects(p =>
        p.map(x => x.id === id ? { ...x, is_published: !current } : x)
      );
    } catch {
      toast({ variant: 'destructive', title: 'Fout', description: 'Status wijzigen mislukt' });
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 pb-24">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Portfolio</h1>
          <p className="text-gray-400 text-sm">Beheer je projecten en cases</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setIsEditing(null); setActiveProjectId(null); setFormData(INITIAL_FORM_STATE); }} className="bg-[#38bdf8] text-black">
            <Plus size={18} className="mr-2" /> Nieuw project
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* FORM */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="lg:col-span-5"
            >
              <form onSubmit={handleSubmit} className="bg-[#111827] rounded-xl border border-gray-800 p-5 space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Hero afbeelding</label>
                  <ImageUpload
                    value={formData.hero_image || ''}
                    onChange={url => setFormData({ ...formData, hero_image: url })}
                  />
                </div>

                <input
                  className={INPUT}
                  type="url"
                  placeholder="Live website URL (https://...)"
                  value={formData.live_url || ''}
                  onChange={e => setFormData({ ...formData, live_url: e.target.value })}
                />
                <input
                  className={INPUT}
                  placeholder="Tech stack (bv. React, Supabase, Vercel)"
                  value={formData.stack || ''}
                  onChange={e => setFormData({ ...formData, stack: e.target.value })}
                />
                <input
                  className={INPUT}
                  placeholder="Resultaat (bv. +32% aanvragen)"
                  value={formData.resultaat || ''}
                  onChange={e => setFormData({ ...formData, resultaat: e.target.value })}
                />
                <textarea
                  className={`${INPUT} h-24`}
                  placeholder="Probleem / uitdaging van de klant"
                  value={formData.problem || ''}
                  onChange={e => setFormData({ ...formData, problem: e.target.value })}
                />
                <textarea
                  className={`${INPUT} h-24`}
                  placeholder="Oplossing / aanpak"
                  value={formData.solution || ''}
                  onChange={e => setFormData({ ...formData, solution: e.target.value })}
                />
                <input
                  className={INPUT}
                  placeholder="Tags (gescheiden door komma's)"
                  value={formData.tags || ''}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Featured preview afbeelding</label>
                  <ImageUpload
                    value={formData.featured_preview_image || ''}
                    onChange={url => setFormData({ ...formData, featured_preview_image: url })}
                  />
                </div>

                {activeProjectId ? (
                  <ProjectGalleryManager
                    projectId={activeProjectId}
                    onCoverChange={(heroImage) => setFormData((prev) => ({ ...prev, hero_image: heroImage }))}
                  />
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-700 p-4 text-sm text-gray-400">
                    Sla eerst het project op om meerdere afbeeldingen toe te voegen.
                  </div>
                )}

                <input className={INPUT} placeholder="Titel" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                <select className={INPUT} value={formData.category_id || ''} onChange={e => setFormData({ ...formData, category_id: e.target.value })}>
                  <option value="">Selecteer categorie</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <input className={INPUT} placeholder="Klant / branche" value={formData.client || ''} onChange={e => setFormData({ ...formData, client: e.target.value })} />
                <input className={INPUT} placeholder="Branche (bv. Bouw, coaching, horeca)" value={formData.industry || ''} onChange={e => setFormData({ ...formData, industry: e.target.value })} />
                <input className={INPUT} placeholder="Jaar" value={formData.year || ''} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                <input className={INPUT} placeholder="Projectduur" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })} />

                <textarea className={`${INPUT} h-24`} placeholder="Korte beschrijving" value={formData.short_description || ''} onChange={e => setFormData({ ...formData, short_description: e.target.value })} />
                <textarea className={`${INPUT} h-36`} placeholder="Uitgebreide projectbeschrijving" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />

                <select
                  className={INPUT}
                  value={formData.is_featured ? 'featured' : formData.is_published ? 'published' : 'concept'}
                  onChange={e => setFormData({
                    ...formData,
                    project_status: e.target.value,
                    is_published: e.target.value !== 'concept',
                    is_featured: e.target.value === 'featured',
                  })}
                >
                  <option value="concept">Concept</option>
                  <option value="published">Gepubliceerd</option>
                  <option value="featured">Uitgelicht</option>
                </select>

                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formData.home_featured} onChange={e => setFormData({ ...formData, home_featured: e.target.checked })} />
                  Featured preview op homepage
                </label>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 bg-[#38bdf8] text-black">Opslaan</Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={closeForm}>Annuleren</Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LIST */}
        <div className={`${showForm ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#38bdf8]" /></div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-gray-500 border border-dashed border-gray-800 rounded-xl">
              <FolderKanban size={48} className="mx-auto mb-4 opacity-20" />
              Nog geen projecten
            </div>
          ) : (
            projects.map(p => (
              <div key={p.id} className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-24 h-40 sm:h-24 bg-black rounded overflow-hidden">
                  {p.hero_image ? <SmartImage src={p.hero_image} alt={p.title} className="w-full h-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#082f49]"><ImageIcon className="text-[#38bdf8]/60" /></div>}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-white">{p.title}</h3>
                    {!p.is_published && (
                      <span className="rounded-full border border-slate-500/40 bg-slate-500/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[.16em] text-slate-300">Concept</span>
                    )}
                    {p.is_featured && (
                      <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[.16em] text-amber-200">Uitgelicht</span>
                    )}
                    {p.home_featured && (
                      <span className="rounded-full border border-[#38bdf8]/40 bg-[#38bdf8]/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-[.16em] text-[#38bdf8]">Home preview</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-3">{p.short_description || '—'}</p>
                  {p.category?.name && (
                    <span className="text-xs text-[#38bdf8]">{p.category.name}</span>
                  )}
                  {(p.client || p.industry || p.resultaat) && (
                    <p className="mt-2 text-xs text-gray-500">{[p.client, p.industry, p.resultaat].filter(Boolean).join(' • ')}</p>
                  )}
                </div>

                <div className="flex sm:flex-col gap-2 justify-end">
                  <Button size="icon" variant="ghost" onClick={() => togglePublish(p.id, p.is_published)}>
                    {p.is_published ? <Eye /> : <EyeOff />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                    <Edit />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteId(p.id)}>
                    <Trash className="text-red-500" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Project verwijderen"
        description="Weet je zeker dat je dit project wilt verwijderen?"
      />
    </div>
  );
};

export default ProjectsPage;

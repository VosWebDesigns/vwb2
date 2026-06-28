import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Trash, Plus, Edit, Star, Quote, Loader2, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const logSupabaseError = (label, error) => {
  if (!error) return;

  console.error(label, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });
};

const TestimonialsPage = () => {
  const { user } = useAuth();

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const initialForm = {
    name: '',
    role: '',
    company: '',
    text: '',
    rating: 5,
    is_visible: true
  };

  const [formData, setFormData] = useState(initialForm);

  /* ================= FETCH ================= */
  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    logSupabaseError('ADMIN_TESTIMONIALS_FETCH_ERROR', error);

    if (data) setTestimonials(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  /* ================= SAVE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const isUpdate = Boolean(isEditing);

      const { error } = isUpdate
        ? await supabase.from('testimonials').update(formData).eq('id', isEditing)
        : await supabase.from('testimonials').insert([formData]);

      logSupabaseError('ADMIN_TESTIMONIAL_SAVE_ERROR', error);

      if (error) throw error;

      // 🟡 ACTIVITY LOG
      const { error: activityLogError } = await supabase.from('activity_log').insert([{
        type: 'testimonial',
        action: isUpdate ? 'updated' : 'created',
        title: formData.name,
        user_id: user?.id
      }]);

      logSupabaseError('ADMIN_TESTIMONIAL_ACTIVITY_LOG_ERROR', activityLogError);

      toast({ title: 'Succes', description: 'Review opgeslagen' });

      setShowForm(false);
      setIsEditing(null);
      setFormData(initialForm);
      fetchTestimonials();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Fout', description: error.message });
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setFormData({
      ...initialForm,
      ...item,
      is_visible: item.is_visible ?? true,
    });
    setIsEditing(item.id);
    setShowForm(true);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      const item = testimonials.find(t => t.id === deleteId);

      const { error: deleteError } = await supabase.from('testimonials').delete().eq('id', deleteId);

      logSupabaseError('ADMIN_TESTIMONIAL_DELETE_ERROR', deleteError);

      if (deleteError) throw deleteError;

      // 🟡 ACTIVITY LOG
      const { error: activityLogError } = await supabase.from('activity_log').insert([{
        type: 'testimonial',
        action: 'deleted',
        title: item?.name,
        user_id: user?.id
      }]);

      logSupabaseError('ADMIN_TESTIMONIAL_ACTIVITY_LOG_ERROR', activityLogError);

      setTestimonials(prev => prev.filter(t => t.id !== deleteId));
      toast({ title: 'Verwijderd', description: 'Review verwijderd' });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Fout', description: e.message });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      {/* DELETE DIALOG – buiten framer-motion (iOS safe) */}
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Review verwijderen"
        description="Weet je zeker dat je deze review wilt verwijderen?"
      />

      <div className="max-w-5xl mx-auto space-y-6 px-4 pb-24">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Testimonials</h1>
            <p className="text-gray-400 text-sm">Beheer reviews van klanten</p>
          </div>

          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[var(--accent)] text-black"
            >
              <Plus size={18} className="mr-2" />
              Nieuwe review
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
                className="lg:col-span-4"
              >
                <div className="bg-[rgba(8,8,18,.82)] p-5 rounded-xl border border-[rgba(201,169,110,.09)] sticky top-24">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-white">
                      {isEditing ? 'Bewerk review' : 'Nieuwe review'}
                    </h3>
                    <Button size="icon" variant="ghost" onClick={() => setShowForm(false)}>
                      <X size={18} />
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      className="w-full bg-black border border-[rgba(201,169,110,.16)] rounded px-3 py-2 text-white"
                      placeholder="Naam"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                    />

                    <input
                      className="w-full bg-black border border-[rgba(201,169,110,.16)] rounded px-3 py-2 text-white"
                      placeholder="Bedrijf"
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                    />

                    <textarea
                      className="w-full bg-black border border-[rgba(201,169,110,.16)] rounded px-3 py-2 text-white h-32"
                      placeholder="Review tekst"
                      value={formData.text}
                      onChange={e => setFormData({ ...formData, text: e.target.value })}
                      required
                    />

                    <input
                      type="number"
                      min="1"
                      max="5"
                      className="w-full bg-black border border-[rgba(201,169,110,.16)] rounded px-3 py-2 text-white"
                      value={formData.rating}
                      onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })}
                    />

                    <label className="flex items-center gap-3 rounded border border-[rgba(201,169,110,.16)] bg-black px-3 py-2 text-sm text-white">
                      <input
                        type="checkbox"
                        checked={Boolean(formData.is_visible)}
                        onChange={e => setFormData({ ...formData, is_visible: e.target.checked })}
                        className="h-4 w-4 accent-[var(--accent)]"
                      />
                      Zichtbaar op website
                    </label>

                    <Button type="submit" className="w-full bg-[var(--accent)] text-black">
                      Opslaan
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LIST */}
          <div className={`${showForm ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map(t => (
                  <div key={t.id} className="bg-[rgba(8,8,18,.82)] p-5 rounded-xl border border-[rgba(201,169,110,.09)] flex flex-col">
                    <div className="flex justify-between mb-3">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < t.rating ? 'text-[var(--accent)] fill-[var(--accent)]' : 'text-gray-700'}
                          />
                        ))}
                      </div>

                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(t)}>
                          <Edit size={16} />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setDeleteId(t.id)}>
                          <Trash size={16} className="text-red-500" />
                        </Button>
                      </div>
                    </div>

                    <div className="relative pl-4 mb-4">
                      <Quote className="absolute left-0 top-0 text-[var(--accent)]/20" size={24} />
                      <p className="text-gray-300 italic text-sm">"{t.text}"</p>
                    </div>

                    <div className="mt-auto pt-3 border-t border-[rgba(201,169,110,.09)]">
                      <p className="font-bold text-white text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.company}</p>
                    </div>
                  </div>
                ))}

                {testimonials.length === 0 && (
                  <div className="col-span-full text-center text-gray-500 py-12 border border-dashed border-[rgba(201,169,110,.09)] rounded-xl">
                    Geen reviews gevonden
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialsPage;
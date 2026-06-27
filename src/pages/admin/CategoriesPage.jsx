import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Trash, Loader2, Plus, Layers } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const CategoriesPage = () => {
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  /* ================= FETCH ================= */
  const fetchCats = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fout',
        description: 'Kon categorieën niet laden'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  /* ================= CREATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const slug = name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');

      const { error } = await supabase
        .from('categories')
        .insert([{ name, slug }]);

      if (error) throw error;

      // 🟡 ACTIVITY LOG
      await supabase.from('activity_log').insert([{
        type: 'category',
        action: 'created',
        title: name,
        user_id: user?.id
      }]);

      toast({ title: 'Succes', description: 'Categorie toegevoegd' });
      setName('');
      fetchCats();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fout',
        description: error.message
      });
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id, categoryName) => {
    if (!window.confirm(`Weet je zeker dat je "${categoryName}" wilt verwijderen?`)) {
      return;
    }

    setDeletingId(id);

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        if (error.code === '23503') {
          throw new Error('Deze categorie is in gebruik en kan niet worden verwijderd.');
        }
        throw error;
      }

      // 🟡 ACTIVITY LOG
      await supabase.from('activity_log').insert([{
        type: 'category',
        action: 'deleted',
        title: categoryName,
        user_id: user?.id
      }]);

      setCategories(current => current.filter(c => c.id !== id));

      toast({
        title: 'Verwijderd',
        description: 'Categorie succesvol verwijderd'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Kon niet verwijderen',
        description: error.message
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Categorieën</h1>
        <p className="text-gray-400 text-sm">
          Beheer de categorieën voor je portfolio items.
        </p>
      </div>

      {/* ADD */}
      <div className="bg-[rgba(12,22,40,0.72)] p-4 rounded-xl border border-[rgba(140,214,255,0.12)]">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            placeholder="Nieuwe categorie naam..."
            className="flex-1 px-4 py-3 bg-black border border-[rgba(140,214,255,0.16)] rounded-lg text-white focus:border-[#8cd6ff] focus:outline-none"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="bg-[#8cd6ff] text-black font-medium sm:w-auto w-full"
          >
            <Plus size={18} className="mr-2" />
            Toevoegen
          </Button>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-[rgba(12,22,40,0.72)] rounded-xl border border-[rgba(140,214,255,0.12)] overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="animate-spin text-[#8cd6ff]" size={32} />
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {categories.map(c => (
              <div
                key={c.id}
                className="p-4 flex justify-between items-center hover:bg-[#252525]"
              >
                <div>
                  <span className="font-medium text-gray-200">{c.name}</span>
                  <div className="text-xs text-gray-500 font-mono">/{c.slug}</div>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  disabled={deletingId === c.id}
                  onClick={() => handleDelete(c.id, c.name)}
                  className="text-gray-500 hover:text-red-400"
                >
                  {deletingId === c.id
                    ? <Loader2 size={18} className="animate-spin text-red-500" />
                    : <Trash size={18} />}
                </Button>
              </div>
            ))}

            {categories.length === 0 && (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-2">
                <Layers size={32} className="opacity-50" />
                Geen categorieën gevonden.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
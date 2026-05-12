import { supabase } from '@/lib/customSupabaseClient';

const safe = async (query, fallback = []) => {
  const { data, error } = await query;
  if (error) {
    console.error('PUBLIC_CONTENT_QUERY_ERROR', { message: error.message, code: error.code, details: error.details });
    return fallback;
  }
  return data || fallback;
};

export const getPublishedProjects = async ({ featuredOnly = false, limit } = {}) => {
  let query = supabase
    .from('projects')
    .select('*, categories(id, name)')
    .or('is_published.is.null,is_published.eq.true')
    .order('created_at', { ascending: false });

  if (featuredOnly) query = query.or('is_featured.is.null,is_featured.eq.true');
  if (limit) query = query.limit(limit);

  return safe(query);
};

export const getCategories = async () => safe(
  supabase.from('categories').select('id, name').order('name', { ascending: true })
);

export const getVisibleTestimonials = async ({ limit } = {}) => {
  let query = supabase
    .from('testimonials')
    .select('*')
    .or('is_visible.is.null,is_visible.eq.true')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (limit) query = query.limit(limit);
  return safe(query);
};

export const getProjectWithImages = async id => {
  const { data: project, error } = await supabase
    .from('projects')
    .select('*, categories(id, name)')
    .eq('id', id)
    .or('is_published.is.null,is_published.eq.true')
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('PUBLIC_PROJECT_QUERY_ERROR', { message: error.message, code: error.code, details: error.details });
    }
    return { project: null, images: [] };
  }

  const images = await safe(
    supabase
      .from('portfolio_images')
      .select('*')
      .eq('portfolio_id', id)
      .order('is_cover', { ascending: false })
      .order('sort_order', { ascending: true }),
    []
  );

  return { project, images };
};

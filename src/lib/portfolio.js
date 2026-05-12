import { supabase } from '@/lib/customSupabaseClient';

const logPortfolioError = (label, error) => {
  if (!error) return;
  console.error(label, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });
};

export const getPortfolioByIdWithImages = async (id) => {
  const { data: portfolio, error: portfolioError } = await supabase
    .from('projects')
    .select('*, categories(name)')
    .eq('id', id)
    .or('is_published.is.null,is_published.eq.true')
    .single();

  if (portfolioError) {
    logPortfolioError('PROJECT_DETAIL_QUERY_ERROR', portfolioError);
    return { portfolio: null, images: [] };
  }

  const { data: images, error: imageError } = await supabase
    .from('portfolio_images')
    .select('*')
    .eq('portfolio_id', id)
    .order('is_cover', { ascending: false })
    .order('sort_order', { ascending: true });

  if (imageError) {
    logPortfolioError('PROJECT_GALLERY_QUERY_ERROR', imageError);
  }

  const gallery = images?.length
    ? [...images].sort((a, b) => Number(Boolean(b.is_cover)) - Number(Boolean(a.is_cover)) || (a.sort_order || 0) - (b.sort_order || 0))
    : [];

  return {
    portfolio,
    images: gallery,
  };
};

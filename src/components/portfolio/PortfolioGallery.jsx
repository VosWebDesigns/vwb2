import React, { useEffect, useMemo, useState } from 'react';

const PortfolioGallery = ({ title, images = [], fallbackImage }) => {
  const preparedImages = useMemo(() => {
    if (images.length > 0) return images;
    if (fallbackImage) {
      return [{ id: 'fallback-hero', url: fallbackImage, alt: title, is_cover: true, sort_order: 0 }];
    }
    return [];
  }, [fallbackImage, images, title]);

  const [activeId, setActiveId] = useState(preparedImages[0]?.id || null);

  useEffect(() => {
    setActiveId(preparedImages[0]?.id || null);
  }, [preparedImages]);

  const activeImage = preparedImages.find(item => item.id === activeId) || preparedImages[0];

  if (!activeImage) {
    return <section className="panel cut mb-12 p-8 text-center text-slate-300">Nog geen afbeeldingen gekoppeld aan dit project.</section>;
  }

  return (
    <section className="mb-12 space-y-4">
      <div className="panel cut overflow-hidden p-3">
        <SmartImage src={activeImage.url} alt={activeImage.alt || title} className="h-[260px] w-full rounded-[1.3rem] object-cover sm:h-[420px] lg:h-[620px]" loading="eager" fetchPriority="high" />
      </div>
      {preparedImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {preparedImages.map((item, index) => {
            const isActive = item.id === activeImage.id;
            return (
              <button key={item.id || item.url} type="button" onClick={() => setActiveId(item.id)} className={`relative h-24 w-28 shrink-0 overflow-hidden rounded-2xl border transition ${isActive ? 'border-[color:var(--accent2)]' : 'border-[color:var(--stroke)] opacity-70 hover:opacity-100'}`} aria-label={`Bekijk afbeelding ${index + 1}`}>
                <SmartImage src={item.url} alt={item.alt || title} className="h-full w-full object-cover" />
                {item.is_cover && <span className="absolute left-2 top-2 rounded-full bg-[color:var(--accent2)] px-2 py-1 text-[10px] font-black uppercase text-[#06101c]">cover</span>}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PortfolioGallery;

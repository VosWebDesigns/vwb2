import React from 'react';

const TestimonialStrips = ({ testimonials = [] }) => (
  <section className="px-5 py-20 md:px-10 lg:pl-28">
    <div className="mx-auto max-w-[1500px]">
      <div className="mb-8 flex items-end justify-between gap-6 border-b border-[color:var(--grid)] pb-5">
        <h2 className="text-4xl font-black uppercase tracking-[-.05em] md:text-7xl">Voice strips</h2>
        <span className="mono hidden text-xs uppercase tracking-[.3em] text-slate-400 md:block">client signal</span>
      </div>
      {!testimonials.length ? <div className="empty-state">Nog geen testimonials zichtbaar.</div> : (
        <div className="space-y-4">
          {testimonials.map((item, index) => (
            <figure key={item.id || `${item.name}-${index}`} className="voice-strip">
              <blockquote>“{item.text}”</blockquote>
              <figcaption>{item.name}{item.company ? ` / ${item.company}` : ''} <span>{'★'.repeat(Math.min(Number(item.rating) || 5, 5))}</span></figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  </section>
);

export default TestimonialStrips;

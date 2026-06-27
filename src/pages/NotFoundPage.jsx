import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Home, ArrowLeft } from 'lucide-react';

const QUICK_LINKS = [
  ['/portfolio', 'Portfolio'],
  ['/diensten', 'Diensten'],
  ['/over-ons', 'Over Ons'],
  ['/contact', 'Contact'],
];

const NotFoundPage = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-404]',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>404 - Pagina Niet Gevonden | Vos Web Designs</title>
        <meta name="description" content="Deze pagina bestaat niet. Ga terug naar de homepage of neem contact op als u hulp nodig heeft." />
      </Helmet>

      <main ref={rootRef} className="cinema-bg flex min-h-screen items-center justify-center overflow-hidden px-5 pt-24">
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <span
            data-404
            className="block font-heading text-[clamp(7rem,26vw,18rem)] font-black leading-none tracking-[-.06em] gradient-text-full"
          >
            404
          </span>
          <h1 data-404 className="display-xl mt-2 text-3xl md:text-5xl">Pagina niet gevonden</h1>
          <p data-404 className="mx-auto mt-5 max-w-lg text-base leading-8 text-slate-400">
            De pagina die u zoekt bestaat niet of is verplaatst. Geen zorgen, we helpen u graag verder.
          </p>

          <div data-404 className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/" className="glow-button">
              <Home size={16} /> Naar homepage
            </Link>
            <button type="button" onClick={() => window.history.back()} className="ghost-button">
              <ArrowLeft size={16} /> Ga terug
            </button>
          </div>

          <div data-404 className="mt-14 border-t border-[rgba(140,214,255,.12)] pt-10">
            <p className="mono mb-4 text-xs uppercase tracking-[.24em] text-slate-500">Populaire paginas</p>
            <div className="flex flex-wrap justify-center gap-3">
              {QUICK_LINKS.map(([href, label]) => (
                <Link key={href} to={href} className="holo-tag transition hover:border-[var(--accent)]">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default NotFoundPage;

import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Home, ArrowLeft } from 'lucide-react';

const QUICK_LINKS = [
  ['/portfolio', 'Portfolio'],
  ['/diensten',  'Diensten'],
  ['/over-ons',  'Over Ons'],
  ['/contact',   'Contact'],
];

const NotFoundPage = () => {
  const rootRef = useRef(null);
  const scanRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('[data-404]',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }
      );

      /* Scanline sweep */
      if (scanRef.current) {
        gsap.fromTo(scanRef.current,
          { y: '-100%', opacity: 0 },
          { y: '200%', opacity: 0.25, duration: 4, repeat: -1, ease: 'none', delay: 1.5 }
        );
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>404 - Pagina Niet Gevonden | Vos Web Designs</title>
        <meta name="description" content="Deze pagina bestaat niet. Ga terug naar de homepage of neem contact op als u hulp nodig heeft." />
      </Helmet>

      <main
        ref={rootRef}
        className="cinema-bg relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-24"
      >
        {/* Background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(140,214,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(140,214,255,.06) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)',
          }}
          aria-hidden="true"
        />
        {/* Scanline */}
        <div className="pointer-events-none absolute inset-x-0 overflow-hidden" style={{ top: 0, bottom: 0 }} aria-hidden="true">
          <div
            ref={scanRef}
            className="absolute left-0 right-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(140,214,255,.6), transparent)' }}
          />
        </div>
        {/* Radial glows */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(14,165,233,.1),transparent)]" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          {/* Corner brackets */}
          <div className="pointer-events-none absolute -top-8 -left-8 h-8 w-8 border-l border-t border-[rgba(140,214,255,.3)]" aria-hidden="true" />
          <div className="pointer-events-none absolute -top-8 -right-8 h-8 w-8 border-r border-t border-[rgba(214,245,122,.3)]" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-8 w-8 border-b border-l border-[rgba(140,214,255,.3)]" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-8 -right-8 h-8 w-8 border-b border-r border-[rgba(214,245,122,.3)]" aria-hidden="true" />

          {/* HUD label */}
          <div data-404 className="flex items-center justify-center gap-2.5 mb-4">
            <span className="status-dot" />
            <span className="hud-label">Sys.error — route niet gevonden</span>
          </div>

          {/* Big 404 */}
          <span
            data-404
            className="block font-heading text-[clamp(7rem,26vw,18rem)] font-black leading-none tracking-[-.06em] gradient-text-full select-none"
          >
            404
          </span>

          <h1 data-404 className="display-xl mt-2 text-3xl md:text-5xl">
            Pagina niet gevonden
          </h1>
          <p data-404 className="mx-auto mt-5 max-w-lg text-base leading-8 text-slate-400">
            De pagina die u zoekt bestaat niet of is verplaatst. Geen zorgen, we helpen u graag verder.
          </p>

          <div data-404 className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/" className="glow-button">
              <Home size={15} /> Naar homepage
            </Link>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="ghost-button"
            >
              <ArrowLeft size={15} /> Ga terug
            </button>
          </div>

          <div data-404 className="mt-14 border-t border-[rgba(140,214,255,.12)] pt-10">
            <p className="hud-label mb-5 block">Populaire paginas</p>
            <div className="flex flex-wrap justify-center gap-3">
              {QUICK_LINKS.map(([href, label]) => (
                <Link
                  key={href}
                  to={href}
                  className="holo-tag transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
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

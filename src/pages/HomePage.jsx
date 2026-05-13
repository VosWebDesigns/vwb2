import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, CheckCircle, Quote, TrendingUp, Users, Zap } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import SmartImage from '@/components/SmartImage';

const logSupabaseError = (label, error) => {
  if (!error) return;
  console.error(label, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });
};

const TESTIMONIAL_PREVIEW_LENGTH = 260;
const HOME_PROJECT_SELECT = 'id,title,short_description,description,hero_image,live_url,featured_preview_image,home_featured,is_featured,created_at,categories(name)';

const getTestimonialText = testimonial => {
  const text = testimonial?.text?.trim();
  return text || 'Reviewtekst ontbreekt';
};

const TestimonialCard = ({ testimonial, featured = false, animate }) => {
  const [expanded, setExpanded] = useState(false);
  const text = getTestimonialText(testimonial);
  const isMissingText = !testimonial?.text?.trim();
  const shouldClamp = text.length > TESTIMONIAL_PREVIEW_LENGTH;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      className={`panel cut ${featured ? 'p-7 md:p-10' : 'p-6'}`}
    >
      <Quote className={`${featured ? 'mb-5 h-9 w-9' : 'mb-4 h-7 w-7'} text-[color:var(--accent2)]`} aria-hidden="true" />
      <p
        className={`whitespace-pre-line text-slate-200 ${featured ? 'text-lg leading-8 md:text-xl' : 'text-[15px] leading-relaxed'} ${isMissingText ? 'text-slate-500' : ''} ${shouldClamp && !expanded ? 'line-clamp-6' : ''}`}
      >
        {text}
      </p>
      {shouldClamp && (
        <button
          type="button"
          onClick={() => setExpanded(current => !current)}
          className="mt-4 text-sm font-bold uppercase tracking-[.18em] text-[color:var(--accent2)] transition hover:text-white"
          aria-expanded={expanded}
        >
          {expanded ? 'Minder tonen' : 'Lees meer'}
        </button>
      )}
      <figcaption className={`${featured ? 'mt-6 text-sm' : 'mt-5 text-xs'} uppercase tracking-[.18em] text-[color:var(--accent)]`}>
        {testimonial?.name || 'Anonieme klant'}{testimonial?.company ? ` — ${testimonial.company}` : ''}
      </figcaption>
    </motion.figure>
  );
};

const HomePage = () => {
  const uspRef = useRef(null);
  const projectsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const uspInView = useInView(uspRef, { once: true, margin: '-100px' });
  const projectsInView = useInView(projectsRef, { once: true, margin: '-100px' });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: '-100px' });

  const [projects, setProjects] = useState([]);
  const [previewProject, setPreviewProject] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchHomeData = async () => {
      setLoading(true);

      const { data: homeFeaturedData, error: homeFeaturedError } = await supabase
        .from('projects')
        .select(HOME_PROJECT_SELECT)
        .or('is_published.is.null,is_published.eq.true')
        .eq('home_featured', true)
        .order('created_at', { ascending: false })
        .limit(1);

      logSupabaseError('HOME_FEATURED_PREVIEW_ERROR', homeFeaturedError);

      const { data: featuredData, error: featuredError } = await supabase
        .from('projects')
        .select(HOME_PROJECT_SELECT)
        .or('is_published.is.null,is_published.eq.true')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      logSupabaseError('HOME_FEATURED_PROJECTS_ERROR', featuredError);

      let projectData = featuredData || [];
      if (!featuredError && projectData.length === 0) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('projects')
          .select(HOME_PROJECT_SELECT)
          .or('is_published.is.null,is_published.eq.true')
          .order('created_at', { ascending: false })
          .limit(3);

        logSupabaseError('HOME_PROJECTS_FALLBACK_ERROR', fallbackError);
        projectData = fallbackData || [];
      }

      const selectedPreviewProject = homeFeaturedData?.[0] || projectData.find(project => project.is_featured) || null;

      const { data: testimonialData, error: testimonialError } = await supabase
        .from('testimonials')
        .select('id,name,company,text,rating,is_visible,sort_order,created_at')
        .or('is_visible.is.null,is_visible.eq.true')
        .order('sort_order', { ascending: true })
        .limit(3);

      logSupabaseError('TESTIMONIALS_FETCH_ERROR', testimonialError);

      if (mounted) {
        setProjects(projectData);
        setPreviewProject(selectedPreviewProject);
        setTestimonials(testimonialData || []);
        setLoading(false);
      }
    };

    fetchHomeData();
    return () => { mounted = false; };
  }, []);

  const previewImage = previewProject?.featured_preview_image || previewProject?.hero_image;
  const smallTestimonials = useMemo(() => testimonials.slice(1, 3), [testimonials]);

  const usps = [
    { icon: <Zap size={28} />, title: 'Razendsnelle Websites', description: 'Geoptimaliseerd voor snelheid en prestaties. Onze websites laden in minder dan 2 seconden.' },
    { icon: <Award size={28} />, title: 'Sterk Design', description: 'Moderne designs die uw merk naar een hoger niveau tillen en conversies verhogen.' },
    { icon: <Users size={28} />, title: 'Persoonlijke Service', description: 'Directe communicatie met uw dedicated designer. Geen tussenpersonen, alleen resultaten.' },
    { icon: <TrendingUp size={28} />, title: 'Bewezen ROI', description: 'Onze websites genereren gemiddeld 3x meer conversies dan standaard websites.' },
  ];

  return (
    <>
      <Helmet>
        <title>Vos Web Designs - Webdesign & Ontwikkeling in Nederland</title>
        <meta name="description" content="Luxe webdesign voor ambitieuze bedrijven. Wij creëren websites die converteren en uw merk laten groeien." />
      </Helmet>

      <main className="cinema-bg overflow-hidden pt-24">
        <section className="cinematic-section min-h-[calc(100svh-6rem)] flex items-center">
          <div className="cinematic-container relative z-10 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <p className="eyebrow">Webdesign bureau</p>
              <h1 className="display-title mt-5 text-[clamp(3.4rem,8vw,7.7rem)]">Websites die uw <span className="gradient-text">bedrijf laten groeien</span></h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">Wij ontwikkelen luxe, conversie-gerichte websites voor ambitieuze bedrijven in Nederland.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link to="/portfolio" className="cta-link">Bekijk ons portfolio <ArrowRight size={18} /></Link>
                <Link to="/contact" className="ghost-link">Plan een gesprek</Link>
              </div>
            </motion.div>

            <motion.aside initial={{ opacity: 0, y: 36, rotate: 1 }} animate={{ opacity: 1, y: 0, rotate: -1 }} transition={{ duration: 0.8, delay: 0.15 }} className="panel cut relative p-4 md:p-6">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[color:var(--accent)]/20 blur-3xl" />
              <div className="flex items-center justify-between pb-4 text-xs font-bold uppercase tracking-[.18em] text-slate-400">
                <span>Featured preview</span><span className="text-[color:var(--accent2)]">Live uit Supabase</span>
              </div>
              <div className="overflow-hidden rounded-[1.4rem] border border-[color:var(--stroke)] bg-slate-950">
                {previewImage ? <SmartImage src={previewImage} alt={previewProject.title} className="h-[300px] w-full object-cover md:h-[430px]" loading="eager" fetchPriority="high" /> : <div className="grid h-[300px] place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(140,214,255,.22),transparent_35%),#07111f] p-8 text-center text-slate-400 md:h-[430px]">{loading ? 'Project laden…' : 'Nog geen uitgelicht project. Voeg er één toe in de admin.'}</div>}
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="eyebrow">{previewProject?.categories?.name || 'Maatwerk'}</p>
                  <h2 className="mt-2 font-heading text-3xl font-black tracking-[-.05em]">{previewProject?.title || 'Klaar voor de eerste case'}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-300">{previewProject?.short_description || 'Projecten uit Supabase verschijnen hier automatisch zodra ze gepubliceerd zijn.'}</p>
                </div>
                {previewProject ? (
                  <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                    {previewProject.live_url && (
                      <a href={previewProject.live_url} target="_blank" rel="noopener noreferrer" className="cta-link whitespace-nowrap">Bekijk live website</a>
                    )}
                    <Link to={`/portfolio/${previewProject.id}`} className="ghost-link whitespace-nowrap">Open case</Link>
                  </div>
                ) : <Link to="/contact" className="ghost-link whitespace-nowrap">Start project</Link>}
              </div>
            </motion.aside>
          </div>
        </section>

        <section ref={uspRef} className="cinematic-section">
          <div className="cinematic-container relative z-10">
            <div className="max-w-3xl">
              <p className="eyebrow">Waarom Vos Web Designs</p>
              <h2 className="display-title mt-4 text-5xl md:text-7xl">Geen kaartenbak, maar een zig-zag van voordelen.</h2>
            </div>
            <div className="zig-rail mt-12">
              {usps.map((usp, index) => (
                <motion.article key={usp.title} initial={{ opacity: 0, y: 28 }} animate={uspInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: index * 0.08 }} className="zig-item panel cut p-6 md:p-8">
                  <span className="zig-dot" />
                  <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-[color:var(--stroke)] text-[color:var(--accent)]">{usp.icon}</div>
                  <h3 className="font-heading text-2xl font-black tracking-[-.04em]">{usp.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{usp.description}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section ref={projectsRef} className="cinematic-section">
          <div className="cinematic-container relative z-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div><p className="eyebrow">Uitgelichte projecten</p><h2 className="display-title mt-4 text-5xl md:text-7xl">Stacked deck cases.</h2></div>
              <Link to="/portfolio" className="ghost-link">Alle projecten <ArrowRight size={18} /></Link>
            </div>
            {projects.length === 0 ? (
              <div className="panel cut mt-10 p-8 text-center text-slate-300">Nog geen projecten gevonden. Voeg projecten toe in Supabase of <Link to="/contact" className="text-[color:var(--accent)]">start uw eerste case</Link>.</div>
            ) : (
              <div className="mt-10 grid gap-6 lg:grid-cols-3">
                {projects.map((project, index) => (
                  <motion.article key={project.id} initial={{ opacity: 0, y: 30 }} animate={projectsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: index * 0.1 }} className="deck-card panel cut overflow-hidden">
                    <Link to={`/portfolio/${project.id}`}>
                      <div className="aspect-[4/3] bg-slate-950">{project.hero_image ? <SmartImage src={project.hero_image} alt={project.title} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-slate-500">Geen afbeelding</div>}</div>
                      <div className="p-6">
                        <p className="eyebrow">{project.categories?.name || 'Project'}</p>
                        <h3 className="mt-3 font-heading text-3xl font-black tracking-[-.05em]">{project.title}</h3>
                        <p className="mt-3 line-clamp-3 text-slate-300">{project.short_description || project.description || 'Bekijk deze case uit het portfolio.'}</p>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        <section ref={testimonialsRef} className="cinematic-section">
          <div className="cinematic-container relative z-10">
            <p className="eyebrow">Testimonials</p>
            <h2 className="display-title mt-4 text-5xl md:text-7xl">Quote wall.</h2>
            {testimonials.length === 0 ? (
              <div className="panel cut mt-10 p-8 text-slate-300">Nog geen testimonials zichtbaar. Zodra reviews in Supabase gepubliceerd zijn, verschijnen ze hier compact.</div>
            ) : (
              <div className="quote-wall mt-10">
                <TestimonialCard testimonial={testimonials[0]} featured animate={testimonialsInView} />
                {smallTestimonials.map((item) => (
                  <TestimonialCard key={item.id || item.name} testimonial={item} animate={testimonialsInView} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="cinematic-section">
          <div className="cinematic-container panel cut relative z-10 p-8 text-center md:p-12">
            <CheckCircle className="mx-auto mb-5 text-[color:var(--accent2)]" />
            <h2 className="display-title text-5xl md:text-7xl">Klaar om professioneel te groeien?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-slate-300">Plan vrijblijvend een kennismaking en ontdek welke website past bij uw doelen.</p>
            <Link to="/contact" className="cta-link mt-8">Start vandaag nog</Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePage;

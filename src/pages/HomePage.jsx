import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { ArrowRight, Zap, Award, Users, TrendingUp, Star } from 'lucide-react';

const safeReveal = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

const logSupabaseError = (label, error) => {
  if (!error) return;

  console.error(label, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });
};

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchHomeData = async () => {
      try {
        const { data: featuredProjects, error: featuredProjectsError } = await supabase
          .from('projects')
          .select('*, categories(name)')
          .or('is_published.is.null,is_published.eq.true')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(3);

        logSupabaseError('HOME_FEATURED_PROJECTS_FETCH_ERROR', featuredProjectsError);

        let projectsData = featuredProjects || [];

        if (projectsData.length === 0) {
          const { data: fallbackProjects, error: fallbackProjectsError } = await supabase
            .from('projects')
            .select('*, categories(name)')
            .or('is_published.is.null,is_published.eq.true')
            .order('created_at', { ascending: false })
            .limit(3);

          logSupabaseError('HOME_PROJECTS_FALLBACK_FETCH_ERROR', fallbackProjectsError);
          projectsData = fallbackProjects || [];
        }

        if (isMounted) setProjects(projectsData);

        const { data: testData, error: testimonialsError } = await supabase
          .from('testimonials')
          .select('*')
          .or('is_visible.is.null,is_visible.eq.true')
          .order('sort_order', { ascending: true })
          .limit(3);

        logSupabaseError('HOME_TESTIMONIALS_FETCH_ERROR', testimonialsError);

        if (isMounted) setTestimonials(testData || []);
      } catch (error) {
        console.error('HOME_DATA_FETCH_ERROR', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
      }
    };

    fetchHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const usps = [
    { icon: <Zap size={32} />, title: 'Razendsnelle Websites', description: 'Geoptimaliseerd voor snelheid en prestaties. Onze websites laden in minder dan 2 seconden.' },
    { icon: <Award size={32} />, title: 'Professioneel Design', description: 'Luxe, moderne designs die uw merk naar een hoger niveau tillen en conversies verhogen.' },
    { icon: <Users size={32} />, title: 'Persoonlijke Service', description: 'Directe communicatie met uw dedicated designer. Geen tussenpersonen, alleen resultaten.' },
    { icon: <TrendingUp size={32} />, title: 'Bewezen ROI', description: 'Onze websites genereren gemiddeld 3x meer conversies dan standaard websites.' },
  ];

  return (
    <>
      <Helmet>
        <title>Vos Web Designs - Professioneel Webdesign & Ontwikkeling in Nederland</title>
        <meta name="description" content="Luxe webdesign voor ambitieuze bedrijven. Wij creëren websites die converteren en uw merk laten groeien." />
      </Helmet>

      <main className="overflow-x-hidden bg-[#0f172a] text-white">
        {/* Hero Section */}
        <section className="relative flex min-h-screen min-h-[100svh] items-center justify-center overflow-hidden px-4 pb-16 pt-28 sm:pt-24">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#0f172a]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
            <div className="absolute left-[-5rem] top-20 h-72 w-72 rounded-full bg-[#38bdf8] blur-[128px] sm:left-10" />
            <div className="absolute bottom-20 right-[-6rem] h-96 w-96 rounded-full bg-[#38bdf8] blur-[128px] sm:right-10" />
          </div>

          <div className="container relative z-10 mx-auto">
            <div className="mx-auto max-w-4xl text-center">
              <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <span className="mb-6 inline-block rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-4 py-2 text-sm font-medium text-[#38bdf8]">
                  Professioneel Webdesign Bureau
                </span>
              </motion.div>
              <motion.h1 initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="mb-6 text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">
                Websites Die Uw <span className="bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] bg-clip-text text-transparent">Bedrijf Laten Groeien</span>
              </motion.h1>
              <motion.p initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">
                Wij ontwikkelen luxe, conversie-gerichte websites voor ambitieuze bedrijven in Nederland.
              </motion.p>
              <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link to="/portfolio"><Button size="lg" className="bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] px-8 py-6 text-lg text-black transition-opacity hover:opacity-90">Bekijk Ons Portfolio <ArrowRight className="ml-2" size={20} /></Button></Link>
                <Link to="/contact"><Button size="lg" variant="outline" className="border-[#38bdf8] px-8 py-6 text-lg text-[#38bdf8] hover:bg-[#38bdf8]/10">Plan een Gesprek</Button></Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* USP Section */}
        <section className="bg-[#0b1120] py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {usps.map((usp, index) => (
                <motion.div key={usp.title} initial={false} variants={safeReveal} whileInView="visible" viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, delay: index * 0.08 }} className="group rounded-2xl border border-gray-800 bg-[#111827] p-8 transition-colors hover:border-[#38bdf8]">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r from-[#38bdf8]/10 to-[#60a5fa]/10 text-[#38bdf8] transition-transform group-hover:scale-110">{usp.icon}</div>
                  <h3 className="mb-3 text-xl font-bold">{usp.title}</h3>
                  <p className="leading-relaxed text-gray-400">{usp.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="bg-[#0f172a] py-24">
          <div className="container mx-auto px-4">
            <motion.div initial={false} variants={safeReveal} whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">Onze <span className="bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] bg-clip-text text-transparent">Uitgelichte Projecten</span></h2>
            </motion.div>
            <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <motion.div key={project.id} initial={false} variants={safeReveal} whileInView="visible" viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                  <Link to={`/portfolio/${project.id}`}>
                    <div className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-[#111827] transition-all duration-300 hover:border-[#38bdf8]">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt={project.title} src={project.hero_image || 'https://images.unsplash.com/photo-1572177812156-58036aae439c'} />
                      </div>
                      <div className="p-6">
                        <span className="mb-3 inline-block rounded-full bg-[#38bdf8]/10 px-3 py-1 text-xs font-medium text-[#38bdf8]">{project.categories?.name}</span>
                        <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-[#38bdf8]">{project.title}</h3>
                        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-400">{project.short_description}</p>
                        <div className="flex items-center text-sm font-medium text-[#38bdf8]">Bekijk Project <ArrowRight className="ml-2 transition-transform group-hover:translate-x-2" size={16} /></div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-[#0b1120] py-24">
          <div className="container mx-auto px-4">
            <motion.div initial={false} variants={safeReveal} whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">Wat Onze <span className="bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] bg-clip-text text-transparent">Klanten Zeggen</span></h2>
            </motion.div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div key={`${testimonial.name}-${index}`} initial={false} variants={safeReveal} whileInView="visible" viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, delay: index * 0.1 }} className="rounded-2xl border border-gray-800 bg-[#111827] p-8 transition-colors hover:border-[#38bdf8]">
                  <div className="mb-4 flex gap-1">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} size={20} fill="#38bdf8" className="text-[#38bdf8]" />))}</div>
                  <p className="mb-6 italic leading-relaxed text-gray-300">&quot;{testimonial.text}&quot;</p>
                  <div><span className="font-bold text-white">{testimonial.name}</span><p className="text-sm text-gray-400">{testimonial.company}</p></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePage;

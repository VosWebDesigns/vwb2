
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { ArrowRight, Zap, Award, Users, TrendingUp, Star, CheckCircle } from 'lucide-react';

const HomePage = () => {
  const heroRef = useRef(null);
  const uspRef = useRef(null);
  const projectsRef = useRef(null);
  const testimonialsRef = useRef(null);

  const uspInView = useInView(uspRef, { once: true, margin: '-100px' });
  const projectsInView = useInView(projectsRef, { once: true, margin: '-100px' });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: '-100px' });

  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      // Fetch Featured Projects
      const { data: projData } = await supabase
        .from('projects')
        .select('*, categories(name)')
        .eq('is_published', true)
        .eq('is_featured', true)
        .limit(3);
      
      if (projData) setProjects(projData);

      // Fetch Testimonials
      const { data: testData } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true })
        .limit(3);

      if (testData) setTestimonials(testData);
    };
    
    fetchHomeData();
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

      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#0f172a]" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#38bdf8] rounded-full filter blur-[128px]" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#38bdf8] rounded-full filter blur-[128px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <span className="inline-block px-4 py-2 bg-[#38bdf8]/10 border border-[#38bdf8]/30 rounded-full text-[#38bdf8] text-sm font-medium mb-6">
                  Professioneel Webdesign Bureau
                </span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Websites Die Uw <span className="bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] bg-clip-text text-transparent">Bedrijf Laten Groeien</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                Wij ontwikkelen luxe, conversie-gerichte websites voor ambitieuze bedrijven in Nederland.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/portfolio"><Button size="lg" className="bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] text-black hover:opacity-90 transition-opacity text-lg px-8 py-6">Bekijk Ons Portfolio <ArrowRight className="ml-2" size={20} /></Button></Link>
                <Link to="/contact"><Button size="lg" variant="outline" className="border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8]/10 text-lg px-8 py-6">Plan een Gesprek</Button></Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* USP Section */}
        <section ref={uspRef} className="py-24 bg-[#0b1120]">
          <div className="container mx-auto px-4">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {usps.map((usp, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={uspInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.1 }} className="bg-[#111827] border border-gray-800 rounded-2xl p-8 hover:border-[#38bdf8] transition-colors group">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#38bdf8]/10 to-[#60a5fa]/10 rounded-xl flex items-center justify-center mb-6 text-[#38bdf8] group-hover:scale-110 transition-transform">{usp.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{usp.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{usp.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section ref={projectsRef} className="py-24 bg-[#0f172a]">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={projectsInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Onze <span className="bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] bg-clip-text text-transparent">Uitgelichte Projecten</span></h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {projects.map((project, index) => (
                <motion.div key={project.id} initial={{ opacity: 0, y: 30 }} animate={projectsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.15 }}>
                  <Link to={`/portfolio/${project.id}`}>
                    <div className="group relative overflow-hidden rounded-2xl bg-[#111827] border border-gray-800 hover:border-[#38bdf8] transition-all duration-300">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={project.title} src={project.hero_image || "https://images.unsplash.com/photo-1572177812156-58036aae439c"} />
                      </div>
                      <div className="p-6">
                        <span className="inline-block px-3 py-1 bg-[#38bdf8]/10 text-[#38bdf8] text-xs font-medium rounded-full mb-3">{project.categories?.name}</span>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-[#38bdf8] transition-colors">{project.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">{project.short_description}</p>
                        <div className="flex items-center text-[#38bdf8] text-sm font-medium">Bekijk Project <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={16} /></div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section ref={testimonialsRef} className="py-24 bg-[#0b1120]">
          <div className="container mx-auto px-4">
             <motion.div initial={{ opacity: 0, y: 30 }} animate={testimonialsInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Wat Onze <span className="bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] bg-clip-text text-transparent">Klanten Zeggen</span></h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={testimonialsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.15 }} className="bg-[#111827] border border-gray-800 rounded-2xl p-8 hover:border-[#38bdf8] transition-colors">
                  <div className="flex gap-1 mb-4">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} size={20} fill="#38bdf8" className="text-[#38bdf8]" />))}</div>
                  <p className="text-gray-300 leading-relaxed mb-6 italic">"{testimonial.text}"</p>
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

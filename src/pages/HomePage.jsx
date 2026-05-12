import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BlueprintCanvas from '@/components/public/BlueprintCanvas';
import CaseRail from '@/components/public/CaseRail';
import ProcessSchematics from '@/components/public/ProcessSchematics';
import TestimonialStrips from '@/components/public/TestimonialStrips';
import { getPublishedProjects, getVisibleTestimonials } from '@/lib/api/publicContent';

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      getPublishedProjects({ featuredOnly: true, limit: 6 }),
      getVisibleTestimonials({ limit: 5 }),
    ]).then(([projectData, testimonialData]) => {
      if (mounted) {
        setProjects(projectData);
        setTestimonials(testimonialData);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <>
      <Helmet>
        <title>Vos Web Designs — The Blueprint Atelier</title>
        <meta name="description" content="Blueprint Atelier voor maatwerk websites, Supabase CMS en conversiegerichte digitale systemen." />
      </Helmet>
      <main>
        <BlueprintCanvas />
        <CaseRail projects={projects} />
        <ProcessSchematics />
        <TestimonialStrips testimonials={testimonials} />
        <section className="px-5 pb-24 md:px-10 lg:pl-28">
          <div className="mx-auto max-w-[1500px] border border-[color:var(--accent)]/45 bg-[color:var(--panel)] p-8 md:p-14">
            <p className="mono text-xs uppercase tracking-[.3em] text-[color:var(--accent)]">start a build</p>
            <div className="mt-6 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <h2 className="text-5xl font-black uppercase leading-[.85] tracking-[-.06em] md:text-8xl">Leg uw volgende website op de tekentafel.</h2>
              <Link to="/contact" className="blueprint-button whitespace-nowrap">Open intake sheet</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePage;

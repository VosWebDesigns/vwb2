import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Target, Lightbulb, Users } from 'lucide-react';

const AboutPage = () => {
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: '-100px' });
  const teamInView = useInView(teamRef, { once: true, margin: '-100px' });

  /* ================= VALUES ================= */

  const values = [
    {
      icon: <Heart size={32} />,
      title: 'Passie voor Kwaliteit',
      description:
        'Elk project behandelen we met maximale aandacht voor detail. Geen snelle oplossingen, maar duurzaam vakwerk.',
    },
    {
      icon: <Target size={32} />,
      title: 'Resultaatgericht',
      description:
        'Design en techniek zijn middelen. Het doel is groei, conversie en meetbaar resultaat.',
    },
    {
      icon: <Lightbulb size={32} />,
      title: 'Innovatie',
      description:
        'We werken uitsluitend met moderne technologieën en blijven continu verbeteren.',
    },
    {
      icon: <Users size={32} />,
      title: 'Persoonlijk',
      description:
        'Direct contact, korte lijnen en één aanspreekpunt. Geen ruis, geen tussenlagen.',
    },
  ];

  /* ================= TEAM (1 PERSON) ================= */

  const team = [
    {
      name: 'Melvin Vos',
      role: 'Founder & Lead Developer',
      image: '/logo.jpeg',
      bio: 'Met een sterke focus op performance, schaalbaarheid en design bouw ik professionele websites en webapplicaties die bedrijven écht verder helpen.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Over Ons - Vos Web Designs</title>
        <meta
          name="description"
          content="Leer Vos Web Designs kennen. Persoonlijk, resultaatgericht en gebouwd op moderne technologie."
        />
      </Helmet>

      <main className="pt-24 pb-16 bg-[#0f172a]">
        {/* HERO */}
        <section className="py-16 bg-gradient-to-b from-[#0f172a] to-[#0b1120]">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Over{' '}
                <span className="bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] bg-clip-text text-transparent">
                  Vos Web Designs
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Eén specialist. Volledige focus. Maximale kwaliteit.
              </p>
            </motion.div>
          </div>
        </section>

        {/* STORY */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Mijn Verhaal</h2>
                <p className="text-gray-300 mb-4">
                  Vos Web Designs is opgericht vanuit de frustratie over trage,
                  generieke websites zonder resultaat.
                </p>
                <p className="text-gray-300 mb-4">
                  Mijn focus ligt op maatwerk: snelle websites, sterke
                  gebruikerservaring en code die klopt.
                </p>
                <p className="text-gray-300">
                  Geen templates, geen ruis. Alleen oplossingen die werken.
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-gray-800">
                <img
                  src="/werk.png"
                  alt="Werkplek Vos Web Designs"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section ref={valuesRef} className="py-16 bg-[#0b1120]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold">
                Onze{' '}
                <span className="bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] bg-clip-text text-transparent">
                  Waarden
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-[#111827] border border-gray-800 rounded-2xl p-6 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section ref={teamRef} className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">
                Wie Zit Er{' '}
                <span className="bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] bg-clip-text text-transparent">
                  Achter?
                </span>
              </h2>
            </motion.div>

            {team.map((member) => (
              <div
                key={member.name}
                className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold">{member.name}</h3>
                  <p className="text-[#38bdf8] font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-400">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#0b1120] text-center">
          <h2 className="text-3xl font-bold mb-6">
            Klaar om samen te werken?
          </h2>
          <Link to="/contact">
            <Button size="lg" className="bg-[#38bdf8] text-black">
              Neem Contact Op
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </section>
      </main>
    </>
  );
};

export default AboutPage;
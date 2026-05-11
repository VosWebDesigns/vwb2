import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    package: '',
    message: '',
    company_website: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
  e.preventDefault();

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('CONTACT_FORM_ERROR', { status: res.status, body: errorBody });
      throw new Error("Mail failed");
    }

    toast({
      title: "Bericht Verzonden! ✉️",
      description: "We nemen binnen 24 uur contact met u op.",
      duration: 5000
    });

    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      service: '',
      package: '',
      message: '',
      company_website: ''
    });

  } catch (error) {
    console.error('CONTACT_FORM_SUBMIT_ERROR', error);
    toast({
      title: "Fout",
      description: "Er ging iets mis bij het verzenden.",
      variant: "destructive"
    });
  }
};

  return (
    <>
      <Helmet>
        <title>Contact - Vos Web Designs | Neem Contact Op</title>
        <meta
          name="description"
          content="Klaar om uw project te starten? Neem contact op met Vos Web Designs. We beantwoorden al uw vragen en plannen graag een vrijblijvend gesprek."
        />
      </Helmet>

      <main className="pt-24 pb-16">
        <section className="py-16 bg-gradient-to-b from-[#0f172a] to-[#0b1120]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Laten We{' '}
                <span className="bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] bg-clip-text text-transparent">
                  In Gesprek Gaan
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Heeft u een project in gedachten? We horen graag over uw plannen en uitdagingen
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 bg-[#0f172a]">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">

              {/* INFO CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-[#111827] border border-gray-800 rounded-2xl p-8 text-center hover:border-[#38bdf8] transition-colors"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-[#38bdf8]/10 to-[#60a5fa]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#38bdf8]">
                    <Mail size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Email</h3>
                  <a href="mailto:info@voswebdesigns.nl" className="text-gray-300 hover:text-[#38bdf8] transition-colors">
                    info@voswebdesigns.nl
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-[#111827] border border-gray-800 rounded-2xl p-8 text-center hover:border-[#38bdf8] transition-colors"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-[#38bdf8]/10 to-[#60a5fa]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#38bdf8]">
                    <Phone size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Telefoon</h3>
                  <a href="tel:+31648608336" className="text-gray-300 hover:text-[#38bdf8] transition-colors">
                    +31 6 4860 8336
                  </a>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-[#111827] border border-gray-800 rounded-2xl p-8 text-center hover:border-[#38bdf8] transition-colors"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-[#38bdf8]/10 to-[#60a5fa]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#38bdf8]">
                    <MapPin size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Locatie</h3>
                  <p className="text-gray-300">Lelystad, Nederland</p>
                </motion.div>
              </div>

              {/* FORM + INFO */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-3xl font-bold mb-6">Stuur Een Bericht</h2>

                  <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="company_website">Website</label>
                      <input
                        id="company_website"
                        name="company_website"
                        value={formData.company_website}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    {/* Naam + Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Naam *</label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-[#111827] border border-gray-800 rounded-lg focus:border-[#38bdf8] focus:outline-none transition-colors text-white"
                          placeholder="Uw naam"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-[#111827] border border-gray-800 rounded-lg focus:border-[#38bdf8] focus:outline-none transition-colors text-white"
                          placeholder="uw@email.nl"
                        />
                      </div>
                    </div>

                    {/* Telefoon + Bedrijf */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Telefoon</label>
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#111827] border border-gray-800 rounded-lg focus:border-[#38bdf8] focus:outline-none transition-colors text-white"
                          placeholder="+31 6 12345678"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Bedrijf</label>
                        <input
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#111827] border border-gray-800 rounded-lg focus:border-[#38bdf8] focus:outline-none transition-colors text-white"
                          placeholder="Uw bedrijf"
                        />
                      </div>
                    </div>

                    {/* Dienst + Pakket */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Interesse In</label>
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#111827] border border-gray-800 rounded-lg focus:border-[#38bdf8] focus:outline-none transition-colors text-white"
                        >
                          <option value="">Selecteer een dienst</option>
                          <option value="webdesign">Webdesign</option>
                          <option value="development">Webontwikkeling</option>
                          <option value="ecommerce">E-commerce</option>
                          <option value="seo">SEO & Marketing</option>
                          <option value="other">Anders</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Pakket</label>
                        <select
                          name="package"
                          value={formData.package}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#111827] border border-gray-800 rounded-lg focus:border-[#38bdf8] focus:outline-none transition-colors text-white"
                        >
                          <option value="">Selecteer pakket</option>
                          <option value="Starter">Starter</option>
                          <option value="Groei">Groei</option>
                          <option value="Pro">Pro</option>
                        </select>
                      </div>
                    </div>

                    {/* Bericht */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Bericht *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-[#111827] border border-gray-800 rounded-lg focus:border-[#38bdf8] focus:outline-none transition-colors text-white resize-none"
                        placeholder="Vertel ons over uw project..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] text-black hover:opacity-90 transition-opacity"
                    >
                      Verstuur Bericht
                      <Send className="ml-2" size={20} />
                    </Button>
                  </form>
                </motion.div>

                {/* INFO RIGHT */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="lg:sticky lg:top-28"
                >
                  <div className="bg-gradient-to-br from-[#111827] to-[#0b1120] border border-gray-800 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold mb-6">Wat Kunt U Verwachten?</h3>

                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-[#38bdf8]/10 rounded-full flex items-center justify-center">
                          <span className="text-[#38bdf8] font-bold">1</span>
                        </div>
                        <div>
                          <span className="font-semibold block mb-1">Snelle Reactie</span>
                          <p className="text-gray-400 text-sm">We reageren binnen 24 uur op uw bericht</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-[#38bdf8]/10 rounded-full flex items-center justify-center">
                          <span className="text-[#38bdf8] font-bold">2</span>
                        </div>
                        <div>
                          <span className="font-semibold block mb-1">Kennismakingsgesprek</span>
                          <p className="text-gray-400 text-sm">Een vrijblijvend gesprek over uw project en wensen</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-[#38bdf8]/10 rounded-full flex items-center justify-center">
                          <span className="text-[#38bdf8] font-bold">3</span>
                        </div>
                        <div>
                          <span className="font-semibold block mb-1">Offerte op Maat</span>
                          <p className="text-gray-400 text-sm">Een gedetailleerde offerte afgestemd op uw behoeften</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-[#38bdf8]/10 rounded-full flex items-center justify-center">
                          <span className="text-[#38bdf8] font-bold">4</span>
                        </div>
                        <div>
                          <span className="font-semibold block mb-1">Project Start</span>
                          <p className="text-gray-400 text-sm">Bij akkoord starten we direct met uw project</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-800">
                      <p className="text-gray-400 text-sm">
                        Heeft u vragen over onze diensten, prijzen of werkwijze? We beantwoorden graag al uw vragen.
                      </p>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ContactPage;
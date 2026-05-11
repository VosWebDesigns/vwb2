
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const Footer = () => {
  const { settings, loading } = useSettings();
  const currentYear = new Date().getFullYear();

  // Helper to construct full address
  const fullAddress = [
    settings?.address_street,
    settings?.address_city,
    settings?.address_country
  ].filter(Boolean).join(', ');

  return (
    <footer className="bg-[#0b1120] border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] bg-clip-text text-transparent">
              {settings?.site_name || 'Vos Web Designs'}
            </span>
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">
              {settings?.site_description || 'Professioneel webdesign & ontwikkeling voor ambitieuze bedrijven.'}
            </p>
          </div>

          <div>
            <span className="text-white font-semibold mb-4 block">Snel Navigeren</span>
            <nav className="flex flex-col gap-2">
              <Link to="/portfolio" className="text-gray-400 hover:text-[#38bdf8] transition-colors text-sm">Portfolio</Link>
              <Link to="/diensten" className="text-gray-400 hover:text-[#38bdf8] transition-colors text-sm">Diensten</Link>
              <Link to="/over-ons" className="text-gray-400 hover:text-[#38bdf8] transition-colors text-sm">Over Ons</Link>
              <Link to="/werkwijze" className="text-gray-400 hover:text-[#38bdf8] transition-colors text-sm">Werkwijze</Link>
            </nav>
          </div>

          <div>
            <span className="text-white font-semibold mb-4 block">Contact</span>
            <div className="flex flex-col gap-3">
              {settings?.contact_email && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Mail size={16} className="text-[#38bdf8]" />
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition-colors">{settings.contact_email}</a>
                </div>
              )}
              {settings?.contact_phone && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Phone size={16} className="text-[#38bdf8]" />
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-white transition-colors">{settings.contact_phone}</a>
                </div>
              )}
              {(settings?.address_street || settings?.address_city) && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin size={16} className="text-[#38bdf8]" />
                  <span>{fullAddress}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <span className="text-white font-semibold mb-4 block">Volg Ons</span>
            <div className="flex gap-3">
              {settings?.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#38bdf8] transition-colors">
                  <Facebook size={18} />
                </a>
              )}
              {settings?.social_twitter && (
                <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#38bdf8] transition-colors">
                  <Twitter size={18} />
                </a>
              )}
              {settings?.social_linkedin && (
                <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#38bdf8] transition-colors">
                  <Linkedin size={18} />
                </a>
              )}
              {settings?.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#38bdf8] transition-colors">
                  <Instagram size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© {currentYear} {settings?.site_name || 'Vos Web Designs'}. Alle rechten voorbehouden.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-gray-400 hover:text-[#38bdf8] transition-colors text-sm">Privacybeleid</Link>
            <Link to="/voorwaarden" className="text-gray-400 hover:text-[#38bdf8] transition-colors text-sm">Algemene Voorwaarden</Link>
            <Link to="/login" className="text-gray-600 hover:text-[#38bdf8] transition-colors text-sm">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

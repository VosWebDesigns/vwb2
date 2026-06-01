
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const SettingsContext = createContext();

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    site_name: 'Vos Web Designs',
    site_description: 'Professioneel webdesign & ontwikkeling voor ambitieuze bedrijven.',
    contact_email: 'info@voswebdesigns.nl',
    contact_phone: '',
    website: 'https://www.voswebdesigns.nl',
    logo_url: '/logo.jpeg',
    kvk: '97280410',
    iban: 'NL07 ABNA 0137 6395 54',
    address_street: '',
    address_city: '',
    address_postal_code: '',
    address_country: '',
    social_instagram: '',
    social_linkedin: '',
    social_facebook: '',
    social_twitter: '',
    social_tiktok: '',
    social_youtube: '',
    seo_title: '',
    seo_meta_description: '',
    seo_keywords: '',
    default_payment_term_days: 14,
    default_vat_rate: 21,
    default_quote_validity_days: 14,
    notify_new_project: true,
    notify_new_review: true,
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('SITE_SETTINGS_FETCH_ERROR', { message: error.message, details: error.details, hint: error.hint, code: error.code });
      }

      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('SITE_SETTINGS_UNEXPECTED_ERROR', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = async () => {
    await fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

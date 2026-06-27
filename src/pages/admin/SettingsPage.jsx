import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import {
  Save,
  Loader2,
  Globe,
  Building2,
  Share2,
  Search,
  Bell
} from 'lucide-react';

const SettingsPage = () => {
  const { toast } = useToast();
  const { refreshSettings } = useSettings();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settingsId, setSettingsId] = useState(null);

  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    logo_url: '',

    address_street: '',
    address_city: '',
    address_postal_code: '',
    address_country: '',
    kvk: '',
    iban: '',

    social_instagram: '',
    social_linkedin: '',
    social_facebook: '',
    social_twitter: '',
    social_tiktok: '',
    social_youtube: '',

    seo_meta_description: '',
    seo_keywords: '',
    seo_title: '',
    default_payment_term_days: 14,
    default_vat_rate: 21,
    default_quote_validity_days: 14,

    notify_new_project: true,
    notify_new_review: true,
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setFormData(prev => ({ ...prev, ...data }));
        setSettingsId(data.id);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fout',
        description: 'Kon instellingen niet laden.',
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLERS ================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    setSaving(true);

    try {
      const userRes = await supabase.auth.getUser();
      const userId = userRes?.data?.user?.id || null;

      const dataToSave = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      let error;

      if (settingsId) {
        const { error: updateError } = await supabase
          .from('site_settings')
          .update(dataToSave)
          .eq('id', settingsId);
        error = updateError;
      } else {
        const { data: newData, error: insertError } = await supabase
          .from('site_settings')
          .insert([dataToSave])
          .select()
          .single();

        if (newData) setSettingsId(newData.id);
        error = insertError;
      }

      if (error) throw error;

      /* 🔔 ACTIVITY LOG */
      await supabase.from('activity_log').insert([
        {
          type: 'settings',
          action: 'updated',
          title: 'Website instellingen',
          user_id: userId,
        },
      ]);

      await refreshSettings();

      toast({
        title: 'Succes',
        description: 'Instellingen succesvol opgeslagen.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Fout bij opslaan',
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-[#8cd6ff]" size={32} />
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <Helmet>
        <title>Instellingen - Vos Admin</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Instellingen</h1>
          <p className="text-gray-400 mt-2">
            Beheer je algemene website instellingen.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#8cd6ff] text-black min-w-[140px]"
        >
          {saving ? (
            <Loader2 className="animate-spin mr-2" size={18} />
          ) : (
            <Save className="mr-2" size={18} />
          )}
          Opslaan
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[rgba(12,22,40,0.72)] border border-[rgba(140,214,255,0.12)] w-full justify-start h-auto flex-wrap p-2 gap-2 mb-6 rounded-lg">
          <TabsTrigger 
            value="general"
            className="data-[state=active]:bg-[#8cd6ff] data-[state=active]:text-black text-gray-400"
          >
            <Globe size={16} className="mr-2" />
            Algemeen
          </TabsTrigger>
          <TabsTrigger 
            value="business"
            className="data-[state=active]:bg-[#8cd6ff] data-[state=active]:text-black text-gray-400"
          >
            <Building2 size={16} className="mr-2" />
            Bedrijfsgegevens
          </TabsTrigger>
          <TabsTrigger 
            value="socials"
            className="data-[state=active]:bg-[#8cd6ff] data-[state=active]:text-black text-gray-400"
          >
            <Share2 size={16} className="mr-2" />
            Social Media
          </TabsTrigger>
          <TabsTrigger 
            value="seo"
            className="data-[state=active]:bg-[#8cd6ff] data-[state=active]:text-black text-gray-400"
          >
            <Search size={16} className="mr-2" />
            SEO
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:bg-[#8cd6ff] data-[state=active]:text-black text-gray-400"
          >
            <Bell size={16} className="mr-2" />
            Notificaties
          </TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          {/* General Tab */}
          <TabsContent value="general">
            <Card className="bg-[rgba(12,22,40,0.72)] border-[rgba(140,214,255,0.12)]">
              <CardHeader>
                <CardTitle className="text-white">Algemene Informatie</CardTitle>
                <CardDescription>Basisinstellingen voor je website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="site_name" className="text-gray-300">Website Naam</Label>
                  <Input 
                    id="site_name" 
                    name="site_name" 
                    value={formData.site_name || ''} 
                    onChange={handleInputChange} 
                    className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="site_description" className="text-gray-300">Website Beschrijving (Kort)</Label>
                  <Textarea 
                    id="site_description" 
                    name="site_description" 
                    value={formData.site_description || ''} 
                    onChange={handleInputChange} 
                    className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" 
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contact_email" className="text-gray-300">Contact Email</Label>
                    <Input 
                      id="contact_email" 
                      name="contact_email" 
                      type="email"
                      value={formData.contact_email || ''} 
                      onChange={handleInputChange} 
                      className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contact_phone" className="text-gray-300">Telefoonnummer</Label>
                    <Input 
                      id="contact_phone" 
                      name="contact_phone" 
                      value={formData.contact_phone || ''} 
                      onChange={handleInputChange} 
                      className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" 
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="website" className="text-gray-300">Website URL</Label>
                    <Input id="website" name="website" value={formData.website || ''} onChange={handleInputChange} className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="logo_url" className="text-gray-300">Logo URL</Label>
                    <Input id="logo_url" name="logo_url" value={formData.logo_url || ''} onChange={handleInputChange} placeholder="/logo.jpeg" className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Tab */}
          <TabsContent value="business">
            <Card className="bg-[rgba(12,22,40,0.72)] border-[rgba(140,214,255,0.12)]">
              <CardHeader>
                <CardTitle className="text-white">Bedrijfsgegevens</CardTitle>
                <CardDescription>Deze gegevens worden getoond in de footer en op de contactpagina.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="address_street" className="text-gray-300">Straat en huisnummer</Label>
                  <Input 
                    id="address_street" 
                    name="address_street" 
                    value={formData.address_street || ''} 
                    onChange={handleInputChange} 
                    className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" 
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="address_city" className="text-gray-300">Stad</Label>
                    <Input 
                      id="address_city" 
                      name="address_city" 
                      value={formData.address_city || ''} 
                      onChange={handleInputChange} 
                      className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address_postal_code" className="text-gray-300">Postcode</Label>
                    <Input 
                      id="address_postal_code" 
                      name="address_postal_code" 
                      value={formData.address_postal_code || ''} 
                      onChange={handleInputChange} 
                      className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address_country" className="text-gray-300">Land</Label>
                    <Input 
                      id="address_country" 
                      name="address_country" 
                      value={formData.address_country || ''} 
                      onChange={handleInputChange} 
                      className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" 
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="kvk" className="text-gray-300">KVK</Label>
                    <Input id="kvk" name="kvk" value={formData.kvk || ''} onChange={handleInputChange} className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="iban" className="text-gray-300">IBAN</Label>
                    <Input id="iban" name="iban" value={formData.iban || ''} onChange={handleInputChange} className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Socials Tab */}
          <TabsContent value="socials">
            <Card className="bg-[rgba(12,22,40,0.72)] border-[rgba(140,214,255,0.12)]">
              <CardHeader>
                <CardTitle className="text-white">Social Media</CardTitle>
                <CardDescription>Links naar je social media profielen.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="social_instagram" className="text-gray-300">Instagram URL</Label>
                  <Input 
                    id="social_instagram" 
                    name="social_instagram" 
                    placeholder="https://instagram.com/..."
                    value={formData.social_instagram || ''} 
                    onChange={handleInputChange} 
                    className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="social_linkedin" className="text-gray-300">LinkedIn URL</Label>
                  <Input 
                    id="social_linkedin" 
                    name="social_linkedin" 
                    placeholder="https://linkedin.com/in/..."
                    value={formData.social_linkedin || ''} 
                    onChange={handleInputChange} 
                    className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="social_facebook" className="text-gray-300">Facebook URL</Label>
                  <Input 
                    id="social_facebook" 
                    name="social_facebook" 
                    placeholder="https://facebook.com/..."
                    value={formData.social_facebook || ''} 
                    onChange={handleInputChange} 
                    className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="social_twitter" className="text-gray-300">X (Twitter) URL</Label>
                  <Input 
                    id="social_twitter" 
                    name="social_twitter" 
                    placeholder="https://x.com/..."
                    value={formData.social_twitter || ''} 
                    onChange={handleInputChange} 
                    className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="social_tiktok" className="text-gray-300">TikTok URL</Label>
                  <Input
                    id="social_tiktok"
                    name="social_tiktok"
                    placeholder="https://tiktok.com/@..."
                    value={formData.social_tiktok || ''}
                    onChange={handleInputChange}
                    className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="social_youtube" className="text-gray-300">YouTube URL</Label>
                  <Input
                    id="social_youtube"
                    name="social_youtube"
                    placeholder="https://youtube.com/@..."
                    value={formData.social_youtube || ''}
                    onChange={handleInputChange}
                    className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo">
            <Card className="bg-[rgba(12,22,40,0.72)] border-[rgba(140,214,255,0.12)]">
              <CardHeader>
                <CardTitle className="text-white">SEO Instellingen</CardTitle>
                <CardDescription>Optimaliseer je vindbaarheid in zoekmachines.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="seo_title" className="text-gray-300">SEO titel</Label>
                  <Input id="seo_title" name="seo_title" value={formData.seo_title || ''} onChange={handleInputChange} className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="seo_meta_description" className="text-gray-300">Standaard Meta Beschrijving</Label>
                  <Textarea 
                    id="seo_meta_description" 
                    name="seo_meta_description" 
                    rows={4}
                    value={formData.seo_meta_description || ''} 
                    onChange={handleInputChange} 
                    className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" 
                  />
                  <p className="text-xs text-gray-500">Wordt gebruikt als er geen specifieke pagina beschrijving is.</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="seo_keywords" className="text-gray-300">Keywords (gescheiden door komma's)</Label>
                  <Input 
                    id="seo_keywords" 
                    name="seo_keywords" 
                    placeholder="webdesign, portfolio, development..."
                    value={formData.seo_keywords || ''} 
                    onChange={handleInputChange} 
                    className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" 
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="default_payment_term_days" className="text-gray-300">Standaard betalingstermijn</Label>
                    <Input id="default_payment_term_days" name="default_payment_term_days" type="number" value={formData.default_payment_term_days || 14} onChange={handleInputChange} className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="default_vat_rate" className="text-gray-300">Standaard btw %</Label>
                    <Input id="default_vat_rate" name="default_vat_rate" type="number" value={formData.default_vat_rate || 21} onChange={handleInputChange} className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="default_quote_validity_days" className="text-gray-300">Offerte geldigheid</Label>
                    <Input id="default_quote_validity_days" name="default_quote_validity_days" type="number" value={formData.default_quote_validity_days || 14} onChange={handleInputChange} className="bg-black border-[rgba(140,214,255,0.16)] text-white focus:border-[#8cd6ff]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-[rgba(12,22,40,0.72)] border-[rgba(140,214,255,0.12)]">
              <CardHeader>
                <CardTitle className="text-white">Email Notificaties</CardTitle>
                <CardDescription>Beheer waarvoor je notificaties wilt ontvangen.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2 border-b border-[rgba(140,214,255,0.12)] pb-4">
                  <div className="space-y-1">
                    <Label htmlFor="notify_new_project" className="text-white font-medium">Nieuw Project</Label>
                    <p className="text-sm text-gray-400">Ontvang een bevestiging wanneer je een nieuw project aanmaakt.</p>
                  </div>
                  <Switch 
                    id="notify_new_project" 
                    checked={formData.notify_new_project}
                    onCheckedChange={(checked) => handleSwitchChange('notify_new_project', checked)}
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-1">
                    <Label htmlFor="notify_new_review" className="text-white font-medium">Nieuwe Review</Label>
                    <p className="text-sm text-gray-400">Ontvang een notificatie wanneer er een nieuwe review wordt geplaatst.</p>
                  </div>
                  <Switch 
                    id="notify_new_review" 
                    checked={formData.notify_new_review}
                    onCheckedChange={(checked) => handleSwitchChange('notify_new_review', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { formatDateTimeNL } from '@/lib/formatDateTime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { toast } from '@/components/ui/use-toast';
import {
  FolderKanban,
  MessageSquare,
  Layers,
  Eye,
  Plus,
  ArrowRight
} from 'lucide-react';

/* ================= HELPERS ================= */

const TYPE_LABELS = {
  project: 'Project',
  testimonial: 'Review',
  category: 'Categorie',
  settings: 'Instellingen',
};

const ACTION_LABELS = {
  created: 'toegevoegd',
  updated: 'bijgewerkt',
  deleted: 'verwijderd',
};

const getTargetRoute = (activity) => {
  switch (activity.type) {
    case 'project':
      return '/admin/projects';
    case 'testimonial':
      return '/admin/testimonials';
    case 'category':
      return '/admin/categories';
    case 'settings':
      return '/admin/settings';
    default:
      return null;
  }
};

const formatActivityText = (a) => {
  return `${TYPE_LABELS[a.type] || 'Item'} "${a.title || ''}" ${ACTION_LABELS[a.action] || ''}`;
};

/* ================= PAGE ================= */

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const channelRef = useRef(null);

  const [stats, setStats] = useState({
    projects: 0,
    testimonials: 0,
    categories: 0,
  });

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= INITIAL FETCH ================= */

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const [
          projects,
          testimonials,
          categories,
          activityRes
        ] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('testimonials').select('*', { count: 'exact', head: true }),
          supabase.from('categories').select('*', { count: 'exact', head: true }),
          supabase
            .from('activity_log')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(8),
        ]);

        setStats({
          projects: projects.count || 0,
          testimonials: testimonials.count || 0,
          categories: categories.count || 0,
        });

        setActivities(activityRes.data || []);
      } catch (e) {
        console.error('Dashboard fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  /* ================= REALTIME ================= */

  useEffect(() => {
    channelRef.current = supabase
      .channel('activity-log-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_log' },
        (payload) => {
          const activity = payload.new;

          // prepend activity
          setActivities(prev => [activity, ...prev].slice(0, 8));

          // toast
          toast({
            title: 'Nieuwe activiteit',
            description: `${formatActivityText(activity)} ${
              activity.user_id === user?.id ? '(door jou)' : '(door andere gebruiker)'
            }`,
            action: getTargetRoute(activity)
              ? (
                <Button
                  variant="link"
                  className="text-[#38bdf8]"
                  onClick={() => navigate(getTargetRoute(activity))}
                >
                  Bekijk
                </Button>
              )
              : null,
          });
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [navigate, user]);

  /* ================= COMPONENTS ================= */

  const StatCard = ({ title, value, icon: Icon, color, href }) => (
    <Card className="bg-[#111827] border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">
          {loading ? '-' : value}
        </div>
        <Button
          variant="link"
          className="px-0 text-[#38bdf8] h-auto mt-2 text-xs flex items-center gap-1"
          onClick={() => navigate(href)}
        >
          Beheren <ArrowRight size={12} />
        </Button>
      </CardContent>
    </Card>
  );

  /* ================= UI ================= */

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Live overzicht van alles wat er gebeurt.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Projecten" value={stats.projects} icon={FolderKanban} color="text-blue-500" href="/admin/projects" />
        <StatCard title="Reviews" value={stats.testimonials} icon={MessageSquare} color="text-green-500" href="/admin/testimonials" />
        <StatCard title="Categorieën" value={stats.categories} icon={Layers} color="text-purple-500" href="/admin/categories" />
      </div>

      {/* CONTENT */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* ACTIVITY */}
        <Card className="col-span-4 bg-[#111827] border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Recente Activiteit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length === 0 && (
                <p className="text-gray-500 text-sm">Nog geen activiteit.</p>
              )}

              {activities.map(a => {
                const route = getTargetRoute(a);
                return (
                  <div
                    key={a.id}
                    onClick={() => route && navigate(route)}
                    className={`flex items-center gap-4 text-sm border-b border-gray-800 pb-3 last:border-0 ${
                      route ? 'cursor-pointer hover:bg-[#222]' : ''
                    } p-2 rounded`}
                  >
                    <div className="h-2 w-2 rounded-full bg-[#38bdf8]" />
                    <div className="flex-1">
                      <p className="text-gray-300">
                        {formatActivityText(a)}
                        <span className="text-xs text-gray-500 ml-2">
                          {a.user_id === user?.id ? '• door jou' : '• andere gebruiker'}
                        </span>
                      </p>

                      {a.meta?.changes && (
                        <p className="text-xs text-gray-500 mt-1">
                          Gewijzigd: {Object.keys(a.meta.changes).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="text-gray-500 text-xs">
                      {formatDateTimeNL(a.created_at)}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

       {/* QUICK ACTIONS */}
<Card className="col-span-3 bg-[#111827] border-gray-800">
  <CardHeader>
    <CardTitle className="text-white">Snelle Acties</CardTitle>
  </CardHeader>

  <CardContent className="space-y-5">
    {/* PRIMARY ACTION */}
    <Button
      onClick={() => navigate('/admin/projects?new=true')}
      className="
        w-full h-16
        flex items-center justify-center gap-3
        bg-[#38bdf8] text-black
        hover:bg-[#0ea5e9]
        font-semibold text-base
        rounded-lg
        shadow-md
      "
    >
      <Plus size={22} />
      Nieuw project aanmaken
    </Button>

    {/* SECONDARY ACTIONS */}
    <div className="space-y-2">
      <Button
        onClick={() => navigate('/admin/testimonials?new=true')}
        variant="outline"
        className="
          w-full h-12
          flex items-center gap-3
          justify-start
          border-gray-700 text-gray-300
          hover:border-[#38bdf8]
          hover:text-white
          rounded-lg
        "
      >
        <Plus size={18} className="text-[#38bdf8]" />
        Nieuwe review toevoegen
      </Button>

      <Button
        onClick={() => navigate('/admin/settings')}
        variant="outline"
        className="
          w-full h-12
          flex items-center gap-3
          justify-start
          border-gray-700 text-gray-300
          hover:border-gray-500
          hover:text-white
          rounded-lg
        "
      >
        <Layers size={18} className="text-gray-400" />
        Instellingen beheren
      </Button>
    </div>

    {/* TERTIARY ACTION */}
    <div className="pt-2 border-t border-gray-800">
      <Button
        onClick={() => window.open('/', '_blank')}
        variant="ghost"
        className="
          w-full
          flex items-center justify-center gap-2
          text-gray-400
          hover:text-[#38bdf8]
        "
      >
        <Eye size={16} />
        Website bekijken
      </Button>
    </div>
  </CardContent>
</Card>
      </div>
    </div>
  );
};

export default DashboardPage;
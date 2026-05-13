import { useEffect, useRef } from 'react';

import { isSupabaseConfigured, supabase } from '@/lib/customSupabaseClient';

const warnRealtime = (message, details) => {
  if (typeof console !== 'undefined' && typeof console.warn === 'function') {
    console.warn(message, details);
  }
};

const isTerminalRealtimeStatus = (status) => (
  status === 'CHANNEL_ERROR' ||
  status === 'TIMED_OUT' ||
  status === 'CLOSED'
);

export const useSafeAdminRealtime = ({
  enabled = false,
  channelName,
  table,
  event = '*',
  onChange,
}) => {
  const channelRef = useRef(null);
  const subscribedRef = useRef(false);
  const callbackRef = useRef(onChange);

  useEffect(() => {
    callbackRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!enabled || !channelName || !table || !isSupabaseConfigured || !supabase?.channel) {
      return undefined;
    }

    if (subscribedRef.current || channelRef.current) {
      return undefined;
    }

    let mounted = true;
    let channel = null;

    try {
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event,
            schema: 'public',
            table,
          },
          (payload) => {
            if (!mounted) return;

            try {
              callbackRef.current?.(payload);
            } catch (error) {
              warnRealtime('Realtime callback failed', error);
            }
          }
        )
        .subscribe((status, error) => {
          if (!mounted) return;

          if (isTerminalRealtimeStatus(status)) {
            warnRealtime('Realtime channel error; admin blijft werken zonder live updates.', { status, error });
          }
        });

      channelRef.current = channel;
      subscribedRef.current = true;
    } catch (error) {
      subscribedRef.current = false;
      channelRef.current = null;
      warnRealtime('Realtime setup failed; admin blijft werken zonder live updates.', error);
    }

    return () => {
      mounted = false;
      subscribedRef.current = false;

      const activeChannel = channelRef.current || channel;
      channelRef.current = null;

      if (!activeChannel) return;

      try {
        if (supabase?.removeChannel) {
          supabase.removeChannel(activeChannel);
        } else {
          activeChannel.unsubscribe?.();
        }
      } catch (error) {
        warnRealtime('Realtime cleanup failed', error);
      }
    };
  }, [enabled, channelName, table, event]);
};

export default useSafeAdminRealtime;

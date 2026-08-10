import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Live presence listener count hook.
 * Uses Supabase Realtime Presence with BroadcastChannel fallback to track real active room listeners.
 */
export function useListenerCount(): number {
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    let presenceChannel: ReturnType<typeof supabase.channel> | null = null;
    let bc: BroadcastChannel | null = null;

    try {
      // 1. Supabase Realtime Presence tracking
      const channelId = `mehfil-room-${Math.floor(Date.now() / 3600000)}`; // Room identifier
      presenceChannel = supabase.channel(channelId, {
        config: { presence: { key: crypto.randomUUID() } },
      });

      presenceChannel
        .on("presence", { event: "sync" }, () => {
          if (!presenceChannel) return;
          const state = presenceChannel.presenceState();
          const activeCount = Object.keys(state).length;
          setCount(Math.max(activeCount, 1));
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED" && presenceChannel) {
            void presenceChannel.track({ joined_at: new Date().toISOString() });
          }
        });
    } catch (err) {
      console.warn("Supabase presence fallback:", err);
    }

    // 2. BroadcastChannel multi-tab synchronization fallback
    if (typeof BroadcastChannel !== "undefined") {
      try {
        bc = new BroadcastChannel("mehfil_tab_sync");
        bc.postMessage({ type: "TAB_JOIN", timestamp: Date.now() });

        bc.onmessage = (e) => {
          if (e.data?.type === "TAB_JOIN") {
            setCount((prev) => prev + 1);
          }
        };
      } catch (err) {
        console.warn("BroadcastChannel fallback:", err);
      }
    }

    return () => {
      if (presenceChannel) {
        void supabase.removeChannel(presenceChannel);
      }
      if (bc) {
        bc.close();
      }
    };
  }, []);

  return count;
}

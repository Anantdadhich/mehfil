import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, Eye, EyeOff, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

import bg from "@/assets/mehfil-bg-new.png";
import {
  AUTHENTIC_GHAZALS,
  SPOTIFY_PLAYLIST_URL,
  YOUTUBE_PLAYLIST_URL,
  type Track,
} from "@/data/tracks";
import { useListenerCount } from "@/hooks/use-listener-count";

interface YTVideoData {
  title?: string;
  author?: string;
  video_id?: string;
}

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVideoData: () => YTVideoData;
  loadVideoById: (id: string) => void;
}

interface YTPlayerEvent {
  target: YTPlayerInstance;
  data: number;
}

declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, options: Record<string, unknown>) => YTPlayerInstance;
    };
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MEHFIL — A Late-Night Ghazal Listening Room" },
      {
        name: "description",
        content:
          "MEHFIL is a cinematic listening room for Ghazals — Jagjit Singh, Mehdi Hassan, Ghulam Ali, Pankaj Udhas & Farida Khanum.",
      },
      { property: "og:title", content: "MEHFIL — A Late-Night Ghazal Listening Room" },
      {
        property: "og:description",
        content:
          "A quiet night in an old city. Somewhere inside, a ghazal is playing and everyone has gone silent.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Mehfil,
});

function fmt(s: number): string {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function Mehfil() {
  const listeners = useListenerCount();

  const [now, setNow] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [drift, setDrift] = useState({ x: 0, y: 0 });
  const [notice, setNotice] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  const ytPlayerRef = useRef<YTPlayerInstance | null>(null);
  const [ytReady, setYtReady] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const track: Track = AUTHENTIC_GHAZALS[index] ?? AUTHENTIC_GHAZALS[0]!;

  // Clock Ticker
  useEffect(() => {
    const tick = () =>
      setNow(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  // Parallax Background Drift
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      setDrift({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Initialize YouTube IFrame API with explicit Ghazal video ID
  useEffect(() => {
    const initYT = () => {
      if (!window.YT || !window.YT.Player) return;

      try {
        ytPlayerRef.current = new window.YT.Player("mehfil-yt-player-element", {
          height: "100%",
          width: "100%",
          videoId: track.youtube_id,
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            enablejsapi: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: YTPlayerEvent) => {
              setYtReady(true);
              if (typeof event.target.setVolume === "function") {
                event.target.setVolume(100);
              }
            },
            onStateChange: (event: YTPlayerEvent) => {
              // 1 = PLAYING, 2 = PAUSED, 0 = ENDED
              if (event.data === 1) {
                setPlaying(true);
              } else if (event.data === 2) {
                setPlaying(false);
              } else if (event.data === 0) {
                setPlaying(false);
                setIndex((prev) => (prev + 1) % AUTHENTIC_GHAZALS.length);
              }
            },
          },
        });
      } catch (err) {
        console.error("YouTube Player init warning:", err);
      }
    };

    if (window.YT && window.YT.Player) {
      initYT();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initYT;
    }
  }, []);

  // Load new track into YouTube Player on index change
  useEffect(() => {
    const player = ytPlayerRef.current;
    if (ytReady && player && typeof player.loadVideoById === "function") {
      player.loadVideoById(track.youtube_id);
      if (playing && typeof player.playVideo === "function") {
        player.playVideo();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, track.youtube_id, ytReady]);

  // Poll progress & duration from YouTube Player
  useEffect(() => {
    if (!playing || !ytPlayerRef.current || !ytReady) return;

    const interval = setInterval(() => {
      const player = ytPlayerRef.current;
      if (player && typeof player.getCurrentTime === "function") {
        const cur = player.getCurrentTime() || 0;
        const dur = player.getDuration() || 0;
        setProgress(cur);
        setDuration(dur);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [playing, ytReady]);

  // Controls
  const togglePlay = () => {
    const player = ytPlayerRef.current;

    if (ytReady && player && typeof player.playVideo === "function") {
      if (playing) {
        player.pauseVideo();
        setPlaying(false);
      } else {
        try {
          if (typeof player.unMute === "function") player.unMute();
          if (typeof player.setVolume === "function") player.setVolume(100);
          player.playVideo();
          setPlaying(true);
        } catch {
          setNotice("Click play again to start audio.");
          setTimeout(() => setNotice(null), 3000);
        }
      }
    } else {
      setPlaying((p) => !p);
      setNotice("Loading YouTube audio...");
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % AUTHENTIC_GHAZALS.length);
  }, []);

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + AUTHENTIC_GHAZALS.length) % AUTHENTIC_GHAZALS.length);
  }, []);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = barRef.current;
    const player = ytPlayerRef.current;
    if (!el || !duration) return;

    const rect = el.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const seekTime = ratio * duration;

    setProgress(seekTime);
    if (ytReady && player && typeof player.seekTo === "function") {
      player.seekTo(seekTime, true);
    }
  };

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      const player = ytPlayerRef.current;
      if (ytReady && player) {
        if (next && typeof player.mute === "function") player.mute();
        else if (!next && typeof player.unMute === "function") player.unMute();
      }
      return next;
    });
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        goNext();
      } else if (e.code === "ArrowLeft") {
        goPrev();
      } else if (e.key === "m" || e.key === "M") {
        toggleMute();
      } else if (e.key === "v" || e.key === "V") {
        setShowVideo((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <main className="relative min-h-screen w-screen overflow-hidden bg-background text-foreground select-none flex flex-col justify-between">
      {/* YouTube Player Container - Styled overlay or ambient player */}
      <div
        className={`fixed right-6 top-20 z-40 w-80 h-48 rounded-2xl overflow-hidden border border-cream/20 shadow-2xl bg-black/90 transition-all duration-300 ${
          showVideo
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none absolute -left-[9999px] -top-[9999px]"
        }`}
      >
        <div id="mehfil-yt-player-element" className="w-full h-full" />
      </div>

      {/* Atmospheric Background Layer with drift */}
      <div
        className="absolute inset-[-4%] bg-cover bg-center animate-breathe will-change-transform brightness-115"
        style={{
          backgroundImage: `url(${bg})`,
          transform: `translate3d(${drift.x * -14}px, ${drift.y * -10}px, 0) scale(1.06)`,
          transition: "transform 1.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-scene-veil" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.16] mix-blend-overlay" />

      {/* Top Header Bar */}
      <header className="relative z-20 flex items-start justify-between px-5 pt-5 text-[11px] uppercase tracking-[0.18em] text-cream/70 sm:px-8 sm:pt-7 sm:text-xs">
        <span className="tabular-nums font-medium">{now ?? "—"}</span>

        {/* Live Listener Counter */}
        <span className="absolute left-1/2 top-5 hidden -translate-x-1/2 items-center gap-2 sm:top-7 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_10px_var(--ember)] animate-pulse-soft" />
          {listeners} listening
        </span>

        {/* External Playlist Links & Video Toggle */}
        <nav className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={() => setShowVideo((v) => !v)}
            className="link-quiet flex items-center gap-1.5 cursor-pointer"
            title="Toggle YouTube Video View (V)"
          >
            {showVideo ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {showVideo ? "Hide Video" : "Show Video"}
          </button>
          <a
            className="link-quiet flex items-center gap-1.5"
            href={SPOTIFY_PLAYLIST_URL}
            target="_blank"
            rel="noreferrer noopener"
            title="Spotify Ghazal Playlist"
          >
            Spotify <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
          <a
            className="link-quiet flex items-center gap-1.5"
            href={YOUTUBE_PLAYLIST_URL}
            target="_blank"
            rel="noreferrer noopener"
            title="YouTube Music Ghazal Mix"
          >
            YouTube Music <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        </nav>
      </header>

      {/* Mobile Listener Count */}
      <span className="relative z-20 flex justify-center items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cream/70 sm:hidden mt-2">
        <span className="h-1.5 w-1.5 rounded-full bg-ember animate-pulse-soft" />
        {listeners} listening
      </span>

      {/* Center Title */}
      <div
        className="absolute inset-x-0 top-[20%] sm:top-[16%] lg:top-[14%] z-20 flex flex-col items-center text-center pointer-events-none"
        style={{
          transform: `translate3d(${drift.x * -5}px, ${drift.y * -4}px, 0)`,
          transition: "transform 1.6s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <h1 className="font-display text-cream text-[16vw] leading-[0.85] tracking-tight drop-shadow-[0_20px_60px_rgba(0,0,0,0.7)] sm:text-[12vw] lg:text-[9.5vw]">
          महफ़िल
        </h1>
        <p className="mt-2 text-[10px] uppercase tracking-[0.55em] text-cream/70 sm:mt-3 sm:text-xs drop-shadow-md font-medium">
          A Late-Night Ghazal Room
        </p>
      </div>

      {/* Floating Pill Player Dock (Saloon Reference Design - ALWAYS VISIBLE AT BOTTOM) */}
      <div className="fixed inset-x-0 bottom-6 z-30 flex flex-col items-center gap-2 px-4 sm:bottom-10">
        {notice && (
          <p className="rounded-full border border-cream/12 bg-player px-4 py-1.5 text-[11px] tracking-wide text-cream/75 backdrop-blur-xl">
            {notice}
          </p>
        )}

        <div className="w-full max-w-[620px] rounded-full border border-cream/20 bg-[#1e1014]/90 px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:px-5 sm:py-3.5">
          <div className="flex items-center gap-3.5 sm:gap-5">
            {/* Circular Track Cover Art */}
            <div className="relative shrink-0">
              <img
                src={track.cover_url}
                alt={`${track.title} artwork`}
                width={512}
                height={512}
                loading="lazy"
                className={`h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-cream/25 shadow-md sm:h-14 sm:w-14 ${
                  playing ? "animate-spin-slow" : ""
                }`}
              />
            </div>

            {/* Song Title, Artist & Progress Bar */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-cream sm:text-[15px]">
                {track.title}
              </p>
              <p className="truncate text-xs text-cream/60">{track.artist}</p>

              {/* Progress Bar */}
              <div
                ref={barRef}
                onClick={seek}
                className="group mt-2 cursor-pointer py-1"
                role="presentation"
              >
                <div className="relative h-[3.5px] w-full rounded-full bg-cream/20">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-cream/90"
                    style={{ width: `${pct}%` }}
                  />
                  <span
                    className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ left: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Progress Timestamp (0:05 / 5:04) */}
              <div className="mt-1 flex justify-start text-[11px] tabular-nums text-cream/50">
                <span>
                  {fmt(progress)} / {fmt(duration)}
                </span>
              </div>
            </div>

            {/* Playback Control Buttons */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                aria-label="Previous track"
                onClick={goPrev}
                className="p-1 text-cream/70 transition-colors hover:text-cream cursor-pointer"
                title="Previous Track (Left Arrow)"
              >
                <SkipBack className="h-4 w-4" fill="currentColor" />
              </button>

              <button
                aria-label={playing ? "Pause" : "Play"}
                onClick={togglePlay}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-ink shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                title="Play/Pause (Spacebar)"
              >
                {playing ? (
                  <Pause className="h-4 w-4" fill="currentColor" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
                )}
              </button>

              <button
                aria-label="Next track"
                onClick={goNext}
                className="p-1 text-cream/70 transition-colors hover:text-cream cursor-pointer"
                title="Next Track (Right Arrow)"
              >
                <SkipForward className="h-4 w-4" fill="currentColor" />
              </button>

              <button
                aria-label={muted ? "Unmute" : "Mute"}
                onClick={toggleMute}
                className="hidden p-1 text-cream/60 transition-colors hover:text-cream sm:block cursor-pointer"
                title="Mute/Unmute (M)"
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

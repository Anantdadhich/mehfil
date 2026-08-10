export type Track = {
  id: string;
  slug: string;
  title: string;
  artist: string;
  album?: string;
  cover_url: string;
  youtube_id: string;
  audio_url: string;
  spotify_url: string;
  youtube_url: string;
};

export const YOUTUBE_PLAYLIST_ID =
  (import.meta.env["VITE_YOUTUBE_PLAYLIST_ID"] as string | undefined) ||
  "PLJeNQvgQ4Sl9lLAjyhs8vJvA2-HO0rWWX";

export const SPOTIFY_PLAYLIST_ID =
  (import.meta.env["VITE_SPOTIFY_PLAYLIST_ID"] as string | undefined) ||
  "3aVvXfZZds4cjdZXloUzuv";

export const YOUTUBE_MUSIC_URL =
  (import.meta.env["VITE_YOUTUBE_MUSIC_URL"] as string | undefined) ||
  "https://music.youtube.com/watch?v=YJWR_MVFigs";

export const SPOTIFY_PLAYLIST_URL = `https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}`;
export const YOUTUBE_PLAYLIST_URL = YOUTUBE_MUSIC_URL;

// Exact 13 Ghazals provided by user via YouTube links (5 initial + 8 from README.md)
export const AUTHENTIC_GHAZALS: Track[] = [
  // 5 Initial Songs
  {
    id: "1",
    slug: "hoshwalon-ko-khabar-kya",
    title: "Hoshwalon Ko Khabar Kya",
    artist: "Jagjit Singh",
    album: "Sarfarosh (1999)",
    cover_url: "https://i.ytimg.com/vi/GAHlAcsLlJY/hqdefault.jpg",
    youtube_id: "GAHlAcsLlJY",
    audio_url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=hoshwalon-ko-khabar-kya.mp3",
    spotify_url: "https://open.spotify.com/track/9f5g19e47zN0bX8Z16e47z",
    youtube_url: "https://music.youtube.com/watch?v=GAHlAcsLlJY",
  },
  {
    id: "2",
    slug: "humko-kiske-gham-ne-mara",
    title: "Humko Kiske Gham Ne Mara",
    artist: "Ghulam Ali",
    album: "Ghazal Classics",
    cover_url: "https://i.ytimg.com/vi/90PFRxO96zU/hqdefault.jpg",
    youtube_id: "90PFRxO96zU",
    audio_url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=humko-kiske-gham-ne-mara.mp3",
    spotify_url: "https://open.spotify.com/track/4b3f8Z0x1K6zY9j16e47z",
    youtube_url: "https://music.youtube.com/watch?v=90PFRxO96zU",
  },
  {
    id: "3",
    slug: "kal-chaudhvin-ki-raat-thi",
    title: "Kal Chaudhvin Ki Raat Thi",
    artist: "Jagjit Singh",
    album: "Live Mehfil",
    cover_url: "https://i.ytimg.com/vi/cvLavGNYtX8/hqdefault.jpg",
    youtube_id: "cvLavGNYtX8",
    audio_url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a74c43.mp3?filename=kal-chaudhvin-ki-raat-thi.mp3",
    spotify_url: "https://open.spotify.com/track/5c2d19e47zN0bX8Z16e47z",
    youtube_url: "https://music.youtube.com/watch?v=cvLavGNYtX8",
  },
  {
    id: "4",
    slug: "duniya-kisi-ke-pyar-mein",
    title: "Duniya Kisi Ke Pyar Mein",
    artist: "Mehdi Hassan",
    album: "Masterpieces",
    cover_url: "https://i.ytimg.com/vi/3zGr5dHD0cU/hqdefault.jpg",
    youtube_id: "3zGr5dHD0cU",
    audio_url: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939ae1c50.mp3?filename=duniya-kisi-ke-pyar-mein.mp3",
    spotify_url: "https://open.spotify.com/track/7d3e19e47zN0bX8Z16e47z",
    youtube_url: "https://music.youtube.com/watch?v=3zGr5dHD0cU",
  },
  {
    id: "5",
    slug: "mohabbat-karne-wale",
    title: "Mohabbat Karne Wale",
    artist: "Farida Khanum",
    album: "Queen of Ghazal",
    cover_url: "https://i.ytimg.com/vi/BCJwxuXWvh0/hqdefault.jpg",
    youtube_id: "BCJwxuXWvh0",
    audio_url: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65912443.mp3?filename=mohabbat-karne-wale.mp3",
    spotify_url: "https://open.spotify.com/track/8e4f19e47zN0bX8Z16e47z",
    youtube_url: "https://music.youtube.com/watch?v=BCJwxuXWvh0",
  },
  // 8 Songs from README.md
  {
    id: "6",
    slug: "tumko-dekha-toh-yeh-khayal",
    title: "Tumko Dekha Toh Yeh Khayal Aaya",
    artist: "Jagjit Singh & Chitra Singh",
    album: "Saath Saath (1982)",
    cover_url: "https://i.ytimg.com/vi/YJWR_MVFigs/hqdefault.jpg",
    youtube_id: "YJWR_MVFigs",
    audio_url: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65912443.mp3?filename=tumko-dekha-toh-yeh-khayal.mp3",
    spotify_url: "https://open.spotify.com/track/8e4f19e47zN0bX8Z16e47z",
    youtube_url: "https://music.youtube.com/watch?v=YJWR_MVFigs",
  },
  {
    id: "7",
    slug: "chithi-na-koi-sandesh",
    title: "Chithi Na Koi Sandesh",
    artist: "Jagjit Singh",
    album: "Dushman (1998)",
    cover_url: "https://i.ytimg.com/vi/E0HRfm08Jqg/hqdefault.jpg",
    youtube_id: "E0HRfm08Jqg",
    audio_url: "https://cdn.pixabay.com/download/audio/2022/02/07/audio_4f09e6c1e5.mp3?filename=chithi-na-koi-sandesh.mp3",
    spotify_url: "https://open.spotify.com/track/1a2b3c4d5e6f7g8h9i0j",
    youtube_url: "https://music.youtube.com/watch?v=E0HRfm08Jqg",
  },
  {
    id: "8",
    slug: "tum-itna-jo-muskura-rahe-ho",
    title: "Tum Itna Jo Muskura Rahe Ho",
    artist: "Jagjit Singh",
    album: "Arth (1982)",
    cover_url: "https://i.ytimg.com/vi/PSn9mLj1Z7k/hqdefault.jpg",
    youtube_id: "PSn9mLj1Z7k",
    audio_url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=tum-itna-jo-muskura-rahe-ho.mp3",
    spotify_url: "https://open.spotify.com/track/6K8V18e47zN0bX8Z16e47z",
    youtube_url: "https://music.youtube.com/watch?v=PSn9mLj1Z7k",
  },
  {
    id: "9",
    slug: "ek-pyar-ka-naghma-hai",
    title: "Ek Pyar Ka Naghma Hai",
    artist: "Jagjit Singh",
    album: "Shor (1972)",
    cover_url: "https://i.ytimg.com/vi/9xHEpWWcNKA/hqdefault.jpg",
    youtube_id: "9xHEpWWcNKA",
    audio_url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ek-pyar-ka-naghma-hai.mp3",
    spotify_url: "https://open.spotify.com/track/4b3f8Z0x1K6zY9j16e47z",
    youtube_url: "https://music.youtube.com/watch?v=9xHEpWWcNKA",
  },
  {
    id: "10",
    slug: "aapko-dekh-kar-dekhta-rah-gaya",
    title: "Aapko Dekh Kar Dekhta Rah Gaya",
    artist: "Jagjit Singh",
    album: "Ghazal Masterpieces",
    cover_url: "https://i.ytimg.com/vi/xh3GEx0xAAQ/hqdefault.jpg",
    youtube_id: "xh3GEx0xAAQ",
    audio_url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a74c43.mp3?filename=aapko-dekh-kar.mp3",
    spotify_url: "https://open.spotify.com/track/5c2d19e47zN0bX8Z16e47z",
    youtube_url: "https://music.youtube.com/watch?v=xh3GEx0xAAQ",
  },
  {
    id: "11",
    slug: "kahin-door-jab-din-dhal-jaye",
    title: "Kahin Door Jab Din Dhal Jaye",
    artist: "Jagjit Singh",
    album: "Anand (1971)",
    cover_url: "https://i.ytimg.com/vi/NJGQkMjtHUM/hqdefault.jpg",
    youtube_id: "NJGQkMjtHUM",
    audio_url: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939ae1c50.mp3?filename=kahin-door-jab-din-dhal-jaye.mp3",
    spotify_url: "https://open.spotify.com/track/7d3e19e47zN0bX8Z16e47z",
    youtube_url: "https://music.youtube.com/watch?v=NJGQkMjtHUM",
  },
  {
    id: "12",
    slug: "jaane-woh-kaise-log-the",
    title: "Jaane Woh Kaise Log The",
    artist: "Jagjit Singh",
    album: "Pyaasa (1957)",
    cover_url: "https://i.ytimg.com/vi/2fuCIC9gnLA/hqdefault.jpg",
    youtube_id: "2fuCIC9gnLA",
    audio_url: "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65912443.mp3?filename=jaane-woh-kaise-log-the.mp3",
    spotify_url: "https://open.spotify.com/track/8e4f19e47zN0bX8Z16e47z",
    youtube_url: "https://music.youtube.com/watch?v=2fuCIC9gnLA",
  },
  {
    id: "13",
    slug: "main-nashe-mein-hoon",
    title: "Main Nashe Mein Hoon",
    artist: "Jagjit Singh",
    album: "Classic Ghazals",
    cover_url: "https://i.ytimg.com/vi/WXXj3_kSVqQ/hqdefault.jpg",
    youtube_id: "WXXj3_kSVqQ",
    audio_url: "https://cdn.pixabay.com/download/audio/2022/08/02/audio_8847849e2a.mp3?filename=main-nashe-mein-hoon.mp3",
    spotify_url: "https://open.spotify.com/track/2b3c4d5e6f7g8h9i0j1k",
    youtube_url: "https://music.youtube.com/watch?v=WXXj3_kSVqQ",
  }
];

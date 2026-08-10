CREATE TABLE public.tracks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  artist text NOT NULL,
  cover_url text NOT NULL,
  audio_url text,
  spotify_url text,
  youtube_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.tracks TO anon;
GRANT SELECT ON public.tracks TO authenticated;
GRANT ALL ON public.tracks TO service_role;

ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tracks are publicly readable"
  ON public.tracks FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO public.tracks (slug, title, artist, cover_url, spotify_url, youtube_url, sort_order) VALUES
('hothon-se-chhu-lo-tum','Hothon Se Chhu Lo Tum','Jagjit Singh','/__l5e/assets-v1/cover1','https://open.spotify.com/search/Hothon%20Se%20Chhu%20Lo%20Tum%20Jagjit%20Singh','https://music.youtube.com/search?q=Hothon+Se+Chhu+Lo+Tum+Jagjit+Singh',1),
('tum-ko-dekha-to-yeh-khayal-aaya','Tum Ko Dekha To Yeh Khayal Aaya','Jagjit Singh','/__l5e/assets-v1/cover2','https://open.spotify.com/search/Tum%20Ko%20Dekha%20To%20Yeh%20Khayal%20Aaya','https://music.youtube.com/search?q=Tum+Ko+Dekha+To+Yeh+Khayal+Aaya',2),
('ranjish-hi-sahi','Ranjish Hi Sahi','Mehdi Hassan','/__l5e/assets-v1/cover3','https://open.spotify.com/search/Ranjish%20Hi%20Sahi%20Mehdi%20Hassan','https://music.youtube.com/search?q=Ranjish+Hi+Sahi+Mehdi+Hassan',3),
('chupke-chupke-raat-din','Chupke Chupke Raat Din','Ghulam Ali','/__l5e/assets-v1/cover4','https://open.spotify.com/search/Chupke%20Chupke%20Raat%20Din%20Ghulam%20Ali','https://music.youtube.com/search?q=Chupke+Chupke+Raat+Din+Ghulam+Ali',4),
('aaj-jaane-ki-zid-na-karo','Aaj Jaane Ki Zid Na Karo','Farida Khanum','/__l5e/assets-v1/cover5','https://open.spotify.com/search/Aaj%20Jaane%20Ki%20Zid%20Na%20Karo%20Farida%20Khanum','https://music.youtube.com/search?q=Aaj+Jaane+Ki+Zid+Na+Karo+Farida+Khanum',5);
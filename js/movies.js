/* ==========================================================================
   CODEXSTUDYS — Demo movie/series data module
   Replace `videoUrl` with your own authorized content URLs later.
   All entries are placeholder/demo content only.
   ========================================================================== */

const DEMO_VIDEO = "assets/demo-video.mp4"; // DEMO source — swap per title when ready
const DEMO_VIDEO_WEBM = "assets/demo-video.webm"; // WebM fallback for broader browser support

const GRADIENTS = [
  ["#2b1a12", "#4a2c1a"], // amber/wine
  ["#0f1b2b", "#1c3350"], // deep blue
  ["#1a1220", "#3a2140"], // plum
  ["#0d1f1a", "#1c3b2f"], // forest
  ["#241417", "#4a1f28"], // crimson
  ["#141414", "#2a2a2a"], // slate
  ["#1c1608", "#3d2f0e"], // gold-black
  ["#101820", "#22303f"], // steel
  ["#1e1010", "#3d1a1a"], // ember
  ["#12181c", "#233038"], // graphite teal
];

const GENRE_ICONS = {
  Action:
    '<path d="M14.5 2 3 13.5 9 14l-1 8L20 10l-6 .5z"/>',
  Comedy:
    '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
  Drama:
    '<path d="M12 3c-3 3-3 6 0 9s3 6 0 9M6 6c1.5 2 1.5 4 0 6M18 6c-1.5 2-1.5 4 0 6"/>',
  Thriller:
    '<path d="M12 2 2 22h20L12 2z"/><path d="M12 9v6M12 17.5h.01"/>',
  Romance:
    '<path d="M12 21s-7-4.5-9.5-9C.7 8.1 2.3 4 6.2 4 8.5 4 10.4 5.3 12 7c1.6-1.7 3.5-3 5.8-3 3.9 0 5.5 4.1 3.7 8-2.5 4.5-9.5 9-9.5 9z"/>',
  "Sci-Fi":
    '<circle cx="12" cy="12" r="3"/><path d="M2 12c3-6 17-6 20 0-3 6-17 6-20 0z"/>',
  Horror:
    '<path d="M12 2C7 2 4 6 4 11v7l3-2 2 2 3-3 3 3 2-2 3 2v-7c0-5-3-9-8-9z"/>',
  Animation:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5M16 4v5"/>',
  Crime:
    '<path d="M6 3h12l2 4-8 14L4 7z"/><path d="M4 7h16"/>',
  Adventure:
    '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
  Fantasy:
    '<path d="M12 2 9 9l-7 1 5 5-1 7 6-4 6 4-1-7 5-5-7-1z"/>',
};

const GENRE_LIST = Object.keys(GENRE_ICONS);

function gradientFor(seed) {
  return GRADIENTS[seed % GRADIENTS.length];
}

/**
 * Movie / series catalogue.
 * Fields: id, title, description, year, duration, rating, genre[],
 *         language, quality, type ('movie'|'series'), episodes?, videoUrl
 */
const MOVIES = [
  { id: 1, title: "Iron Horizon", year: 2026, duration: "2h 18m", rating: "8.4", uaRating: "U/A 16+", genre: ["Action", "Sci-Fi"], language: "English", quality: "4K", type: "movie", tags: ["Trending", "Popular"],
    description: "A disgraced pilot steals an experimental war-craft to stop a corporate coup from igniting an orbital war." },
  { id: 2, title: "Velvet Static", year: 2025, duration: "1h 54m", rating: "7.9", uaRating: "U/A 13+", genre: ["Thriller", "Drama"], language: "Hindi", quality: "HD", type: "movie", tags: ["Trending"],
    description: "A radio host uncovers a decades-old conspiracy buried inside the static between broadcast frequencies." },
  { id: 3, title: "Paper Lanterns", year: 2024, duration: "2h 02m", rating: "8.1", uaRating: "U/A 7+", genre: ["Romance", "Drama"], language: "English", quality: "HD", type: "movie", tags: ["Popular"],
    description: "Two strangers exchange letters through a floating lantern festival, unaware they're falling for a ghost from each other's past." },
  { id: 4, title: "Ashfall Protocol", year: 2026, duration: "2h 26m", rating: "8.7", uaRating: "U/A 16+", genre: ["Action", "Thriller"], language: "English", quality: "4K", type: "movie", tags: ["Trending", "Latest"],
    description: "An elite extraction team has six hours to breach a volcano-buried bunker before a rogue AI launches its payload." },
  { id: 5, title: "Laugh Track", year: 2025, duration: "1h 48m", rating: "7.3", uaRating: "U/A 13+", genre: ["Comedy"], language: "English", quality: "HD", type: "movie", tags: ["Popular"],
    description: "A washed-up sitcom star is forced to live-stream his chaotic family reunion after his agent loses his phone." },
  { id: 6, title: "The Glass Orchard", year: 2023, duration: "2h 10m", rating: "8.0", uaRating: "U/A 7+", genre: ["Drama"], language: "Tamil", quality: "HD", type: "movie", tags: ["Latest"],
    description: "A vineyard heiress must choose between tradition and survival as a drought threatens three generations of legacy." },
  { id: 7, title: "Nightbound", year: 2026, duration: "1h 56m", rating: "7.8", uaRating: "U/A 16+", genre: ["Horror", "Thriller"], language: "English", quality: "4K", type: "movie", tags: ["Trending", "Latest"],
    description: "A night-shift nurse realizes the hospital's newest ward only admits patients who are already dead." },
  { id: 8, title: "Comic Relief Inc.", year: 2024, duration: "1h 39m", rating: "6.9", uaRating: "U/A 13+", genre: ["Comedy"], language: "Hindi", quality: "HD", type: "movie", tags: ["Popular"],
    description: "Two rival stand-up comics accidentally swap careers after a stage mishap goes viral for all the wrong reasons." },
  { id: 9, title: "Crimson Ledger", year: 2025, duration: "2h 14m", rating: "8.3", uaRating: "U/A 16+", genre: ["Crime", "Thriller"], language: "English", quality: "4K", type: "movie", tags: ["Trending"],
    description: "A forensic accountant unravels a laundering empire hidden inside her own family's charity foundation." },
  { id: 10, title: "Skyward Drift", year: 2022, duration: "2h 05m", rating: "7.6", uaRating: "U/A 7+", genre: ["Adventure", "Fantasy"], language: "English", quality: "HD", type: "movie", tags: ["Latest"],
    description: "A cartographer discovers a floating archipelago that only appears to those who've lost something irreplaceable." },
  { id: 11, title: "Marigold & Rust", year: 2021, duration: "1h 58m", rating: "7.4", uaRating: "U/A 13+", genre: ["Romance"], language: "Telugu", quality: "HD", type: "movie", tags: ["Popular"],
    description: "A restorer of vintage motorcycles and a botanist rebuild a garden neither of them was ready to let go of." },
  { id: 12, title: "The Last Vault", year: 2026, duration: "2h 22m", rating: "8.6", uaRating: "U/A 16+", genre: ["Action", "Crime"], language: "English", quality: "4K", type: "movie", tags: ["Trending", "Latest"],
    description: "A retired safecracker is pulled back for one impossible job: rob the vault that put her away for a decade." },

  { id: 101, title: "Fracture City", year: 2026, duration: "6 Episodes", rating: "8.8", uaRating: "U/A 16+", genre: ["Thriller", "Crime"], language: "English", quality: "4K", type: "series", tags: ["Trending", "Web Series"],
    description: "A detective and the hacker who framed her are forced to work together as the city's grid collapses.",
    episodes: [
      { ep: 1, title: "Blackout", duration: "48m" },
      { ep: 2, title: "Ghost Ledger", duration: "51m" },
      { ep: 3, title: "The Informant", duration: "46m" },
      { ep: 4, title: "Static Line", duration: "49m" },
      { ep: 5, title: "Fail-Safe", duration: "53m" },
      { ep: 6, title: "Fracture Point", duration: "58m" },
    ] },
  { id: 102, title: "Hearthside", year: 2025, duration: "8 Episodes", rating: "8.0", uaRating: "U/A 7+", genre: ["Drama", "Romance"], language: "English", quality: "HD", type: "series", tags: ["Popular", "Web Series"],
    description: "Four estranged siblings reopen their late father's countryside inn for one final, complicated summer.",
    episodes: [
      { ep: 1, title: "The Keys", duration: "42m" },
      { ep: 2, title: "First Guests", duration: "44m" },
      { ep: 3, title: "Storm Season", duration: "45m" },
      { ep: 4, title: "Old Ledger", duration: "43m" },
    ] },
  { id: 103, title: "Nightshade Academy", year: 2026, duration: "10 Episodes", rating: "7.7", uaRating: "U/A 13+", genre: ["Fantasy", "Drama"], language: "Hindi", quality: "4K", type: "series", tags: ["Latest", "Web Series"],
    description: "A boarding school for the descendants of forgotten gods hides a war that never actually ended.",
    episodes: [
      { ep: 1, title: "Orientation", duration: "40m" },
      { ep: 2, title: "The Old Wing", duration: "41m" },
      { ep: 3, title: "Bloodlines", duration: "44m" },
    ] },
  { id: 104, title: "Punchline", year: 2024, duration: "5 Episodes", rating: "7.2", uaRating: "U/A 13+", genre: ["Comedy"], language: "English", quality: "HD", type: "series", tags: ["Popular", "Web Series"],
    description: "A failing comedy club's last hope is a booking algorithm that keeps scheduling the same disastrous night.",
    episodes: [
      { ep: 1, title: "Open Mic", duration: "28m" },
      { ep: 2, title: "The Algorithm", duration: "30m" },
      { ep: 3, title: "Heckler's Row", duration: "27m" },
    ] },
  { id: 105, title: "Departure Point", year: 2026, duration: "6 Episodes", rating: "8.5", uaRating: "U/A 16+", genre: ["Sci-Fi", "Thriller"], language: "English", quality: "4K", type: "series", tags: ["Trending", "Web Series"],
    description: "Six strangers wake up on a train that departed a station which, according to every record, was demolished years ago.",
    episodes: [
      { ep: 1, title: "Platform Zero", duration: "50m" },
      { ep: 2, title: "The Manifest", duration: "47m" },
      { ep: 3, title: "Loop", duration: "52m" },
    ] },
];

MOVIES.forEach((m) => {
  const [c0, c1] = gradientFor(m.id);
  m.colorA = c0;
  m.colorB = c1;
  m.icon = GENRE_ICONS[m.genre[0]] || GENRE_ICONS.Drama;
  m.videoUrl = DEMO_VIDEO;
  m.videoUrlWebm = DEMO_VIDEO_WEBM;
});

const CATEGORIES = [
  { key: "Trending", label: "Trending Now" },
  { key: "Popular", label: "Popular Movies" },
  { key: "Latest", label: "Latest Releases" },
  { key: "Action", label: "Action", isGenre: true },
  { key: "Comedy", label: "Comedy", isGenre: true },
  { key: "Web Series", label: "Web Series" },
];

function byTagOrGenre(cat) {
  return MOVIES.filter((m) =>
    cat.isGenre ? m.genre.includes(cat.key) : m.tags.includes(cat.key)
  );
}

function findMovie(id) {
  return MOVIES.find((m) => String(m.id) === String(id));
}

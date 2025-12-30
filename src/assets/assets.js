import bell_icon from "./bell.png";
import home_icon from "./home.png";
import like_icon from "./like.png";
import loop_icon from "./loop.png";
import mic_icon from "./mic.png";
import next_icon from "./next.png";
import play_icon from "./play.png";
import pause_icon from "./pause.png";
import plays_icon from "./plays.png";
import prev_icon from "./prev.png";
import search_icon from "./search.png";
import shuffle_icon from "./shuffle.png";
import speaker_icon from "./speaker.png";
import stack_icon from "./stack.png";
import zoom_icon from "./zoom.png";
import plus_icon from "./plus.png";
import arrow_icon from "./arrow.png";
import mini_player_icon from "./mini-player.png";
import queue_icon from "./queue.png";
import volume_icon from "./volume.png";
import arrow_right from "./right_arrow.png";
import arrow_left from "./left_arrow.png";
import spotify_logo from "./spotify_logo.png";
import clock_icon from "./clock_icon.png";
import img1 from "./img1.jpg";
import img2 from "./img2.jpg";
import img3 from "./img3.jpg";
import img4 from "./img4.jpg";
import img5 from "./img5.jpg";
import img6 from "./img6.jpg";
import img7 from "./img7.jpg";
import img8 from "./img8.jpg";
import img11 from "./img11.jpg";
import img12 from "./img12.jpg";
import img13 from "./img13.jpg";
import img14 from "./img14.jpg";
import img15 from "./img15.jpg";
import img16 from "./img16.jpg";
import song1 from "./song1.mp3";
import song2 from "./song2.mp3";
import song3 from "./song3.mp3";
import song4 from "./song4.mp3";
import song5 from "./song5.mp3";
import song6 from "./song6.mp3";
import song7 from "./song7.mp3";
import song8 from "./song8.mp3";

export const assets = {
  bell_icon,
  home_icon,
  like_icon,
  loop_icon,
  mic_icon,
  next_icon,
  play_icon,
  plays_icon,
  prev_icon,
  search_icon,
  shuffle_icon,
  speaker_icon,
  stack_icon,
  zoom_icon,
  plus_icon,
  arrow_icon,
  mini_player_icon,
  volume_icon,
  queue_icon,
  pause_icon,
  arrow_left,
  arrow_right,
  spotify_logo,
  clock_icon,
};

// Library items for the sidebar
export const libraryData = [
  {
    id: 0,
    name: "December 2025",
    type: "Playlist",
    creator: "Stanislas Coppin",
    image: img8,
    isPlaying: true,
  },
  {
    id: 1,
    name: "D>E>A>T>H>M>E>T>A>L",
    type: "Album",
    creator: "Panchiko",
    image: img1,
  },
  {
    id: 2,
    name: "Frida music",
    type: "Playlist",
    creator: "Stanislas Coppin",
    image: img2,
  },
  {
    id: 3,
    name: "If Not Now When",
    type: "Album",
    creator: "Vangelis Katsoulis",
    image: img3,
  },
  {
    id: 4,
    name: "Camino Del Sol",
    type: "Album",
    creator: "Antena",
    image: img4,
  },
  {
    id: 5,
    name: "Stan Getz – Split Kick",
    type: "Playlist",
    creator: "Stanislas Coppin",
    image: img5,
  },
  {
    id: 6,
    name: "Getz/Gilberto",
    type: "Album",
    creator: "Stan Getz",
    image: img6,
  },
  {
    id: 7,
    name: "Your Top Songs 2025",
    type: "Playlist",
    creator: "Spotify",
    image: img7,
  },
  {
    id: 8,
    name: "megacity1000",
    type: "Album",
    creator: "1tbsp",
    image: img11,
  },
  {
    id: 9,
    name: "Soft Rock",
    type: "Album",
    creator: "Thy Slaughter",
    image: img12,
  },
  {
    id: 10,
    name: "Apple",
    type: "Album",
    creator: "A. G. Cook",
    image: img13,
  },
  {
    id: 11,
    name: "Radar des sorties",
    type: "Playlist",
    creator: "Spotify",
    image: img14,
  },
];

// Quick access cards for the top grid
export const quickAccessData = [
  { id: 0, name: "December 2025", image: img8 },
  { id: 1, name: "Le Tunnel secret de Crabinette", image: img1 },
  { id: 2, name: "Frida music", image: img2 },
  { id: 3, name: "Your Top Songs 2025", image: img7 },
  { id: 4, name: "September 2025", image: img4 },
  { id: 5, name: "The Voices Are Coming Back", image: img5 },
  { id: 6, name: "Camino Del Sol", image: img6 },
  { id: 7, name: "Getz/Gilberto", image: img11 },
];

// Picked for you featured content
export const pickedForYouData = {
  id: 0,
  name: "Dîner entre amis",
  type: "Playlist",
  description: "La playlist à la cool pour...",
  image: img15,
};

// Shows/Podcasts
export const showsData = [
  {
    id: 0,
    name: "Oli",
    creator: "France Inter",
    image: img1,
    hasNewEpisode: true,
  },
  {
    id: 1,
    name: "Dis moi pourquoi / Question pour...",
    creator: "Engle",
    image: img2,
  },
  {
    id: 2,
    name: "Petit Lap",
    creator: "Engle",
    image: img3,
  },
];

// Recently played
export const recentlyPlayedData = [
  { id: 0, name: "December 2025", image: img8 },
  { id: 1, name: "D>E>A>T>H>M>E>T>A>L", image: img1 },
  { id: 2, name: "Oli", image: img2, isShow: true },
  { id: 3, name: "Frida music", image: img3 },
  { id: 4, name: "If Not Now When", image: img4 },
];

// Popular with listeners
export const popularWithListenersData = {
  title: "KIDICO : l'encyclopédie sonore pour les enfants",
  items: [
    { id: 0, name: "MES FABLES", image: img11 },
    { id: 1, name: "Quiz Le Petit", image: img12 },
    { id: 2, name: "imagesDOC", image: img13 },
    { id: 3, name: "EPIDEMIC", image: img14 },
    { id: 4, name: "Grame de", image: img15 },
  ],
};

// Artist data for the right panel
export const artistsData = [
  {
    id: 0,
    name: "mischluft",
    monthlyListeners: "695,596",
    image: img16,
    bio: "Known for his deep passion for catchy and sexy vocal lines, Mischluft is a Leipzig-based DJ/Producer who has burst onto the scene with hit after hit release. H...",
    isVerified: true,
  },
];

export const albumsData = [
  {
    id: 0,
    name: "Top 50 Global",
    image: img8,
    desc: "Weekly top tracks worldwide.",
    bgColor: "#2a4365",
  },
  {
    id: 1,
    name: "Top 50 Songs Sleep",
    image: img6,
    desc: "Weekly top tracks for relaxation.",
    bgColor: "#22543d",
  },
  {
    id: 2,
    name: "Trending Meditation",
    image: img13,
    desc: "Current popular meditation tracks.",
    bgColor: "#742a2a",
  },
  {
    id: 3,
    name: "Trending Global",
    image: img16,
    desc: "Top trending tracks globally.",
    bgColor: "#44337a",
  },
  {
    id: 4,
    name: "Mega Hits",
    image: img11,
    desc: "Biggest hits right now.",
    bgColor: "#234e52",
  },
  {
    id: 5,
    name: "Happy Favorites",
    image: img15,
    desc: "Top tracks to brighten your mood.",
    bgColor: "#744210",
  },
];

export const songsData = [
  {
    id: 0,
    name: "Love U",
    image: img8,
    file: song1,
    author: "mischluft",
    desc: "Deep house vibes",
    duration: "4:22",
    isVerified: true,
  },
  {
    id: 1,
    name: "DJ Joanna - Bos Muda",
    image: img2,
    file: song2,
    author: "",
    desc: "Chasing dreams, breaking schemes, bossing up every day",
    duration: "5:33",
  },
  {
    id: 2,
    name: "Locked Away",
    image: img3,
    file: song3,
    author: "R. City featuring Adam Levine",
    desc: "Will you still love me when I'm down and out?",
    duration: "4:25",
  },
  {
    id: 3,
    name: "Starboy",
    image: img4,
    file: song4,
    author: "The Weeknd",
    desc: "Living large, I'm a starboy",
    duration: "4:34",
  },
  {
    id: 4,
    name: "Viva La Vida",
    image: img5,
    file: song5,
    author: "Coldplay",
    desc: "I used to rule the world, now I'm just a ghost",
    duration: "4:02",
  },
  {
    id: 5,
    name: "Pompeii",
    image: img14,
    file: song6,
    author: "Bastille",
    desc: "Still the same, in the same place",
    duration: "3:52",
  },
  {
    id: 6,
    name: "I Love You 3000",
    image: img7,
    file: song7,
    author: "Stephanie Poetri",
    desc: "You're my everything, you're my all",
    duration: "3:30",
  },
  {
    id: 7,
    name: "Angel Baby",
    image: img12,
    file: song8,
    author: "Troye Sivan",
    desc: "I'm a sucker for the way you move",
    duration: "3:41",
  },
];

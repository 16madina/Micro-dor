/**
 * MICRO D’OR — données de démonstration.
 * Toutes les écoles, personnes, dates et statistiques sont fictives.
 */
import type {
  Capsule,
  Category,
  PartnerSlot,
  Product,
  Region,
  School,
  Show,
  ShowStatus,
  Talent,
  Theme,
} from './types'

export * from './types'

export const CATEGORY_LABEL: Record<Category | 'mixte', string> = {
  chant: 'Chant',
  slam: 'Slam',
  rap: 'Rap conscience',
  danse: 'Danse',
  theatre: 'Théâtre',
  mixte: 'Multidisciplinaire',
}

export const STATUS_LABEL: Record<ShowStatus, string> = {
  live: 'En direct (Démo)',
  upcoming: 'À venir',
  replay: 'Rediffusion',
}

/** Les 17 régions administratives du Québec */
export const REGIONS: Region[] = [
  { id: 'bas-saint-laurent', code: '01', name: 'Bas-Saint-Laurent' },
  { id: 'saguenay', code: '02', name: 'Saguenay–Lac-Saint-Jean' },
  { id: 'capitale-nationale', code: '03', name: 'Capitale-Nationale' },
  { id: 'mauricie', code: '04', name: 'Mauricie' },
  { id: 'estrie', code: '05', name: 'Estrie' },
  { id: 'montreal', code: '06', name: 'Montréal' },
  { id: 'outaouais', code: '07', name: 'Outaouais' },
  { id: 'abitibi', code: '08', name: 'Abitibi-Témiscamingue' },
  { id: 'cote-nord', code: '09', name: 'Côte-Nord' },
  { id: 'nord-du-quebec', code: '10', name: 'Nord-du-Québec' },
  { id: 'gaspesie', code: '11', name: 'Gaspésie–Îles-de-la-Madeleine' },
  { id: 'chaudiere-appalaches', code: '12', name: 'Chaudière-Appalaches' },
  { id: 'laval', code: '13', name: 'Laval' },
  { id: 'lanaudiere', code: '14', name: 'Lanaudière' },
  { id: 'laurentides', code: '15', name: 'Laurentides' },
  { id: 'monteregie', code: '16', name: 'Montérégie' },
  { id: 'centre-du-quebec', code: '17', name: 'Centre-du-Québec' },
]

export const SCHOOLS: School[] = [
  {
    id: 'lumieres',
    name: 'École secondaire des Lumières',
    shortName: 'Les Lumières',
    city: 'Montréal',
    regionId: 'montreal',
    participants: 128,
    tagline: 'Là où chaque voix trouve sa lumière.',
    description:
      'Une école dynamique au cœur de la métropole, qui mise sur la créativité, l’expression et l’engagement des jeunes. Son programme arts-études accueille la finale locale MICRO D’OR.',
    motto: 'Briller ensemble',
    programs: ['Arts-études musique', 'Club de slam', 'Studio d’enregistrement'],
    accent: '#F4D78C',
    accent2: '#6837B5',
    scene: 'city',
    palette: 'violet',
    lat: 45.5,
    lon: -73.57,
  },
  {
    id: 'horizon',
    name: 'École secondaire Horizon',
    shortName: 'Horizon',
    city: 'Laval',
    regionId: 'laval',
    participants: 96,
    tagline: 'Regarder plus loin, viser plus haut.',
    description:
      'Reconnue pour son parascolaire foisonnant, l’école Horizon fait du rap conscience un outil de dialogue entre élèves, enseignants et familles.',
    motto: 'Plus loin que l’horizon',
    programs: ['Concentration hip-hop', 'Radio étudiante', 'Comité vie scolaire'],
    accent: '#FF9F5A',
    accent2: '#B4366E',
    scene: 'island',
    palette: 'amber',
    lat: 45.57,
    lon: -73.69,
  },
  {
    id: 'fleuve',
    name: 'École secondaire du Fleuve',
    shortName: 'Le Fleuve',
    city: 'Longueuil',
    regionId: 'monteregie',
    participants: 102,
    tagline: 'Des mots qui coulent de source.',
    description:
      'Face au Saint-Laurent, l’école du Fleuve cultive la poésie orale et la scène ouverte. Son club de slam est l’un des plus actifs de la Rive-Sud.',
    motto: 'Le courant nous porte',
    programs: ['Ligue d’impro et de slam', 'Chorale', 'Atelier d’écriture'],
    accent: '#5CC8E8',
    accent2: '#2B4FA8',
    scene: 'river',
    palette: 'blue',
    lat: 45.53,
    lon: -73.52,
  },
  {
    id: 'etoiles',
    name: 'École secondaire des Étoiles',
    shortName: 'Les Étoiles',
    city: 'Québec',
    regionId: 'capitale-nationale',
    participants: 88,
    tagline: 'Chaque talent est une constellation.',
    description:
      'Dans la Capitale-Nationale, l’école des Étoiles marie patrimoine et création contemporaine. Ses élèves signent textes, mélodies et mises en scène.',
    motto: 'Viser les étoiles',
    programs: ['Théâtre musical', 'Slam et poésie', 'Production audio'],
    accent: '#C9B6FF',
    accent2: '#3B2A8F',
    scene: 'stars',
    palette: 'magenta',
    lat: 46.81,
    lon: -71.21,
  },
  {
    id: 'nouvelle-voix',
    name: 'École secondaire Nouvelle Voix',
    shortName: 'Nouvelle Voix',
    city: 'Gatineau',
    regionId: 'outaouais',
    participants: 76,
    tagline: 'Une nouvelle génération prend le micro.',
    description:
      'Architecture moderne et studio de création flambant neuf : Nouvelle Voix accueille une communauté multiculturelle qui fait vibrer l’Outaouais.',
    motto: 'Ta voix compte',
    programs: ['Studio de création', 'Chant choral', 'Médias numériques'],
    accent: '#7CF0C2',
    accent2: '#147A6B',
    scene: 'modern',
    palette: 'teal',
    lat: 45.48,
    lon: -75.7,
  },
  {
    id: 'sommet',
    name: 'École secondaire du Sommet',
    shortName: 'Le Sommet',
    city: 'Sherbrooke',
    regionId: 'estrie',
    participants: 82,
    tagline: 'Chaque pas compte vers le sommet.',
    description:
      'Nichée dans les collines de l’Estrie, l’école du Sommet fait de la persévérance sa signature. Son projet rap conscience a vu naître plusieurs talents.',
    motto: 'Monter, toujours',
    programs: ['Rap conscience', 'Plein air et culture', 'Mentorat'],
    accent: '#F2C14E',
    accent2: '#8A3B12',
    scene: 'mountain',
    palette: 'gold',
    lat: 45.4,
    lon: -71.89,
  },
  {
    id: 'rivieres',
    name: 'École secondaire des Rivières',
    shortName: 'Les Rivières',
    city: 'Trois-Rivières',
    regionId: 'mauricie',
    participants: 71,
    tagline: 'Là où les voix se rejoignent.',
    description:
      'Au confluent du Saint-Maurice, cette école mise sur la musique comme pont entre les cultures et les générations.',
    motto: 'Unir nos voix',
    programs: ['Harmonie et chant', 'Écriture de chansons', 'Projet intergénérationnel'],
    accent: '#FF7A8A',
    accent2: '#7A1E3A',
    scene: 'bridge',
    palette: 'crimson',
    lat: 46.35,
    lon: -72.55,
  },
  {
    id: 'boreale',
    name: 'École secondaire Boréale',
    shortName: 'Boréale',
    city: 'Saguenay',
    regionId: 'saguenay',
    participants: 64,
    tagline: 'Le Nord a du souffle.',
    description:
      'Entre fjord et forêt boréale, cette école réunit des artistes qui puisent dans le territoire la force de leurs textes et de leurs mélodies.',
    motto: 'Le souffle du Nord',
    programs: ['Musique et territoire', 'Slam autochtone et allochtone', 'Captation vidéo'],
    accent: '#8BF5A6',
    accent2: '#5B2FA8',
    scene: 'aurora',
    palette: 'teal',
    lat: 48.43,
    lon: -71.07,
  },
]

const SKIN = ['#4a2f22', '#6e452d', '#9a6542', '#c38f68', '#e2b893']

export const TALENTS: Talent[] = [
  // Les Lumières — Montréal
  {
    id: 'maya-l',
    name: 'Maya L.',
    schoolId: 'lumieres',
    category: 'chant',
    supports: 1248,
    bio: 'Passionnée de musique depuis l’enfance, Maya aime transmettre des émotions et inspirer les autres. Elle écrit ses propres mélodies entre soul et pop francophone.',
    quote: 'Quand je chante, j’ai l’impression que tout le monde respire avec moi.',
    look: { skin: SKIN[1], hair: 'curly', hairColor: '#1a0f0a', top: '#2a1838', palette: 'violet' },
    influences: ['Soul', 'Pop francophone', 'Gospel'],
    performances: [
      { title: 'Lumière intérieure', duration: '3:42', showId: 's1' },
      { title: 'Respire', duration: '3:15', showId: 's9' },
    ],
  },
  {
    id: 'karim-s',
    name: 'Karim S.',
    schoolId: 'lumieres',
    category: 'rap',
    supports: 902,
    bio: 'Karim écrit sur son quartier, ses amis et les choix qui façonnent une vie. Son flow posé fait passer des messages forts sans jamais faire la morale.',
    quote: 'Mes rimes, c’est ma façon de dire : on vaut mieux que les clichés.',
    look: { skin: SKIN[2], hair: 'fade', hairColor: '#120c08', top: '#1b2238', palette: 'gold' },
    influences: ['Rap conscience', 'Boom bap', 'Jazz'],
    performances: [{ title: 'Le bon chemin', duration: '3:28', showId: 's1' }],
  },
  {
    id: 'rosalie-d',
    name: 'Rosalie D.',
    schoolId: 'lumieres',
    category: 'theatre',
    supports: 734,
    bio: 'Rosalie a découvert le théâtre en secondaire 2. Depuis, elle écrit et joue des monologues qui parlent d’amitié, d’anxiété et de courage.',
    quote: 'Sur scène, j’ose dire ce que je n’arrive pas à dire ailleurs.',
    look: { skin: SKIN[4], hair: 'long', hairColor: '#5a3a1e', top: '#3a1630', palette: 'magenta' },
    influences: ['Théâtre', 'Monologue', 'Improvisation'],
    performances: [{ title: 'Carnet ouvert', duration: '2:56', showId: 's1' }],
  },
  // Horizon — Laval
  {
    id: 'sarah-m',
    name: 'Sarah M.',
    schoolId: 'horizon',
    category: 'rap',
    supports: 1176,
    bio: 'Sarah fait du rap conscience un espace de dialogue. Ses textes abordent la pression des réseaux sociaux et l’importance de choisir sa propre route.',
    quote: 'Je rappe pour celles et ceux qui pensent ne pas avoir de voix.',
    look: { skin: SKIN[3], hair: 'beanie', hairColor: '#2a1a10', top: '#3b1414', palette: 'crimson' },
    influences: ['Rap conscience', 'R&B', 'Trap mélodique'],
    performances: [
      { title: 'Mon propre chemin', duration: '3:35', showId: 's11' },
      { title: 'Filtres', duration: '3:02', showId: 's4' },
    ],
  },
  {
    id: 'jade-t',
    name: 'Jade T.',
    schoolId: 'horizon',
    category: 'danse',
    supports: 811,
    bio: 'Jade danse depuis l’âge de six ans. Elle mélange contemporain et hip-hop et chorégraphie les numéros de groupe de son école.',
    quote: 'Quand les mots ne suffisent plus, je danse.',
    look: { skin: SKIN[4], hair: 'bun', hairColor: '#2b1a12', top: '#30204a', palette: 'amber' },
    influences: ['Danse contemporaine', 'Hip-hop', 'Jazz'],
    performances: [{ title: 'Reprise en lumière', duration: '3:51', showId: 's11' }],
  },
  {
    id: 'samuel-p',
    name: 'Samuel P.',
    schoolId: 'horizon',
    category: 'theatre',
    supports: 623,
    bio: 'Samuel est le pilier de la ligue d’impro de son école. Il joue vite, fort et avec humour, et anime aussi la radio étudiante.',
    quote: 'Faire rire, puis faire réfléchir. Dans cet ordre.',
    look: { skin: SKIN[3], hair: 'short', hairColor: '#3a2414', top: '#14283a', palette: 'blue' },
    influences: ['Improvisation', 'Humour', 'Théâtre'],
    performances: [{ title: 'Ondes courtes', duration: '2:40', showId: 's4' }],
  },
  // Le Fleuve — Longueuil
  {
    id: 'nathan-b',
    name: 'Nathan B.',
    schoolId: 'fleuve',
    category: 'slam',
    supports: 982,
    bio: 'Nathan écrit au bord du fleuve. Ses slams, rythmés comme des vagues, parlent de persévérance et de la fierté de finir ce qu’on commence.',
    quote: 'J’ai failli lâcher l’école. Le slam m’a donné une raison de rester.',
    look: { skin: SKIN[2], hair: 'afro', hairColor: '#120a06', top: '#162a3a', palette: 'blue' },
    influences: ['Slam', 'Poésie haïtienne', 'Jazz'],
    performances: [
      { title: 'Marée haute', duration: '3:10', showId: 's10' },
      { title: 'Finir ce qu’on commence', duration: '2:58', showId: 's8' },
    ],
  },
  {
    id: 'ines-b',
    name: 'Inès B.',
    schoolId: 'fleuve',
    category: 'chant',
    supports: 757,
    bio: 'Inès chante en français, en arabe et en anglais. Elle rêve de créer une chorale qui rassemble toutes les langues de son école.',
    quote: 'La musique n’a pas besoin de traduction.',
    look: { skin: SKIN[2], hair: 'long', hairColor: '#120a06', top: '#2b1a3c', palette: 'violet' },
    influences: ['Pop', 'Musique arabe', 'Chorale'],
    performances: [{ title: 'Trois langues', duration: '3:30', showId: 's10' }],
  },
  {
    id: 'theo-m',
    name: 'Théo M.',
    schoolId: 'fleuve',
    category: 'rap',
    supports: 688,
    bio: 'Théo produit ses propres beats sur l’ordinateur de la bibliothèque. Ses textes parlent d’entraide et de seconde chance.',
    quote: 'Tout le monde mérite une deuxième prise.',
    look: { skin: SKIN[4], hair: 'hood', hairColor: '#2a1a10', top: '#1d2433', palette: 'teal' },
    influences: ['Rap', 'Lo-fi', 'Électro'],
    performances: [{ title: 'Deuxième prise', duration: '3:05', showId: 's8' }],
  },
  // Les Étoiles — Québec
  {
    id: 'lea-r',
    name: 'Léa R.',
    schoolId: 'etoiles',
    category: 'slam',
    supports: 931,
    bio: 'Léa slamme pour celles et ceux qu’on n’entend pas. Ses textes sur l’estime de soi ont été lus devant toute son école.',
    quote: 'On n’est pas trop. On est juste assez.',
    look: { skin: SKIN[4], hair: 'ponytail', hairColor: '#7a4a22', top: '#2c1e4a', palette: 'magenta' },
    influences: ['Slam', 'Poésie québécoise', 'Rap'],
    performances: [
      { title: 'Juste assez', duration: '2:47', showId: 's3' },
      { title: 'Constellation', duration: '3:12', showId: 's3' },
    ],
  },
  {
    id: 'olivier-g',
    name: 'Olivier G.',
    schoolId: 'etoiles',
    category: 'rap',
    supports: 845,
    bio: 'Olivier mélange rap et violoncelle. Il veut montrer qu’on peut aimer la musique classique et le hip-hop en même temps.',
    quote: 'Les étiquettes, c’est pour les bouteilles.',
    look: { skin: SKIN[4], hair: 'curly', hairColor: '#4a2a14', top: '#1a2236', palette: 'gold' },
    influences: ['Rap', 'Classique', 'Néo-soul'],
    performances: [{ title: 'Cordes sensibles', duration: '3:40', showId: 's3' }],
  },
  {
    id: 'chloe-v',
    name: 'Chloé V.',
    schoolId: 'etoiles',
    category: 'theatre',
    supports: 712,
    bio: 'Chloé fait partie de la troupe de théâtre musical des Étoiles. Longtemps timide, elle encourage aujourd’hui les autres à monter sur scène.',
    quote: 'Le trac, c’est juste de l’énergie qui attend d’être utilisée.',
    look: { skin: SKIN[3], hair: 'bun', hairColor: '#3a2010', top: '#3a1a2a', palette: 'violet' },
    influences: ['Théâtre musical', 'Comédie', 'Chant'],
    performances: [{ title: 'Sans filet', duration: '3:24', showId: 's3' }],
  },
  // Nouvelle Voix — Gatineau
  {
    id: 'malik-d',
    name: 'Malik D.',
    schoolId: 'nouvelle-voix',
    category: 'chant',
    supports: 945,
    bio: 'Malik chante le R&B avec une douceur rare. Il compose au piano et partage ses chansons avec les élèves de 1re secondaire pour les inspirer.',
    quote: 'Si une chanson aide une seule personne, elle a réussi.',
    look: { skin: SKIN[0], hair: 'short', hairColor: '#0a0604', top: '#142a28', palette: 'teal' },
    influences: ['R&B', 'Soul', 'Piano'],
    performances: [
      { title: 'Doucement', duration: '3:33', showId: 's2' },
      { title: 'Prends ma main', duration: '3:48', showId: 's9' },
    ],
  },
  {
    id: 'amira-h',
    name: 'Amira H.',
    schoolId: 'nouvelle-voix',
    category: 'slam',
    supports: 798,
    bio: 'Amira slamme sur l’identité, l’appartenance et la fierté de ses deux cultures. Une plume précise et lumineuse.',
    quote: 'Je suis d’ici et d’ailleurs, et c’est ma force.',
    look: { skin: SKIN[2], hair: 'hood', hairColor: '#120a06', top: '#2a1a40', palette: 'magenta' },
    influences: ['Slam', 'Poésie', 'Musique du monde'],
    performances: [{ title: 'D’ici et d’ailleurs', duration: '3:01', showId: 's2' }],
  },
  {
    id: 'felix-l',
    name: 'Félix L.',
    schoolId: 'nouvelle-voix',
    category: 'danse',
    supports: 654,
    bio: 'Félix a trouvé dans le breakdance une façon de canaliser son énergie. Il anime des ateliers de danse à la maison des jeunes.',
    quote: 'Chaque chute m’a appris un nouveau mouvement.',
    look: { skin: SKIN[4], hair: 'beanie', hairColor: '#5a3418', top: '#1a2a20', palette: 'teal' },
    influences: ['Breakdance', 'Hip-hop', 'Krump'],
    performances: [{ title: 'Choisir ses pas', duration: '3:14', showId: 's2' }],
  },
  // Le Sommet — Sherbrooke
  {
    id: 'adam-k',
    name: 'Adam K.',
    schoolId: 'sommet',
    category: 'rap',
    supports: 889,
    bio: 'Adam rappe la persévérance : celle qu’il a fallu pour se remettre d’une blessure sportive et retrouver sa motivation à l’école.',
    quote: 'Tomber, c’est normal. Rester par terre, c’est un choix.',
    look: { skin: SKIN[1], hair: 'fade', hairColor: '#0a0604', top: '#2a2010', palette: 'gold' },
    influences: ['Rap conscience', 'Gospel', 'Afrobeat'],
    performances: [
      { title: 'Se relever', duration: '3:20', showId: 's12' },
      { title: 'Altitude', duration: '3:08', showId: 's7' },
    ],
  },
  {
    id: 'alex-t',
    name: 'Alex T.',
    schoolId: 'sommet',
    category: 'rap',
    supports: 612,
    bio: 'Alex écrit depuis le secondaire 1. Ses textes parlent d’amitié, de choix difficiles et de la fierté de sa ville.',
    quote: 'Ma ville, mes mots, ma façon de dire merci.',
    look: { skin: SKIN[3], hair: 'short', hairColor: '#2a1a0c', top: '#1a1e30', palette: 'amber' },
    influences: ['Rap', 'Chanson', 'Lo-fi'],
    performances: [{ title: 'Merci Sherbrooke', duration: '2:52', showId: 's12' }],
  },
  {
    id: 'noemie-j',
    name: 'Noémie J.',
    schoolId: 'sommet',
    category: 'chant',
    supports: 701,
    bio: 'Noémie chante folk et country-pop, guitare à la main. Elle compose sur les sentiers qui entourent son école.',
    quote: 'Une chanson, c’est un sentier : on ne sait jamais où il mène.',
    look: { skin: SKIN[4], hair: 'braids', hairColor: '#8a5a2a', top: '#3a2a14', palette: 'amber' },
    influences: ['Folk', 'Country-pop', 'Chanson'],
    performances: [{ title: 'Sentiers', duration: '3:37', showId: 's7' }],
  },
  // Les Rivières — Trois-Rivières
  {
    id: 'emma-c',
    name: 'Emma C.',
    schoolId: 'rivieres',
    category: 'chant',
    supports: 768,
    bio: 'Emma chante avec la chorale intergénérationnelle de son école. Elle adore les harmonies vocales et les grandes ballades.',
    quote: 'Les plus belles voix sont celles qui chantent ensemble.',
    look: { skin: SKIN[4], hair: 'long', hairColor: '#c08a4a', top: '#3a1424', palette: 'crimson' },
    influences: ['Ballades', 'Chorale', 'Pop'],
    performances: [{ title: 'Confluence', duration: '3:45', showId: 's5' }],
  },
  {
    id: 'yanis-a',
    name: 'Yanis A.',
    schoolId: 'rivieres',
    category: 'slam',
    supports: 690,
    bio: 'Yanis slamme sur le respect et la gestion de la colère. Ses textes sont utilisés en classe pour lancer des discussions.',
    quote: 'La colère, je l’écris au lieu de la crier.',
    look: { skin: SKIN[1], hair: 'curly', hairColor: '#0a0604', top: '#2a1a1a', palette: 'crimson' },
    influences: ['Slam', 'Rap', 'Poésie'],
    performances: [{ title: 'Respirer avant', duration: '2:50', showId: 's5' }],
  },
  {
    id: 'william-r',
    name: 'William R.',
    schoolId: 'rivieres',
    category: 'danse',
    supports: 597,
    bio: 'William danse le street jazz et le hip-hop. Il prépare un numéro sur la réussite autrement : stages, métiers et passions qui deviennent des projets.',
    quote: 'Il y a plus d’un chemin vers la réussite, et plus d’une façon de bouger.',
    look: { skin: SKIN[3], hair: 'beanie', hairColor: '#3a2410', top: '#1a1a2a', palette: 'blue' },
    influences: ['Street jazz', 'Hip-hop', 'Funk'],
    performances: [{ title: 'Autrement', duration: '3:18', showId: 's5' }],
  },
  // Boréale — Saguenay
  {
    id: 'zoe-p',
    name: 'Zoé P.',
    schoolId: 'boreale',
    category: 'danse',
    supports: 742,
    bio: 'Zoé danse le contemporain, inspirée par le fjord et l’hiver. Ses solos racontent le territoire sans un seul mot.',
    quote: 'Le Nord m’a appris la patience. La danse, la confiance.',
    look: { skin: SKIN[4], hair: 'ponytail', hairColor: '#d8b06a', top: '#14303a', palette: 'teal' },
    influences: ['Danse contemporaine', 'Ballet', 'Danse-théâtre'],
    performances: [{ title: 'Fjord', duration: '3:52', showId: 's6' }],
  },
  {
    id: 'mathis-c',
    name: 'Mathis C.',
    schoolId: 'boreale',
    category: 'theatre',
    supports: 655,
    bio: 'Mathis écrit et joue des contes sur l’amitié, la forêt et le besoin de se sentir utile. Il rêve de devenir enseignant de français.',
    quote: 'Une histoire, c’est comme un feu : ça réchauffe quand on la partage.',
    look: { skin: SKIN[4], hair: 'hood', hairColor: '#4a2a14', top: '#2a3a1a', palette: 'gold' },
    influences: ['Conte', 'Théâtre', 'Écriture'],
    performances: [{ title: 'Bois de chauffage', duration: '3:00', showId: 's6' }],
  },
  {
    id: 'aicha-n',
    name: 'Aïcha N.',
    schoolId: 'boreale',
    category: 'rap',
    supports: 721,
    bio: 'Arrivée au Saguenay il y a trois ans, Aïcha rappe l’intégration, l’accueil et l’amitié qui naît dans la neige.',
    quote: 'J’ai trouvé ma place en la créant.',
    look: { skin: SKIN[0], hair: 'braids', hairColor: '#0a0604', top: '#2a1440', palette: 'violet' },
    influences: ['Rap', 'Afrobeat', 'R&B'],
    performances: [{ title: 'Première neige', duration: '3:22', showId: 's6' }],
  },
]

const P = (time: string, label: string, talentId?: string) => ({ time, label, talentId })

export const SHOWS: Show[] = [
  // ---- Directs simulés (3)
  {
    id: 's1',
    title: 'Finale locale — Les Lumières',
    schoolId: 'lumieres',
    date: '2026-11-05',
    time: '19 h 30',
    status: 'live',
    category: 'mixte',
    lineup: ['maya-l', 'karim-s', 'rosalie-d'],
    program: [
      P('19 h 30', 'Ouverture — Chorale des Lumières'),
      P('19 h 40', 'Maya L. — Lumière intérieure', 'maya-l'),
      P('19 h 52', 'Nathan B. (invité) — Marée haute', 'nathan-b'),
      P('20 h 05', 'Rosalie D. — Carnet ouvert', 'rosalie-d'),
      P('20 h 15', 'Capsule prévention — Faire les bons choix'),
      P('20 h 25', 'Karim S. — Le bon chemin', 'karim-s'),
      P('20 h 40', 'Vote du public (simulé) et remise des micros d’or'),
    ],
    description:
      'Trois finalistes, une scène, un public debout : la finale locale de l’École secondaire des Lumières désigne les talents qui représenteront Montréal à la grande finale MICRO D’OR.',
    palette: 'violet',
    venue: 'Auditorium des Lumières',
    duration: '45:20',
  },
  {
    id: 's2',
    title: 'Nouvelle Voix en scène',
    schoolId: 'nouvelle-voix',
    date: '2026-11-05',
    time: '20 h 00',
    status: 'live',
    category: 'mixte',
    lineup: ['malik-d', 'amira-h', 'felix-l'],
    program: [
      P('20 h 00', 'Accueil — Studio de création Nouvelle Voix'),
      P('20 h 08', 'Amira H. — D’ici et d’ailleurs', 'amira-h'),
      P('20 h 18', 'Félix L. — Choisir ses pas', 'felix-l'),
      P('20 h 30', 'Malik D. — Doucement', 'malik-d'),
      P('20 h 42', 'Échange avec le public (démo)'),
    ],
    description:
      'Une soirée intimiste dans le nouveau studio de l’école : R&B, slam et rap conscience pour célébrer la diversité des voix de l’Outaouais.',
    palette: 'teal',
    venue: 'Studio Nouvelle Voix',
    duration: '52:10',
  },
  {
    id: 's3',
    title: 'Constellation — Les Étoiles',
    schoolId: 'etoiles',
    date: '2026-11-05',
    time: '18 h 45',
    status: 'live',
    category: 'mixte',
    lineup: ['lea-r', 'olivier-g', 'chloe-v'],
    program: [
      P('18 h 45', 'Prologue — Ensemble vocal des Étoiles'),
      P('18 h 55', 'Léa R. — Juste assez', 'lea-r'),
      P('19 h 05', 'Olivier G. — Cordes sensibles', 'olivier-g'),
      P('19 h 18', 'Chloé V. — Sans filet', 'chloe-v'),
      P('19 h 30', 'Léa R. — Constellation (rappel)', 'lea-r'),
    ],
    description:
      'Rap, violoncelle, slam et grandes voix : la soirée Constellation fait briller la relève de la Capitale-Nationale.',
    palette: 'magenta',
    venue: 'Salle Polaris',
    duration: '48:05',
  },
  // ---- À venir (6) — étapes de la tournée
  {
    id: 's4',
    title: 'Soirée talents — Horizon',
    schoolId: 'horizon',
    date: '2026-11-20',
    time: '19 h 00',
    status: 'upcoming',
    category: 'rap',
    lineup: ['sarah-m', 'samuel-p', 'jade-t'],
    program: [
      P('19 h 00', 'Ouverture DJ — Radio étudiante Horizon'),
      P('19 h 10', 'Samuel P. — Ondes courtes', 'samuel-p'),
      P('19 h 22', 'Jade T. — Reprise en lumière', 'jade-t'),
      P('19 h 35', 'Sarah M. — Filtres', 'sarah-m'),
      P('19 h 50', 'Table ronde : réseaux sociaux et pression'),
    ],
    description:
      'Le rap conscience à l’honneur à Laval : une soirée qui parle de pression sociale, d’écrans et de la liberté de choisir sa route.',
    palette: 'amber',
    venue: 'Gymnase-spectacle Horizon',
    duration: '50:00',
  },
  {
    id: 's5',
    title: 'Les Rivières chantent',
    schoolId: 'rivieres',
    date: '2026-11-27',
    time: '19 h 00',
    status: 'upcoming',
    category: 'chant',
    lineup: ['emma-c', 'yanis-a', 'william-r'],
    program: [
      P('19 h 00', 'Chorale intergénérationnelle'),
      P('19 h 12', 'Yanis A. — Respirer avant', 'yanis-a'),
      P('19 h 24', 'William R. — Autrement', 'william-r'),
      P('19 h 36', 'Emma C. — Confluence', 'emma-c'),
    ],
    description:
      'Une étape de la tournée MICRO D’OR en Mauricie, où la musique fait le pont entre élèves, familles et aînés.',
    palette: 'crimson',
    venue: 'Agora des Rivières',
    duration: '45:00',
  },
  {
    id: 's6',
    title: 'Nuit du slam boréal',
    schoolId: 'boreale',
    date: '2026-12-04',
    time: '19 h 30',
    status: 'upcoming',
    category: 'slam',
    lineup: ['mathis-c', 'zoe-p', 'aicha-n'],
    program: [
      P('19 h 30', 'Ouverture — Tambours et voix'),
      P('19 h 40', 'Mathis C. — Bois de chauffage', 'mathis-c'),
      P('19 h 52', 'Aïcha N. — Première neige', 'aicha-n'),
      P('20 h 05', 'Zoé P. — Fjord', 'zoe-p'),
    ],
    description:
      'Au Saguenay, la tournée MICRO D’OR fait escale pour une nuit de slam, de rap et de chansons inspirées par le territoire.',
    palette: 'teal',
    venue: 'Salle du Fjord',
    duration: '48:00',
  },
  {
    id: 's7',
    title: 'Gala d’hiver du Sommet',
    schoolId: 'sommet',
    date: '2026-12-11',
    time: '19 h 00',
    status: 'upcoming',
    category: 'mixte',
    lineup: ['adam-k', 'noemie-j', 'alex-t'],
    program: [
      P('19 h 00', 'Accueil aux flambeaux'),
      P('19 h 10', 'Noémie J. — Sentiers', 'noemie-j'),
      P('19 h 22', 'Alex T. — Merci Sherbrooke', 'alex-t'),
      P('19 h 34', 'Adam K. — Altitude', 'adam-k'),
      P('19 h 48', 'Témoignage de démonstration — Persévérance'),
    ],
    description:
      'Le gala d’hiver de l’Estrie célèbre la persévérance scolaire avec trois artistes qui ont choisi de ne jamais lâcher.',
    palette: 'gold',
    venue: 'Amphithéâtre du Sommet',
    duration: '50:00',
  },
  {
    id: 's8',
    title: 'Showcase du Fleuve',
    schoolId: 'fleuve',
    date: '2027-01-22',
    time: '19 h 00',
    status: 'upcoming',
    category: 'slam',
    lineup: ['nathan-b', 'theo-m', 'ines-b'],
    program: [
      P('19 h 00', 'Scène ouverte'),
      P('19 h 15', 'Théo M. — Deuxième prise', 'theo-m'),
      P('19 h 27', 'Inès B. — Trois langues', 'ines-b'),
      P('19 h 40', 'Nathan B. — Finir ce qu’on commence', 'nathan-b'),
    ],
    description:
      'Retour sur la Rive-Sud pour un showcase d’hiver : slam, chant multilingue et rap de la seconde chance.',
    palette: 'blue',
    venue: 'Salle Saint-Laurent',
    duration: '46:00',
  },
  {
    id: 's9',
    title: 'Grande finale MICRO D’OR',
    schoolId: 'lumieres',
    date: '2027-02-12',
    time: '19 h 30',
    status: 'upcoming',
    category: 'mixte',
    lineup: ['maya-l', 'malik-d', 'sarah-m', 'nathan-b', 'lea-r', 'adam-k'],
    program: [
      P('19 h 30', 'Ouverture — Les 8 écoles sur scène'),
      P('19 h 45', 'Maya L. — Respire', 'maya-l'),
      P('19 h 57', 'Nathan B. — Finir ce qu’on commence', 'nathan-b'),
      P('20 h 09', 'Sarah M. — Mon propre chemin', 'sarah-m'),
      P('20 h 21', 'Léa R. — Juste assez', 'lea-r'),
      P('20 h 33', 'Adam K. — Se relever', 'adam-k'),
      P('20 h 45', 'Malik D. — Prends ma main', 'malik-d'),
      P('21 h 00', 'Remise des Micros d’or (démonstration)'),
    ],
    description:
      'Les finalistes des huit écoles réunis sur une même scène pour la grande finale de la saison MICRO D’OR. Scénario de démonstration.',
    palette: 'gold',
    venue: 'Auditorium des Lumières',
    duration: '1:30:00',
  },
  // ---- Rediffusions (3)
  {
    id: 's10',
    title: 'Show du Fleuve',
    schoolId: 'fleuve',
    date: '2026-10-16',
    time: '19 h 00',
    status: 'replay',
    category: 'slam',
    lineup: ['nathan-b', 'ines-b'],
    program: [
      P('00:00', 'Ouverture'),
      P('04:30', 'Inès B. — Trois langues', 'ines-b'),
      P('12:10', 'Nathan B. — Marée haute', 'nathan-b'),
      P('24:00', 'Capsule — Persévérance scolaire'),
    ],
    description: 'La rediffusion du premier spectacle de la saison sur la Rive-Sud.',
    palette: 'blue',
    venue: 'Salle Saint-Laurent',
    duration: '38:40',
  },
  {
    id: 's11',
    title: 'Scène ouverte Horizon',
    schoolId: 'horizon',
    date: '2026-10-09',
    time: '18 h 30',
    status: 'replay',
    category: 'rap',
    lineup: ['sarah-m', 'jade-t'],
    program: [
      P('00:00', 'Ouverture DJ'),
      P('05:20', 'Jade T. — Reprise en lumière', 'jade-t'),
      P('14:45', 'Sarah M. — Mon propre chemin', 'sarah-m'),
    ],
    description: 'Une scène ouverte énergique où Sarah M. a présenté son texte phare.',
    palette: 'amber',
    venue: 'Gymnase-spectacle Horizon',
    duration: '32:15',
  },
  {
    id: 's12',
    title: 'Voix du Sommet',
    schoolId: 'sommet',
    date: '2026-10-30',
    time: '19 h 00',
    status: 'replay',
    category: 'rap',
    lineup: ['adam-k', 'alex-t'],
    program: [
      P('00:00', 'Ouverture'),
      P('06:00', 'Alex T. — Merci Sherbrooke', 'alex-t'),
      P('15:30', 'Adam K. — Se relever', 'adam-k'),
      P('26:00', 'Discussion — Tomber et se relever'),
    ],
    description: 'Rap conscience et persévérance : la rediffusion de la soirée estrienne.',
    palette: 'gold',
    venue: 'Amphithéâtre du Sommet',
    duration: '41:50',
  },
]

export const THEMES: Theme[] = [
  {
    id: 'criminalite',
    title: 'Prévention de la criminalité',
    short: 'Prévention de la criminalité',
    description:
      'Comprendre les conséquences réelles des gestes posés, reconnaître les pressions et les influences, et savoir où trouver de l’aide.',
    icon: 'shield',
  },
  {
    id: 'decrochage',
    title: 'Prévention du décrochage scolaire',
    short: 'Décrochage scolaire',
    description:
      'Faire de la scène une raison de rester : motivation, sentiment d’appartenance et projets qui donnent du sens au parcours scolaire.',
    icon: 'cap',
  },
  {
    id: 'estime',
    title: 'Estime de soi et persévérance',
    short: 'Estime de soi et persévérance',
    description:
      'Prendre la parole, être applaudi, recevoir des encouragements : la scène construit la confiance qui sert bien au-delà du spectacle.',
    icon: 'heart',
  },
  {
    id: 'reinsertion',
    title: 'Réinsertion sociale et choix de vie',
    short: 'Réinsertion et choix de vie',
    description:
      'Des parcours de démonstration qui montrent qu’il est toujours possible de changer de trajectoire, avec des ressources et du soutien.',
    icon: 'path',
  },
]

export const CAPSULES: Capsule[] = [
  { id: 'c1', theme: 'criminalite', title: 'Un choix, mille conséquences', format: 'Capsule vidéo', duration: '4:12', speaker: 'Conférencier à confirmer', summary: 'Un slam illustré qui suit les répercussions d’une seule décision.', palette: 'crimson' },
  { id: 'c2', theme: 'criminalite', title: 'Dire non sans perdre la face', format: 'Atelier', duration: '6:30', speaker: 'Intervenant·e jeunesse (à confirmer)', summary: 'Des stratégies concrètes pour résister à la pression du groupe.', palette: 'violet' },
  { id: 'c3', theme: 'criminalite', title: 'Le vrai prix', format: 'Témoignage (démo)', duration: '5:05', speaker: 'Personnage de démonstration', summary: 'Un récit fictif écrit pour ouvrir la discussion en classe.', palette: 'blue' },
  { id: 'c4', theme: 'decrochage', title: 'Rester pour la scène', format: 'Capsule vidéo', duration: '3:48', speaker: 'Conférencier à confirmer', summary: 'Quand un projet artistique devient une raison de se lever le matin.', palette: 'gold' },
  { id: 'c5', theme: 'decrochage', title: 'Mon plan B est un plan A', format: 'Conférence', duration: '12:00', speaker: 'Conférencière à confirmer', summary: 'Formation professionnelle, stages, retours aux études : tous les chemins comptent.', palette: 'amber' },
  { id: 'c6', theme: 'estime', title: 'Le trac, mon allié', format: 'Atelier', duration: '7:20', speaker: 'Coach vocal (à confirmer)', summary: 'Apprivoiser le stress de la scène et le transformer en énergie.', palette: 'magenta' },
  { id: 'c7', theme: 'estime', title: 'Juste assez', format: 'Capsule vidéo', duration: '2:47', speaker: 'Léa R. (personnage de démonstration)', summary: 'Un slam sur l’estime de soi, tiré du spectacle Constellation.', palette: 'violet' },
  { id: 'c8', theme: 'estime', title: 'Se relever', format: 'Témoignage (démo)', duration: '4:40', speaker: 'Personnage de démonstration', summary: 'Un récit fictif sur la persévérance après un échec.', palette: 'gold' },
  { id: 'c9', theme: 'reinsertion', title: 'Deuxième prise', format: 'Capsule vidéo', duration: '3:05', speaker: 'Conférencier à confirmer', summary: 'Changer de trajectoire : les ressources qui existent au Québec.', palette: 'teal' },
  { id: 'c10', theme: 'reinsertion', title: 'Après la tempête', format: 'Conférence', duration: '15:00', speaker: 'Espace réservé — futur conférencier', summary: 'Un espace prévu pour un parcours de réinsertion authentique, avec consentement.', palette: 'blue' },
]

export const PARTNERS: PartnerSlot[] = [
  { id: 'p1', tier: 'Partenaire principal', brand: 'Fondation Aurore', tagline: 'Marque fictive — exemple', monogram: 'FA', color: '#F4D78C' },
  { id: 'p2', tier: 'Partenaire régional', brand: 'Caisse Boréale', tagline: 'Marque fictive — exemple', monogram: 'CB', color: '#7CF0C2' },
  { id: 'p3', tier: 'Partenaire régional', brand: 'Énergie Rivière-Nord', tagline: 'Marque fictive — exemple', monogram: 'ÉR', color: '#5CC8E8' },
  { id: 'p4', tier: 'Partenaire jeunesse', brand: 'Coop Jeunes Pousses', tagline: 'Marque fictive — exemple', monogram: 'JP', color: '#8BF5A6' },
  { id: 'p5', tier: 'Partenaire média', brand: 'Onde Laurentienne Radio', tagline: 'Marque fictive — exemple', monogram: 'OL', color: '#FF7A8A' },
  { id: 'p6', tier: 'Soutien technique', brand: 'Studio Lumen Son', tagline: 'Marque fictive — exemple', monogram: 'LS', color: '#C9B6FF' },
]

export const PRODUCTS: Product[] = [
  { id: 'tshirt', name: 'T-shirt MICRO D’OR', price: 29.99, kind: 'tshirt', sizes: ['XS', 'S', 'M', 'L', 'XL'], description: 'Coton biologique noir, logo doré sérigraphié.', badge: 'Populaire' },
  { id: 'cap', name: 'Casquette MICRO D’OR', price: 24.99, kind: 'cap', description: 'Casquette brodée, visière courbée, ajustable.' },
  { id: 'hoodie', name: 'Chandail à capuchon', price: 54.99, kind: 'hoodie', sizes: ['S', 'M', 'L', 'XL'], description: 'Molleton épais, micro doré brodé au dos.', badge: 'Nouveau' },
  { id: 'album', name: 'Album des talents (démo)', price: 14.99, kind: 'album', description: 'Compilation fictive des finalistes de la saison.' },
  { id: 'ticket', name: 'Billet de spectacle', price: 12.0, kind: 'ticket', description: 'Accès à une étape de la tournée (démonstration, aucun billet émis).' },
]

// ---------- helpers
export const schoolById = (id: string) => SCHOOLS.find((s) => s.id === id)!
export const talentById = (id: string) => TALENTS.find((t) => t.id === id)!
export const showById = (id: string) => SHOWS.find((s) => s.id === id)
export const regionById = (id: string) => REGIONS.find((r) => r.id === id)
export const talentsOfSchool = (schoolId: string) => TALENTS.filter((t) => t.schoolId === schoolId)
export const showsOfSchool = (schoolId: string) => SHOWS.filter((s) => s.schoolId === schoolId)
export const showsOfTalent = (talentId: string) => SHOWS.filter((s) => s.lineup.includes(talentId))
export const nextShowOfTalent = (talentId: string) =>
  SHOWS.filter((s) => s.lineup.includes(talentId) && s.status !== 'replay').sort((a, b) =>
    a.date.localeCompare(b.date),
  )[0]
export const UPCOMING = SHOWS.filter((s) => s.status === 'upcoming').sort((a, b) => a.date.localeCompare(b.date))
export const LIVE = SHOWS.filter((s) => s.status === 'live')
export const REPLAYS = SHOWS.filter((s) => s.status === 'replay')

const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
const MONTHS_LONG = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
export const DEMO_TODAY = '2026-11-05'

export function fmtDate(iso: string, long = false) {
  const [y, m, d] = iso.split('-').map(Number)
  if (iso === DEMO_TODAY) return 'Aujourd’hui'
  return `${d} ${long ? MONTHS_LONG[m - 1] : MONTHS[m - 1]} ${y}`
}
export function fmtDay(iso: string) {
  const [, m, d] = iso.split('-').map(Number)
  return { day: String(d), month: MONTHS[m - 1].replace('.', '') }
}
export const monthName = (m: number) => MONTHS_LONG[m]

/** 1248 -> "1 248" (espace insécable fine, typographie québécoise) */
export const fmtNum = (n: number) => n.toLocaleString('fr-CA').replace(/\s/g, ' ')
export const fmtPrice = (n: number) => n.toFixed(2).replace('.', ',') + ' $'

/**
 * Photos d’illustration (banque d’images Unsplash, licence Unsplash).
 * Les personnes photographiées sont des modèles sans lien avec le projet ;
 * les noms, écoles et parcours associés sont fictifs.
 */
export const PHOTOS = {
  talent: (id: string) => `photos/talents/${id}.jpg`,
  show: (id: string) => `photos/shows/${id}.jpg`,
  school: (id: string) => `photos/schools/${id}.jpg`,
  hero: 'photos/hero/hero-b.jpg',
  heroAlt: 'photos/hero/hero-a.jpg',
  crowd: 'photos/hero/hero-c.jpg',
  poster: 'photos/hero/poster.jpg',
}
const TALENT_IDS = new Set(TALENTS.map((t) => t.id))
export const hasTalentPhoto = (id: string) => TALENT_IDS.has(id)

// Campagnes de sensibilisation jeunesse portées par MICRO D’OR

export type CampaignStatus = 'en-cours' | 'a-venir' | 'terminee'

export interface Campaign {
  id: string
  title: string
  /** Sujet en quelques mots (ex. « Prévention de la criminalité ») */
  topic: string
  tagline: string
  /** Slogan court, affiché sur la bannière */
  slogan: string
  status: CampaignStatus
  period: string
  /** Bannière officielle de la campagne (titre et logo inclus dans l’image) */
  banner: string
  /** Couleur d’accent de la campagne */
  accent: string
  summary: string
  why: string[]
  goals: string[]
  actions: { title: string; text: string }[]
  messages: string[]
  participate: string[]
  resources: { name: string; contact: string; note: string }[]
}

export const CAMPAIGN_STATUS_LABEL: Record<CampaignStatus, string> = {
  'en-cours': 'En cours',
  'a-venir': 'À venir',
  terminee: 'Terminée',
}

const TEL_JEUNES = { name: 'Tel-jeunes', contact: '1 800 263-2266 · texto 514 600-1002', note: 'Gratuit, confidentiel, 24 h sur 24, pour les 5 à 20 ans.' }
const JEUNESSE_JECOUTE = { name: 'Jeunesse, J’écoute', contact: '1 800 668-6868 · texto 686868', note: 'Écoute et soutien en tout temps, partout au Canada.' }
const URGENCE = { name: 'Urgence', contact: '911', note: 'Si quelqu’un est en danger immédiat.' }

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'un-choix-mille-consequences',
    title: 'Un choix, mille conséquences',
    topic: 'Criminalité et gangs',
    tagline: 'Une seule décision peut changer toute une vie. Parlons-en avant.',
    slogan: 'Ton avenir vaut plus qu’un coup de tête.',
    status: 'en-cours',
    period: 'Automne 2026 – Hiver 2027',
    banner: 'photos/campaigns/un-choix-mille-consequences.webp',
    accent: '#E5484D',
    summary:
      'Une tournée de spectacles-conférences dans les écoles secondaires pour parler de gangs de rue, de recrutement, d’armes et de pression du groupe, avec les mots des jeunes et sans leçon de morale.',
    why: [
      'Le recrutement par les gangs commence souvent tôt, par des amitiés, de l’argent facile ou des messages sur les réseaux sociaux.',
      'Beaucoup de jeunes ne mesurent pas les conséquences d’un geste : dossier judiciaire, blessures, perte de liberté, peine pour la famille.',
      'Un message porté par d’autres jeunes, sur scène, touche là où un discours classique ne passe plus.',
    ],
    goals: [
      'Reconnaître les signes de recrutement, en personne comme en ligne.',
      'Savoir dire non sans perdre la face devant le groupe.',
      'Connaître les ressources d’aide et les adultes de confiance à qui parler.',
    ],
    actions: [
      { title: 'Spectacle-conférence', text: 'Slam, rap conscience et théâtre écrits par des élèves, suivis d’un témoignage d’une personne qui a changé de trajectoire.' },
      { title: 'Atelier « Dire non »', text: 'Mises en situation en petits groupes pour pratiquer des réponses concrètes à la pression des pairs.' },
      { title: 'Concours d’écriture', text: 'Les élèves écrivent un texte sur les conséquences d’un choix ; les meilleurs sont interprétés sur scène.' },
    ],
    messages: ['Le respect ne s’achète pas avec la peur.', 'Un vrai ami ne te demande pas de risquer ta vie.', 'Il n’est jamais trop tard pour changer de chemin.'],
    participate: [
      'Inscris ton école à la tournée avec ta direction ou ton intervenant·e.',
      'Participe au concours d’écriture et propose ton texte.',
      'Partage les capsules de la campagne avec tes amis.',
    ],
    resources: [
      { name: 'Échec au crime', contact: '1 800 711-1800', note: 'Signaler un crime de façon anonyme et confidentielle.' },
      TEL_JEUNES,
      URGENCE,
    ],
  },
  {
    id: 'reste-dans-la-course',
    title: 'Reste dans la course',
    topic: 'Décrochage scolaire',
    tagline: 'L’école, c’est pas toujours facile. Mais tu n’es pas seul·e à la traverser.',
    slogan: 'Ton diplôme, ta scène.',
    status: 'en-cours',
    period: 'Toute l’année scolaire 2026–2027',
    banner: 'photos/campaigns/reste-dans-la-course.webp',
    accent: '#D6AC55',
    summary:
      'Une campagne pour faire de la scène une raison de rester à l’école : projets artistiques, mentorat et rencontres avec des artistes qui ont, eux aussi, failli décrocher.',
    why: [
      'Le décrochage se prépare souvent en silence : retards, absences, notes qui baissent, sentiment de ne pas avoir sa place.',
      'Un projet qui passionne et un adulte qui croit en toi peuvent faire toute la différence.',
      'Il existe plusieurs chemins vers la réussite : formation professionnelle, retour aux études, stages.',
    ],
    goals: [
      'Donner à chaque élève un projet qui lui donne envie de venir à l’école.',
      'Faire connaître tous les parcours possibles, sans jugement.',
      'Relier les jeunes à risque avec un mentor ou une mentore.',
    ],
    actions: [
      { title: 'Troupe de l’année', text: 'Chaque école forme une troupe qui répète toute l’année et monte sur scène au printemps.' },
      { title: 'Mentorat artistique', text: 'Des artistes accompagnent des élèves une fois par semaine : écriture, voix, danse, confiance.' },
      { title: 'Conférence « Mon plan B est un plan A »', text: 'Des parcours variés racontés par celles et ceux qui les ont vécus.' },
    ],
    messages: ['Ta place est ici.', 'Un mauvais bulletin n’est pas une fin.', 'Demander de l’aide, c’est avancer.'],
    participate: [
      'Rejoins la troupe de ton école ou crée-en une avec un enseignant.',
      'Parle à ton intervenant·e si tu penses à lâcher.',
      'Encourage un ami qui a du mal : parfois, ça suffit.',
    ],
    resources: [
      TEL_JEUNES,
      { name: 'Info-Social', contact: '811, option 2', note: 'Un ou une intervenante psychosociale répond 24 h sur 24.' },
      { name: 'Personnel de ton école', contact: 'Intervenant·e, psychoéducateur·trice, orientation', note: 'Les premières personnes à qui parler.' },
    ],
  },
  {
    id: 'ta-voix-compte',
    title: 'Ta voix compte',
    topic: 'Santé mentale',
    tagline: 'Ce que tu ressens est important. Ça mérite d’être dit, et entendu.',
    slogan: 'Parle. On t’écoute.',
    status: 'en-cours',
    period: 'Automne 2026',
    banner: 'photos/campaigns/ta-voix-compte.webp',
    accent: '#7C8CFF',
    summary:
      'Une campagne pour briser le tabou de la santé mentale chez les jeunes : anxiété, stress, tristesse, pression de performance. Des chansons, des slams et des capsules pour dire que ça va de ne pas aller bien.',
    why: [
      'L’anxiété et la détresse touchent beaucoup d’adolescents, souvent sans qu’ils osent en parler.',
      'La comparaison sur les réseaux sociaux et la pression de réussir pèsent lourd.',
      'Mettre des mots sur ce qu’on vit est le premier pas pour aller mieux.',
    ],
    goals: [
      'Normaliser le fait de parler de ses émotions.',
      'Apprendre des trucs simples pour gérer le stress et le trac.',
      'Savoir reconnaître quand un ami ne va pas bien et comment l’aider.',
    ],
    actions: [
      { title: 'Spectacle « Juste assez »', text: 'Des élèves chantent et slament sur la confiance, le doute et le droit à l’erreur.' },
      { title: 'Atelier « Le trac, mon allié »', text: 'Respiration, posture, préparation : transformer le stress en énergie, sur scène comme en examen.' },
      { title: 'Mur des mots', text: 'Un espace dans l’école où chacun peut laisser un message d’encouragement anonyme.' },
    ],
    messages: ['Ça va de ne pas aller bien.', 'Tu n’as pas à être parfait·e pour briller.', 'Demander de l’aide, c’est du courage.'],
    participate: [
      'Écris un texte ou une chanson sur ce que tu ressens.',
      'Laisse un mot sur le mur des mots de ton école.',
      'Si un ami t’inquiète, parles-en à un adulte de confiance.',
    ],
    resources: [
      TEL_JEUNES,
      JEUNESSE_JECOUTE,
      { name: 'Ligne d’aide en prévention du suicide', contact: '9-8-8 (appel ou texto)', note: 'Si tu as des idées suicidaires ou t’inquiètes pour quelqu’un.' },
    ],
  },
  {
    id: 'derriere-l-ecran',
    title: 'Derrière l’écran',
    topic: 'Cyberintimidation',
    tagline: 'Ce qu’on publie laisse des traces. Ce qu’on dit en ligne blesse pour vrai.',
    slogan: 'Clique avec respect.',
    status: 'a-venir',
    period: 'Hiver 2027',
    banner: 'photos/campaigns/derriere-l-ecran.webp',
    accent: '#3FC1C9',
    summary:
      'Une campagne sur la vie en ligne : cyberintimidation, partage d’images intimes, arnaques et faux profils. Pour apprendre à se protéger et à protéger les autres.',
    why: [
      'L’intimidation ne s’arrête plus à la porte de l’école : elle suit les jeunes jusque dans leur chambre.',
      'Partager une image intime d’une autre personne sans son accord est un crime, même entre mineurs.',
      'Des adultes malveillants utilisent les jeux et les réseaux sociaux pour approcher des jeunes.',
    ],
    goals: [
      'Comprendre les conséquences d’une publication ou d’un partage.',
      'Savoir quoi faire si on est victime ou témoin.',
      'Reconnaître les faux profils et les tentatives de manipulation.',
    ],
    actions: [
      { title: 'Pièce de théâtre « Vu à 23 h 14 »', text: 'Une histoire de groupe de discussion qui dérape, jouée par des élèves.' },
      { title: 'Atelier « Mes paramètres »', text: 'Vérifier ensemble ses réglages de confidentialité et apprendre à bloquer et signaler.' },
      { title: 'Défi « 24 h de bienveillance »', text: 'Une journée où chaque commentaire publié doit être positif.' },
    ],
    messages: ['Une capture d’écran, c’est pour toujours.', 'Témoin, tu as du pouvoir : ne partage pas, signale.', 'Personne n’a le droit de te faire chanter.'],
    participate: [
      'Fais le tour de tes paramètres de confidentialité.',
      'Signale les contenus blessants au lieu de les partager.',
      'Si tu es victime, garde les preuves et parles-en à un adulte.',
    ],
    resources: [
      { name: 'Cyberaide.ca', contact: 'cyberaide.ca', note: 'Signaler l’exploitation sexuelle d’enfants en ligne et obtenir de l’aide pour retirer des images.' },
      TEL_JEUNES,
      JEUNESSE_JECOUTE,
    ],
  },
  {
    id: 'ensemble-contre-l-intimidation',
    title: 'Ensemble contre l’intimidation',
    topic: 'Intimidation et inclusion',
    tagline: 'Une école où chacun peut être soi-même, sans peur.',
    slogan: 'Personne de côté.',
    status: 'a-venir',
    period: 'Printemps 2027',
    banner: 'photos/campaigns/ensemble-contre-l-intimidation.webp',
    accent: '#E88BD3',
    summary:
      'Une campagne pour que chaque élève trouve sa place, peu importe son origine, son apparence, son orientation ou sa façon d’être. La scène devient un lieu où toutes les différences sont applaudies.',
    why: [
      'L’intimidation laisse des traces longtemps après l’école : isolement, anxiété, perte de confiance.',
      'Les témoins sont souvent la clé : quand le groupe réagit, l’intimidation recule.',
      'Se sentir appartenir à un groupe protège et donne envie de s’impliquer.',
    ],
    goals: [
      'Encourager les témoins à agir de façon sécuritaire.',
      'Célébrer la diversité des talents et des parcours.',
      'Créer des espaces où chaque élève se sent inclus.',
    ],
    actions: [
      { title: 'Grand spectacle collectif', text: 'Une chorégraphie qui réunit des élèves de tous les niveaux et de tous les groupes de l’école.' },
      { title: 'Atelier « Témoin actif »', text: 'Apprendre cinq façons simples et sécuritaires d’intervenir.' },
      { title: 'Ambassadeurs MICRO D’OR', text: 'Des élèves formés pour accueillir les nouveaux et repérer ceux qui restent seuls.' },
    ],
    messages: ['Ton silence aussi parle.', 'La différence, c’est ce qui fait un bon spectacle.', 'Tends la main, ça change tout.'],
    participate: [
      'Invite quelqu’un qui est souvent seul à te rejoindre.',
      'Deviens ambassadeur ou ambassadrice MICRO D’OR dans ton école.',
      'Si tu vois de l’intimidation, parles-en à un adulte.',
    ],
    resources: [TEL_JEUNES, JEUNESSE_JECOUTE, URGENCE],
  },
  {
    id: 'garde-le-controle',
    title: 'Garde le contrôle',
    topic: 'Drogues, alcool, vapotage',
    tagline: 'Faire tes propres choix, c’est ça, être libre.',
    slogan: 'Ta tête, tes règles.',
    status: 'terminee',
    period: 'Printemps 2026',
    banner: 'photos/campaigns/garde-le-controle.webp',
    accent: '#F29A4A',
    summary:
      'Une campagne pour parler sans tabou de vapotage, d’alcool, de cannabis et de drogues : les effets réels, la dépendance, les mélanges dangereux et la pression des amis.',
    why: [
      'Le vapotage est très présent chez les adolescents, souvent avec beaucoup de nicotine.',
      'Le cerveau continue de se développer jusqu’à environ 25 ans et reste plus sensible aux substances.',
      'Des pilules ou des drogues achetées dans la rue peuvent contenir des produits très toxiques, comme le fentanyl.',
    ],
    goals: [
      'Donner une information juste, sans faire peur pour rien.',
      'Aider les jeunes à résister à la pression du groupe.',
      'Faire connaître les ressources d’aide pour soi ou pour un proche.',
    ],
    actions: [
      { title: 'Capsules « Vrai ou faux »', text: 'De courtes vidéos où des élèves démêlent les mythes sur les substances.' },
      { title: 'Spectacle « Garde le contrôle »', text: 'Rap et danse sur la liberté de dire non et de choisir pour soi.' },
      { title: 'Rencontre parents-jeunes', text: 'Une soirée pour ouvrir le dialogue à la maison, avec une intervenante spécialisée.' },
    ],
    messages: ['Dire non, c’est aussi un choix cool.', 'Tu n’as rien à prouver.', 'En cas de doute, on n’essaie pas.'],
    participate: [
      'Regarde et partage les capsules « Vrai ou faux ».',
      'Parles-en avec tes parents ou un adulte de confiance.',
      'Si un ami a besoin d’aide, ne reste pas seul·e avec ça.',
    ],
    resources: [
      { name: 'Drogue : aide et référence', contact: '1 800 265-2626', note: 'Information et références, gratuit et confidentiel, 24 h sur 24.' },
      TEL_JEUNES,
      URGENCE,
    ],
  },
]

export const campaignById = (id: string) => CAMPAIGNS.find((c) => c.id === id)

/** Campagnes mises en avant dans le carrousel de l’accueil */
export const FEATURED_CAMPAIGNS = ['un-choix-mille-consequences', 'reste-dans-la-course', 'ta-voix-compte'].map((id) => campaignById(id)!)

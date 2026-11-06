import type { DemoTrack } from './player'

/** Bibliothèque de l’espace élève (contenus fictifs) */
export const LIBRARY: Record<'repetition' | 'slam' | 'rap', { label: string; intro: string; tracks: DemoTrack[] }> = {
  repetition: {
    label: 'Musiques de répétition',
    intro: 'Bandes de répétition préparées par l’équipe MICRO D’OR.',
    tracks: [
      { id: 'lib-beat', title: 'Beat — Rap conscience', subtitle: 'Boom bap · 90 BPM · son généré', duration: 168, kind: 'beat', bpm: 90 },
      { id: 'lib-inst', title: 'Instrumental — Chant', subtitle: 'Piano et cordes', duration: 192, kind: 'instrumental' },
      { id: 'lib-beat2', title: 'Beat — Échauffement lent', subtitle: 'Boom bap · 78 BPM · son généré', duration: 120, kind: 'beat', bpm: 78 },
    ],
  },
  slam: {
    label: 'Textes de slam',
    intro: 'Textes d’exemple et lectures guidées pour travailler le rythme et la respiration.',
    tracks: [
      { id: 'lib-slam1', title: 'Texte — Slam (exemple)', subtitle: '« Encore debout » · lecture guidée', duration: 116, kind: 'texte' },
      { id: 'lib-slam2', title: 'Respirer entre les vers', subtitle: 'Exercice de diction', duration: 95, kind: 'voix' },
      { id: 'lib-slam3', title: 'Écrire à partir d’un souvenir', subtitle: 'Atelier d’écriture', duration: 248, kind: 'atelier' },
    ],
  },
  rap: {
    label: 'Rap conscience',
    intro: 'Ressources pour écrire un rap qui porte un message positif et engagé.',
    tracks: [
      { id: 'lib-rap1', title: 'Construire un couplet engagé', subtitle: 'Atelier audio', duration: 312, kind: 'atelier' },
      { id: 'lib-rap2', title: 'Flow et silences', subtitle: 'Voix guide sur 4 mesures', duration: 104, kind: 'voix' },
      { id: 'lib-rap3', title: 'Beat — Conscience 2', subtitle: 'Boom bap · 94 BPM · son généré', duration: 150, kind: 'beat', bpm: 94 },
    ],
  },
}

/** Pistes de la salle de répétition virtuelle */
export const STUDIO_TRACKS: DemoTrack[] = [
  { id: 'st-beat', title: 'Beat — Rap conscience', subtitle: 'Boom bap · son généré en direct', duration: 168, kind: 'beat', bpm: 90 },
  { id: 'st-inst', title: 'Instrumental — Chant', subtitle: 'Piano et cordes', duration: 192, kind: 'instrumental' },
  { id: 'st-slam', title: 'Texte — Slam (exemple)', subtitle: '« Encore debout » · lecture guidée', duration: 116, kind: 'texte' },
  { id: 'st-voix', title: 'Échauffement vocal', subtitle: 'Voix guide', duration: 135, kind: 'voix' },
  { id: 'st-beat2', title: 'Beat — Échauffement lent', subtitle: 'Boom bap · son généré en direct', duration: 120, kind: 'beat', bpm: 78 },
]

/**
 * « Encore debout » — texte de slam original écrit pour la démonstration MICRO D’OR.
 * Une ligne vide marque une pause (changement de strophe).
 */
export const SLAM_TEXT: string[] = [
  'Encore debout',
  '',
  'On m’a dit : « Pas pour toi, la scène. »',
  'Alors j’ai fait de ma chambre un théâtre,',
  'de mon cahier un micro,',
  'et de chaque rature une marche de plus.',
  '',
  'J’ai trébuché sur mes propres mots,',
  'oublié la rime au moment de briller,',
  'senti le silence peser cent kilos',
  'dans un gymnase plein de chaises pliantes.',
  '',
  'Mais tomber, c’est juste apprendre le sol',
  'pour savoir où poser le pied demain.',
  'Mes échecs ont des noms, des dates, des heures —',
  'je les garde comme on garde des billets d’entrée.',
  '',
  'Persévérer, c’est pas crier plus fort,',
  'c’est revenir mardi, puis jeudi,',
  'quand personne regarde,',
  'quand même le miroir doute.',
  '',
  'Aujourd’hui ma voix tremble encore un peu.',
  'Tant mieux.',
  'Ça veut dire qu’elle est vivante,',
  'qu’elle a fait tout le chemin jusqu’ici.',
  '',
  'Je suis pas arrivé.',
  'Je suis encore debout.',
  'Et pour l’instant,',
  'c’est exactement la bonne hauteur.',
]

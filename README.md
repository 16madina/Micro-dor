# MICRO D’OR — La scène des talents de demain

Prototype visuel interactif de MICRO D’OR, une plateforme qui met en scène les talents des écoles secondaires du Québec (chant, danse, théâtre, slam, rap conscience) et porte un volet de prévention de la criminalité et du décrochage scolaire.

> **Prototype de démonstration.** Les écoles, les talents, les spectacles, les dates, les votes et les partenaires sont fictifs. Il n’y a ni paiement réel, ni diffusion réelle, ni serveur : les comptes, les votes et les ajouts restent dans la fenêtre du navigateur et s’effacent au rechargement.

## Lancer le projet

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
npm run dev
```

L’application s’ouvre sur `http://localhost:5173`.

Pour produire la version de mise en ligne (dossier `dist/`) :

```bash
npm run build
```

## Ce que contient le prototype

- Écran d’ouverture vidéo, accueil, écoles, spectacles avec lecteur de démonstration, talents, votes et soutiens.
- Tournée (carte et calendrier des 17 régions), prévention et sensibilisation, partenaires et commanditaires (marques fictives).
- Boutique (panier fictif), « Nos musiques » (extraits d’une minute générés en direct, sélection pour sa prestation).
- Espaces élève, parent et salle de répétition.
- Authentification de démonstration : élève, parent, organisation et organisateur (code d’accès organisateur requis pour gérer les musiques et la boutique).
- Visite guidée pour les commanditaires.

## Technologies

React 19, TypeScript, Tailwind CSS 3, Vite, React Router (HashRouter), lucide-react.

## Structure

- `src/pages/` : une page par écran.
- `src/components/` : interface commune, illustrations, lecteurs, superpositions.
- `src/data/` : données de démonstration (écoles, talents, spectacles, musiques…).
- `src/state/AppState.tsx` : état de l’application (votes, panier, compte, musiques).
- `public/brand/` : logo et vidéo d’ouverture ; `public/photos/` : photos d’illustration.

## Crédits et limites

- Photos d’illustration : [Unsplash](https://unsplash.com) (licence Unsplash). Les personnes photographiées n’ont aucun lien avec les profils fictifs. Pour une version publique, prévoir des photos avec autorisation des modèles ou des photos de participants autorisés par leurs parents.
- Le code organisateur est vérifié dans le navigateur : en production, il devra être vérifié par un serveur.
- Avant toute collecte réelle de données d’élèves, respecter la Loi 25 (consentement parental avant 14 ans).

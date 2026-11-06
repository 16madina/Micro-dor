import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './state/AppState'
import AppShell from './components/layout/AppShell'
import Splash from './components/overlays/Splash'
import SearchOverlay from './components/overlays/SearchOverlay'
import TourOverlay from './components/overlays/TourOverlay'
import CartDrawer from './components/overlays/CartDrawer'
import Home from './pages/Home'
import Schools from './pages/Schools'
import SchoolDetail from './pages/SchoolDetail'
import Shows from './pages/Shows'
import ShowDetail from './pages/ShowDetail'
import Talents from './pages/Talents'
import TalentDetail from './pages/TalentDetail'
import Votes from './pages/Votes'
import Tour from './pages/Tour'
import Prevention from './pages/Prevention'
import Partners from './pages/Partners'
import Rules from './pages/Rules'
import Shop from './pages/Shop'
import Student from './pages/Student'
import Rehearsal from './pages/Rehearsal'
import Parent from './pages/Parent'
import Profile from './pages/Profile'
import Visit from './pages/Visit'
import Music from './pages/Music'
import Auth from './pages/Auth'
import Organizer from './pages/Organizer'
import Campaigns from './pages/Campaigns'
import CampaignDetail from './pages/CampaignDetail'

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ecoles" element={<Schools />} />
            <Route path="/ecoles/:id" element={<SchoolDetail />} />
            <Route path="/spectacles" element={<Shows />} />
            <Route path="/spectacles/:id" element={<ShowDetail />} />
            <Route path="/talents" element={<Talents />} />
            <Route path="/talents/:id" element={<TalentDetail />} />
            <Route path="/votes" element={<Votes />} />
            <Route path="/tournee" element={<Tour />} />
            <Route path="/campagnes" element={<Campaigns />} />
            <Route path="/campagnes/:id" element={<CampaignDetail />} />
            <Route path="/prevention" element={<Prevention />} />
            <Route path="/partenaires" element={<Partners />} />
            <Route path="/reglement" element={<Rules />} />
            <Route path="/boutique" element={<Shop />} />
            <Route path="/eleve" element={<Student />} />
            <Route path="/eleve/repetition" element={<Rehearsal />} />
            <Route path="/parent" element={<Parent />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/visite" element={<Visit />} />
            <Route path="/musiques" element={<Music />} />
            <Route path="/connexion" element={<Auth />} />
            <Route path="/organisateur" element={<Organizer />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AppShell>
        <SearchOverlay />
        <CartDrawer />
        <TourOverlay />
        <Splash />
      </HashRouter>
    </AppProvider>
  )
}

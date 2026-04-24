import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MatchLogger from './pages/MatchLogger';
import MatchHistory from './pages/MatchHistory';
import GuidePage from './pages/GuidePage';
import Perks from './pages/Perks';
import Builds from './pages/Builds';
import Stats from './pages/Stats';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/match-logger" element={<MatchLogger />} />
        <Route path="/match-history" element={<MatchHistory />} />
        <Route path="/guides/survivor" element={<GuidePage role="survivor" />} />
        <Route path="/guides/killer" element={<GuidePage role="killer" />} />
        <Route path="/perks" element={<Perks />} />
        <Route path="/builds" element={<Builds />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

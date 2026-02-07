import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { DetectiveMapPage } from '@/pages/MapPage';
import { QRScannerPage } from '@/pages/QRScannerPage';
import { InventoryPage } from '@/pages/InventoryPage/InventoryPage';
import { CharacterPage } from '@/pages/CharacterPage/CharacterPage';
import { DeveloperPage } from '@/pages/DeveloperPage';
import { VisualNovelPage } from '@/pages/VisualNovelPage';
import { BattlePage } from '@/pages/BattlePage';
import { VisualNovelOverlay } from '@/widgets/visual-novel/VisualNovelOverlay';
import { Navbar } from '@/widgets/navbar/Navbar';

import { useQuestEngine } from "./features/quests/engine";
import { QuestLog } from "./features/quests/QuestLog";
import { QuestJournalPage } from "./features/quests/QuestJournalPage";
import { QuestNotification } from "./features/quests/QuestNotification";

function App() {
  useQuestEngine(); // Initialize Quest System
  const devDashboardEnabled = import.meta.env.VITE_ENABLE_DEV_DASHBOARD === 'true';

  return (
    <BrowserRouter>
      {/* Global Overlays */}
      <QuestLog />
      <QuestNotification />
      <Navbar />
      <VisualNovelOverlay />


      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<DetectiveMapPage />} />
        <Route path="/scanner" element={<QRScannerPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/character" element={<CharacterPage />} />
        {devDashboardEnabled && <Route path="/developer" element={<DeveloperPage />} />}
        <Route path="/vn/:scenarioId" element={<VisualNovelPage />} />
        <Route path="/battle" element={<BattlePage />} />
        <Route path="/quests" element={<QuestJournalPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

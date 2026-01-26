import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { MapView } from '@/widgets/map/map-view/MapView';
import { QRScannerPage } from '@/pages/QRScannerPage';



import { VisualNovelOverlay } from '@/entities/visual-novel/ui/VisualNovelOverlay';

function App() {
  return (
    <BrowserRouter>
      {/* Global Overlays */}
      <VisualNovelOverlay />


      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/scanner" element={<QRScannerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

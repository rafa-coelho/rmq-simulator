import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/ui/Header';
import { HomePage, LearnPage } from './pages';
import { AnalyticsProvider } from './components/Analytics';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AnalyticsProvider>
          <div className="min-h-screen bg-rmq-darker flex flex-col">
            <Header />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/learn" element={<LearnPage />} />
              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
        </AnalyticsProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

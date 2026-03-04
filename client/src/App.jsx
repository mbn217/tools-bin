import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import YouTubeTranscript from './pages/YouTubeTranscript';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="youtube-transcript" element={<YouTubeTranscript />} />
      </Route>
    </Routes>
  );
}

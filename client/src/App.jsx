import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import YouTubeTranscript from './pages/YouTubeTranscript';
import JsonFormatter from './pages/JsonFormatter';
import ImageCompressor from './pages/ImageCompressor';
import HashGenerator from './pages/HashGenerator';
import TimestampConverter from './pages/TimestampConverter';
import ColorPicker from './pages/ColorPicker';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="youtube-transcript" element={<YouTubeTranscript />} />
        <Route path="json-formatter" element={<JsonFormatter />} />
        <Route path="image-compressor" element={<ImageCompressor />} />
        <Route path="hash-generator" element={<HashGenerator />} />
        <Route path="timestamp-converter" element={<TimestampConverter />} />
        <Route path="color-picker" element={<ColorPicker />} />
      </Route>
    </Routes>
  );
}

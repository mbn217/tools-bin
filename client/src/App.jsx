import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

const Home = lazy(() => import('./pages/Home'));
const YouTubeTranscript = lazy(() => import('./pages/YouTubeTranscript'));
const JsonFormatter = lazy(() => import('./pages/JsonFormatter'));
const ImageCompressor = lazy(() => import('./pages/ImageCompressor'));
const HashGenerator = lazy(() => import('./pages/HashGenerator'));
const TimestampConverter = lazy(() => import('./pages/TimestampConverter'));
const ColorPicker = lazy(() => import('./pages/ColorPicker'));
const Base64Tool = lazy(() => import('./pages/Base64Tool'));
const UrlEncoder = lazy(() => import('./pages/UrlEncoder'));
const JwtDecoder = lazy(() => import('./pages/JwtDecoder'));
const RegexTester = lazy(() => import('./pages/RegexTester'));
const MarkdownPreview = lazy(() => import('./pages/MarkdownPreview'));
const TextDiff = lazy(() => import('./pages/TextDiff'));
const CaseConverter = lazy(() => import('./pages/CaseConverter'));
const LoremIpsum = lazy(() => import('./pages/LoremIpsum'));
const UuidGenerator = lazy(() => import('./pages/UuidGenerator'));
const PasswordGenerator = lazy(() => import('./pages/PasswordGenerator'));
const QrCodeGenerator = lazy(() => import('./pages/QrCodeGenerator'));
const CssGradient = lazy(() => import('./pages/CssGradient'));
const CsvJson = lazy(() => import('./pages/CsvJson'));
const YamlJson = lazy(() => import('./pages/YamlJson'));
const NumberBase = lazy(() => import('./pages/NumberBase'));
const UnitConverter = lazy(() => import('./pages/UnitConverter'));
const CronParser = lazy(() => import('./pages/CronParser'));
const SqlFormatter = lazy(() => import('./pages/SqlFormatter'));
const HttpStatus = lazy(() => import('./pages/HttpStatus'));
const MetaTagGenerator = lazy(() => import('./pages/MetaTagGenerator'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="youtube-transcript" element={<YouTubeTranscript />} />
          <Route path="json-formatter" element={<JsonFormatter />} />
          <Route path="image-compressor" element={<ImageCompressor />} />
          <Route path="hash-generator" element={<HashGenerator />} />
          <Route path="timestamp-converter" element={<TimestampConverter />} />
          <Route path="color-picker" element={<ColorPicker />} />
          <Route path="base64" element={<Base64Tool />} />
          <Route path="url-encoder" element={<UrlEncoder />} />
          <Route path="jwt-decoder" element={<JwtDecoder />} />
          <Route path="regex-tester" element={<RegexTester />} />
          <Route path="markdown-preview" element={<MarkdownPreview />} />
          <Route path="text-diff" element={<TextDiff />} />
          <Route path="case-converter" element={<CaseConverter />} />
          <Route path="lorem-ipsum" element={<LoremIpsum />} />
          <Route path="uuid-generator" element={<UuidGenerator />} />
          <Route path="password-generator" element={<PasswordGenerator />} />
          <Route path="qr-code" element={<QrCodeGenerator />} />
          <Route path="css-gradient" element={<CssGradient />} />
          <Route path="csv-json" element={<CsvJson />} />
          <Route path="yaml-json" element={<YamlJson />} />
          <Route path="number-base" element={<NumberBase />} />
          <Route path="unit-converter" element={<UnitConverter />} />
          <Route path="cron-parser" element={<CronParser />} />
          <Route path="sql-formatter" element={<SqlFormatter />} />
          <Route path="http-status" element={<HttpStatus />} />
          <Route path="meta-tag-generator" element={<MetaTagGenerator />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

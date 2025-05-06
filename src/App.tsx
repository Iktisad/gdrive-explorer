import { useState, useMemo, useEffect } from "react";
import PdfModal from "./components/Fileview";
import SearchBar from "./components/Search";

const calculateFuzzyScore = (query: string, target: string): number => {
  const normalize = (str: string) =>
    str.toLowerCase().replace(/\s/g, "").trim();
  const q = normalize(query);
  const t = normalize(target);

  if (!q || !t) return 0;

  let score = 0;
  let tIndex = 0;

  for (let i = 0; i < q.length; i++) {
    const char = q[i];
    let found = false;
    while (tIndex < t.length) {
      if (t[tIndex] === char) {
        score++;
        found = true;
        tIndex++;
        break;
      }
      tIndex++;
    }
    if (!found) break;
  }

  return score / q.length;
};

const API_KEY = import.meta.env.VITE_API_KEY;
const FOLDER_ID = import.meta.env.VITE_GOOGLE_FOLDER_ID;

function App() {
  const [pdfFiles, setPdfFiles] = useState<any[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const gapiScript = document.createElement("script");
    gapiScript.src = "https://apis.google.com/js/api.js";
    gapiScript.onload = () => {
      const gapi = (window as any).gapi;
      gapi.load("client", async () => {
        await gapi.client.init({ apiKey: API_KEY });
        listPdfFiles(gapi);
      });
    };
    document.body.appendChild(gapiScript);
  }, []);

  const listPdfFiles = async (gapi: any) => {
    const res = await gapi.client.request({
      path: "https://www.googleapis.com/drive/v3/files",
      method: "GET",
      params: {
        q: `'${FOLDER_ID}' in parents and mimeType='application/pdf' and trashed=false`,
        fields: "files(id, name, webViewLink, webContentLink)",
        key: API_KEY,
      },
    });
    setPdfFiles(res.result.files);
  };

  const filteredFiles = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return pdfFiles;
    return pdfFiles
      .map((file) => ({
        ...file,
        score: calculateFuzzyScore(trimmedQuery, file.name),
      }))
      .filter((file) => file.score > 0.4)
      .sort((a, b) => b.score - a.score);
  }, [searchQuery, pdfFiles]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-600 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
          <img src="/imgs/logo.png" alt="Logo" className="w-12 h-12" />
          GDrive Explorer
        </h1>

        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file) => (
            <button
              key={file.id}
              onClick={() => setSelectedPdf(file)}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow group transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-1 w-full text-left"
            >
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <img
                  src="/svgs/placeholder.svg"
                  alt="PDF Preview"
                  className="h-full object-contain opacity-40"
                />
              </div>
              <div className="p-4">
                <h2 className="text-base font-semibold text-gray-800 group-hover:text-violet-500 transition-colors truncate">
                  {file.name}
                </h2>
                <p className="text-sm text-gray-400">Updated: Mar 2024</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <PdfModal file={selectedPdf} onClose={() => setSelectedPdf(null)} />
    </div>
  );
}

export default App;

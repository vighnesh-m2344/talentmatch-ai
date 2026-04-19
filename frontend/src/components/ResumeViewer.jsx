import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";

/* PDF WORKER */
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export default function ResumeViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(1);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onLoadError = () => {
    setError(true);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col items-center bg-gray-50 dark:bg-gray-900 rounded-xl p-3">

      {/* TOOLBAR */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={() => setScale((s) => Math.max(0.6, s - 0.1))}
          className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded"
        >
          -
        </button>

        <span className="text-xs text-gray-500">
          Zoom {(scale * 100).toFixed(0)}%
        </span>

        <button
          onClick={() => setScale((s) => Math.min(2, s + 0.1))}
          className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 rounded"
        >
          +
        </button>
      </div>

      {/* STATES */}
      {loading && (
        <div className="text-sm text-gray-500 py-10">
          Loading resume...
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500 py-10">
          Failed to load resume
        </div>
      )}

      {/* PDF */}
      {!error && (
        <div className="overflow-auto w-full flex justify-center">
          <Document
            file={url}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            loading={null}
          >
            {numPages &&
              Array.from(new Array(numPages), (_, i) => (
                <div key={i} className="mb-4 shadow-lg rounded">
                  <Page
                    pageNumber={i + 1}
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              ))}
          </Document>
        </div>
      )}
    </div>
  );
}
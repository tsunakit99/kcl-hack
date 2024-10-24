"use client";

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Web Workerの設定
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

interface PDFViewerProps {
  fileUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.error('PDFの読み込みに失敗しました:', error)}
      >
        <Page pageNumber={pageNumber} width={600} />
      </Document>
      <div>
        <p>
          ページ {pageNumber} / {numPages}
        </p>
        <button
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber <= 1}
        >
          前のページ
        </button>
        <button
          onClick={() =>
            setPageNumber((prev) => (numPages ? Math.min(prev + 1, numPages) : prev))
          }
          disabled={numPages ? pageNumber >= numPages : true}
        >
          次のページ
        </button>
      </div>
    </div>
  );
};

export default PDFViewer;

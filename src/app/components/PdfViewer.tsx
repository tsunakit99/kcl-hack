"use client";
import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core"; // PDFビューアの必要なコンポーネントをインポート
import "@react-pdf-viewer/core/lib/styles/index.css"; // 必要なスタイルをインポート
import { Box } from "@mui/material";

// fileUrlがデータベースから取得したPDFのURLであると仮定
const PdfViewer: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
  const [pdfFile, setPdfFile] = useState<string | null>(null);

  useEffect(() => {
    // fileUrlを使ってPDFファイルを設定
    setPdfFile(fileUrl);
  }, [fileUrl]);

  return (
    <Box sx={{ height: "90vh", width: "100%" }}>
      {pdfFile ? (
        // PDF WorkerはPDFのレンダリングに必要
        <Worker
          workerUrl={`https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js`}
        >
          <Viewer fileUrl={pdfFile} />
        </Worker>
      ) : (
        <div>PDFファイルが見つかりません</div>
      )}
    </Box>
  );
};

export default PdfViewer;

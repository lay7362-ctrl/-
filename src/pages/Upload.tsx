import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";

export function Upload() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  function handleUpload(_key: string, url: string) {
    setUploadedUrl(url);
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>파일 업로드 (R2)</h1>
      <FileUpload onUpload={handleUpload} accept="image/*" />

      {uploadedUrl && (
        <div style={{ marginTop: "1.5rem" }}>
          <p>업로드 완료!</p>
          <img
            src={uploadedUrl}
            alt="uploaded"
            style={{ maxWidth: "100%", borderRadius: "8px" }}
          />
        </div>
      )}
    </main>
  );
}

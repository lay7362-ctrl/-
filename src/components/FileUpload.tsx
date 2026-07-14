import { useRef, useState } from "react";
import { api } from "@/lib/api";

interface FileUploadProps {
  onUpload: (key: string, url: string) => void;
  accept?: string;
}

export function FileUpload({ onUpload, accept = "image/*" }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const res = await api.files.upload(file);
    setUploading(false);

    if (res.success && res.data) {
      onUpload(res.data.key, res.data.url);
    } else {
      setError(res.error ?? "Upload failed");
    }

    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={uploading}
        style={{ display: "none" }}
        id="file-upload-input"
      />
      <label htmlFor="file-upload-input" style={{ cursor: uploading ? "not-allowed" : "pointer" }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "업로드 중..." : "파일 선택"}
        </button>
      </label>
      {error && <p style={{ color: "red", fontSize: "0.875rem" }}>{error}</p>}
    </div>
  );
}

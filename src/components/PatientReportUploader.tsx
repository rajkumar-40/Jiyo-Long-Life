import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, Trash2, AlertCircle, FilePlus, Sparkles } from 'lucide-react';
import { HealthFile } from '../types';

interface PatientReportUploaderProps {
  files: HealthFile[];
  onChange: (files: HealthFile[]) => void;
  language: string;
}

export default function PatientReportUploader({ files, onChange, language }: PatientReportUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper to format file size
  const formatSize = (bytes?: number) => {
    if (!bytes) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleFile = async (rawFile: File) => {
    setError(null);
    
    // Check file size (limit to 4MB to keep base64 payloads reasonable)
    if (rawFile.size > 4 * 1024 * 1024) {
      setError("File is too large. Please upload files under 4MB.");
      return;
    }

    // Supported mime types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain'];
    if (!allowedTypes.includes(rawFile.type)) {
      setError("Unsupported format. Please upload JPEG, PNG, WEBP, PDF, or TXT.");
      return;
    }

    try {
      const base64 = await fileToBase64(rawFile);
      const newFile: HealthFile = {
        name: rawFile.name,
        mimeType: rawFile.type,
        base64: base64,
        size: rawFile.size
      };
      
      // Append if not already added by name
      if (files.some(f => f.name === newFile.name)) {
        setError("File already added.");
        return;
      }
      
      onChange([...files, newFile]);
    } catch (err) {
      console.error("Error reading file:", err);
      setError("Failed to process the selected file.");
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      for (const file of droppedFiles) {
        await handleFile(file);
      }
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFiles = Array.from(e.target.files);
      for (const file of selectedFiles) {
        await handleFile(file);
      }
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated);
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  // Marathi translation helpers
  const isMarathi = language === 'Marathi';
  const titleText = isMarathi 
    ? "Patient Reports & Symptom Photos (रुग्ण अहवाल आणि फोटो)" 
    : "Patient Reports & Symptom Photos";
  const descText = isMarathi 
    ? "अपलोड करा: रक्त चाचणी, प्रिस्क्रिप्शन, किंवा लक्षणांचे फोटो (Max 4MB per file)"
    : "Upload: blood reports, scan images, prescription, or skin/symptom photos (Max 4MB)";
  const dragText = isMarathi
    ? "फाईल्स येथे खेचून आणा किंवा क्लिक करा"
    : "Drag & drop files here, or click to choose";

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold uppercase tracking-wider text-[#90a4ae]">
          {titleText}
        </label>
        {files.length > 0 && (
          <span className="text-[10px] bg-[#e8f5e9] text-[#2e7d32] font-mono px-2 py-0.5 rounded-full font-bold">
            {files.length} {files.length === 1 ? 'File' : 'Files'} Added
          </span>
        )}
      </div>

      {/* Drag & Drop Box */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
          dragActive 
            ? 'border-[#4caf50] bg-[#f1f8e9]' 
            : 'border-[#cfd8dc] bg-[#f5f7f8] hover:bg-[#eceff1] hover:border-[#90a4ae]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          accept="image/jpeg,image/png,image/webp,application/pdf,text/plain"
          onChange={handleInputChange}
        />
        
        <div className="p-3 bg-white rounded-full shadow-sm text-emerald-600">
          <Upload className="w-5 h-5" />
        </div>
        
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-700">
            {dragText}
          </p>
          <p className="text-[10px] text-gray-400">
            {descText}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1.5 p-2 bg-red-50 text-red-600 text-[10px] font-semibold rounded-lg border border-red-100">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Uploaded Files Previews (Highly Identifiable) */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {files.map((file, idx) => {
            const isImg = file.mimeType.startsWith('image/');
            return (
              <div 
                key={file.name + idx}
                className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-gray-100 shadow-sm relative group hover:border-emerald-200 transition-all"
              >
                {/* Visual Thumbnail */}
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                  {isImg ? (
                    <img 
                      src={file.base64} 
                      alt={file.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <FileText className="w-6 h-6 text-emerald-600" />
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0 pr-6">
                  <h5 className="text-xs font-semibold text-gray-800 truncate" title={file.name}>
                    {file.name}
                  </h5>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                    {formatSize(file.size)} • {file.mimeType.split('/')[1].toUpperCase()}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Remove file"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

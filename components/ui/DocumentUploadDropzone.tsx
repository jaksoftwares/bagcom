import React, { useCallback, useState } from 'react';
import { UploadCloud, File, X } from 'lucide-react';

interface DocumentUploadDropzoneProps {
  onFileSelect: (file: File | null) => void;
  label: string;
  description: string;
  error?: string;
}

export default function DocumentUploadDropzone({
  onFileSelect,
  label,
  description,
  error
}: DocumentUploadDropzoneProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      
      {selectedFile ? (
        <div className="relative flex items-center p-4 bg-primary/5 border border-primary/20 rounded-sm">
          <div className="flex items-center gap-4 flex-1 overflow-hidden">
            <div className="h-10 w-10 shrink-0 bg-primary/10 rounded flex items-center justify-center text-primary">
              <File className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{selectedFile.name}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={removeFile}
            className="p-2 text-muted-foreground hover:text-red-500 transition-colors z-10 relative"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-sm transition-all cursor-pointer ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : error 
                ? 'border-red-300 bg-red-50 hover:bg-red-50/50' 
                : 'border-border/40 hover:bg-muted/10'
          }`}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleChange}
            accept="image/*,.pdf"
          />
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-foreground mb-1 text-center">
            Click to upload or drag and drop
          </p>
          <p className="text-[11px] text-muted-foreground text-center font-medium max-w-xs leading-relaxed">
            {description}
          </p>
        </div>
      )}
      {error && <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mt-1">{error}</p>}
    </div>
  );
}

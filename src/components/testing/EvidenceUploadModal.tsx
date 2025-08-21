import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';

interface EvidenceUploadModalProps {
  wcagId: string;
  criterionTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (files: File[]) => void;
}

interface UploadFile {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

export const EvidenceUploadModal = ({ wcagId, criterionTitle, isOpen, onClose, onUploadComplete }: EvidenceUploadModalProps) => {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      status: 'pending' as const,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const uploadFiles = async () => {
    // Simulate upload process; replace with real API call
    const updatedFiles = [...files];
    for (let i = 0; i < updatedFiles.length; i++) {
      updatedFiles[i].status = 'uploading';
      setFiles([...updatedFiles]);
      try {
        // TODO: Replace with actual upload logic, e.g. API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        updatedFiles[i].status = 'success';
      } catch (error) {
        updatedFiles[i].status = 'error';
        updatedFiles[i].errorMessage = 'Upload failed';
      }
      setFiles([...updatedFiles]);
    }
    const successfulFiles = updatedFiles.filter(f => f.status === 'success').map(f => f.file);
    onUploadComplete(successfulFiles);
    onClose();
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Evidence for {wcagId}</DialogTitle>
          <p className="mb-4 text-sm text-muted-foreground">{criterionTitle}</p>
        </DialogHeader>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-muted'
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag & drop files here, or click to select files</p>
          )}
        </div>
        <ul className="mt-4 max-h-48 overflow-y-auto space-y-2">
          {files.map((uploadFile, index) => (
            <li key={index} className="flex items-center justify-between border rounded p-2">
              <span className="truncate">{uploadFile.file.name}</span>
              <div className="flex items-center gap-2">
                {uploadFile.status === 'uploading' && <span className="text-blue-500">Uploading...</span>}
                {uploadFile.status === 'success' && <span className="text-green-600">Uploaded</span>}
                {uploadFile.status === 'error' && <span className="text-red-600">{uploadFile.errorMessage}</span>}
                <Button size="sm" variant="ghost" onClick={() => removeFile(index)}>Remove</Button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={files.length === 0} onClick={uploadFiles}>Upload</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

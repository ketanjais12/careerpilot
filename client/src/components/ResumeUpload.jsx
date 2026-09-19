import { useState, useEffect } from 'react';
import { uploadResume } from '../services/resumeService';
import { FileText, CheckCircle2, UploadCloud, AlertCircle, X, FileUp } from 'lucide-react';

const ResumeUpload = ({ hasExistingResume = false, existingFileName = '', onUploadSuccess }) => {
  const [showUploader, setShowUploader] = useState(!hasExistingResume);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [currentFileName, setCurrentFileName] = useState(existingFileName); 
  
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setShowUploader(!hasExistingResume);
    if (existingFileName) setCurrentFileName(existingFileName);
  }, [hasExistingResume, existingFileName]);

  const handleFileChange = (e) => {
    setMessage(null);
    setError(null);
    
    const file = e.target.files[0];
    
    if (file && file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      setSelectedFile(null);
      return;
    }
    
    if (file && file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await uploadResume(selectedFile);
      setMessage('New resume uploaded successfully!');
      
      setCurrentFileName(selectedFile.name); 
      
      setSelectedFile(null); 
      setShowUploader(false); 
      
      if (onUploadSuccess) onUploadSuccess(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to upload resume. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const displayFileName = currentFileName || 'Resume Document (PDF)';

  return (
    <div className="bg-transparent w-full">
      {/* Alert Messages */}
      {message && (
        <div className="mb-4 p-3 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center gap-2 text-sm border border-emerald-500/20 animate-fade-in-up">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 text-red-400 rounded-lg flex items-center gap-2 text-sm border border-red-500/20 animate-fade-in-up">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {!showUploader ? (
        /* --- ACTIVE RESUME STATE --- */
        <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 md:p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-emerald-500/10 hover:border-emerald-500/30">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 mt-0.5">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white font-medium text-sm md:text-base">Active Resume Linked</p>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-emerald-400/80 text-xs md:text-sm font-medium mb-1.5 flex items-center gap-1.5">
                <span className="bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 truncate max-w-[200px] md:max-w-xs">
                  {displayFileName}
                </span>
              </p>
              <p className="text-white/40 text-xs">AI Assistant is actively parsing this document for job matches.</p>
            </div>
          </div>
          
          <button 
            onClick={() => setShowUploader(true)}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white/60 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white transition-all shrink-0"
          >
            Update Resume
          </button>
        </div>
      ) : (
        /* --- UPLOAD STATE --- */
        <div className="bg-[#0D0D0D] border border-white/5 p-5 md:p-6 rounded-xl animate-fade-in-up">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-white/60">
              Upload a <span className="text-white/80 font-medium">PDF resume</span> to unlock AI-powered insights, parsing, and interview prep. Max 5MB.
            </p>
            {hasExistingResume && (
              <button 
                onClick={() => {
                  setShowUploader(false);
                  setError(null);
                  setSelectedFile(null);
                }}
                className="p-1 text-white/40 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Custom styled file input */}
            <div className="relative flex-grow">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
              />
              <div className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-lg border border-dashed transition-colors ${selectedFile ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400' : 'border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:bg-white/10'} ${isUploading ? 'opacity-50' : ''}`}>
                <FileUp className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium truncate">
                  {selectedFile ? selectedFile.name : "Click or drag to select PDF"}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500 text-black font-semibold text-sm rounded-lg hover:bg-emerald-400 disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed transition-all active:scale-95 whitespace-nowrap"
            >
              {isUploading ? (
                <>
                  <UploadCloud className="w-4 h-4 animate-pulse" /> Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" /> Upload
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
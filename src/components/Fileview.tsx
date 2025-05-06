import closeIcon from "../assets/close.svg";
import React from "react";

interface PdfModalProps {
  file: {
    id: string;
    name: string;
    webViewLink: string;
    webContentLink: string;
  } | null;
  onClose: () => void;
}

const PdfModal: React.FC<PdfModalProps> = ({ file, onClose }) => {
  if (!file) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-5xl h-[90vh] flex flex-col border border-white/30">
        <div className="flex justify-between items-center px-6 py-4 bg-white/70 border-b border-violet-200 rounded-t-2xl">
          <h2 className="text-xl font-bold text-violet-800 tracking-wide">
            {file.name}
          </h2>
          <button
            onClick={onClose}
            className="rounded-2xl hover:bg-rose-50 transition-colors"
          >
            <img src={closeIcon} alt="Close" className="w-8 h-8" />
          </button>
        </div>
        <div className="flex-1 w-full bg-slate-200 p-2 rounded-b-2xl">
          <iframe
            src={`https://drive.google.com/file/d/${file.id}/preview`}
            title={file.name}
            className="w-full h-full rounded-md border-0"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default PdfModal;

import React from 'react';
import { X, ExternalLink, Download, FileText } from 'lucide-react';

interface ScheduleDocModalProps {
  onClose: () => void;
}

export const ScheduleDocModal: React.FC<ScheduleDocModalProps> = ({ onClose }) => {
  const pdfUrl = '/assets/aistudio/2026Oct22_APU-SHUTTLE-SERVICES_6fa3fc92.pdf';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Official APU Shuttle Schedule</h3>
              <p className="text-[11px] text-slate-400">Effective 22 October 2026 • Campus Connect</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded PDF iframe */}
        <div className="flex-1 bg-slate-950 relative">
          <iframe
            src={pdfUrl}
            title="APU Shuttle Services Schedule PDF"
            className="w-full h-full border-0"
          />
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-center text-[11px] text-slate-400">
          Source: Asia Pacific University of Technology & Innovation (APU) Shuttle Services
        </div>
      </div>
    </div>
  );
};

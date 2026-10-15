import React, { useRef, useState } from 'react';
import { X, Download, Upload, RotateCcw } from 'lucide-react';

import { useApp } from '../context/AppContext';
import { exportDataCartridge } from '../utils/storage';

interface FloppyCartridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FloppyCartridgeModal: React.FC<FloppyCartridgeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { tasks, columns, stats, importCartridgeData, resetAllData } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportDataCartridge(tasks, columns, stats);
    setStatusMessage('💾 SAVED TO FLOPPY DISK (JSON CARTRIDGE)!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.tasks && parsed.columns) {
          importCartridgeData(parsed.tasks, parsed.columns, parsed.stats);
          setStatusMessage('🎮 CARTRIDGE LOADED SUCCESSFULLY!');
          setTimeout(() => {
            setStatusMessage(null);
            onClose();
          }, 1500);
        } else {
          setStatusMessage('❌ INVALID CARTRIDGE FORMAT!');
        }
      } catch (err) {
        setStatusMessage('❌ FAILED TO PARSE JSON FILE');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-neutral-900 border-4 border-black retro-shadow-lg text-white">
        {/* Window Title */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 px-3 py-1.5 flex items-center justify-between border-b-2 border-black">
          <span className="font-pixel text-xs text-yellow-300">
            FLOPPY_DRIVE_A:\SAVE_LOAD.EXE
          </span>
          <button
            onClick={onClose}
            className="w-5 h-5 bg-rose-600 hover:bg-rose-500 border border-black flex items-center justify-center font-bold text-white text-xs cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Floppy Disk Icon Frame */}
          <div className="bg-black border-2 border-neutral-700 p-4 text-center">
            <div className="text-4xl mb-1">💾</div>
            <div className="font-pixel text-xs text-cyan-300">
              3.5" HIGH DENSITY DISK (1.44MB)
            </div>
            <div className="font-mono text-xs text-neutral-400 mt-1">
              Backup your quests, columns, and player XP to a file or load an existing save.
            </div>
          </div>

          {statusMessage && (
            <div className="bg-yellow-400 text-black font-pixel text-[10px] p-2 text-center border-2 border-black animate-pulse">
              {statusMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-black font-pixel text-xs py-2.5 border-2 border-black retro-shadow font-bold cursor-pointer transition-transform hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              <span>SAVE TO DISK (EXPORT JSON)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-400 text-white font-pixel text-xs py-2.5 border-2 border-black retro-shadow font-bold cursor-pointer transition-transform hover:-translate-y-0.5"
            >
              <Upload className="w-4 h-4" />
              <span>INSERT CARTRIDGE (IMPORT JSON)</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>

          {/* Reset option */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
            <span className="font-mono text-xs text-neutral-400">
              Corrupted or want fresh start?
            </span>
            <button
              onClick={() => {
                if (window.confirm('Reset all demo tasks and XP to factory defaults?')) {
                  resetAllData();
                  setStatusMessage('⚡ FACTORY DATA RESTORED');
                  setTimeout(() => setStatusMessage(null), 2000);
                }
              }}
              className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-pixel text-[9px] underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET DEMO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

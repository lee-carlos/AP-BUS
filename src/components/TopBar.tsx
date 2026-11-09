import React, { useState } from 'react';
import { DemoUser } from '../types/bus';
import { Search, MoreVertical, RefreshCw, FileText, UserCheck, X } from 'lucide-react';

interface TopBarProps {
  currentUser: DemoUser;
  onOpenSearch: () => void;
  onSwitchUser: () => void;
  onResetData: () => void;
  onToggleSimulator: () => void;
  onViewScheduleDoc: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentUser,
  onOpenSearch,
  onSwitchUser,
  onResetData,
  onToggleSimulator,
  onViewScheduleDoc,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <header className="px-4 py-3 bg-slate-900/90 backdrop-blur border-b border-slate-800 flex items-center justify-between sticky top-11 z-20">
      {/* Brand & Search Action */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSearch}
          className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition"
          title="Search stops, routes or features"
          aria-label="Search"
        >
          <Search className="w-4 h-4 text-blue-400" />
        </button>

        <div className="leading-none">
          <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
            AP-BUS
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </span>
          <span className="text-[10px] text-slate-400 font-mono">APU Shuttle</span>
        </div>
      </div>

      {/* Right Controls: 3 Dots (More) & Profile Picture */}
      <div className="flex items-center gap-2.5 relative">
        {/* 3 Dots Menu Button */}
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition"
          title="More options"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {/* User Profile Avatar with Switcher Click */}
        <button
          onClick={onSwitchUser}
          className="relative group focus:outline-none"
          title={`Signed in as ${currentUser.name} (${currentUser.studentId}). Click to switch demo account.`}
          aria-label="User profile picture"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/80 hover:ring-blue-400 transition"
          />
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-slate-900 ${
              currentUser.isNearStop ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
        </button>

        {/* Dropdown Menu for 3 Dots */}
        {showMoreMenu && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setShowMoreMenu(false)}
            />
            <div className="absolute right-0 top-11 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-40 text-xs text-slate-200">
              <div className="px-3 py-2 border-b border-slate-800/80">
                <p className="font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {currentUser.studentId} • {currentUser.isNearStop ? 'In Range' : 'Out of Range'}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onSwitchUser();
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center gap-2 text-slate-300 hover:text-white transition"
              >
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span>Switch Demo Account (1 / 2)</span>
              </button>

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onToggleSimulator();
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center gap-2 text-slate-300 hover:text-white transition"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Simulate GPS & Time</span>
              </button>

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onViewScheduleDoc();
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center gap-2 text-slate-300 hover:text-white transition"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>View Official APU PDF Schedule</span>
              </button>

              <div className="border-t border-slate-800/80 my-1" />

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onResetData();
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center gap-2 text-rose-400 hover:text-rose-300 transition"
              >
                <X className="w-4 h-4" />
                <span>Reset Demo Bookings</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

'use client';
import { useState } from 'react';
import { assignSeat } from '../app/actions';

type Guest = { id: number; name: string; seatNumber: string | null };

export default function SeatMap({ eventId, guests }: { eventId: number; guests: Guest[] }) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const rows = ['A', 'B', 'C', 'D'];
  const cols = [1, 2, 3, 4];

  
  const handleAssign = async (guestId: string) => {
    if (!selectedSeat) return;
    setLoading(true);
    await assignSeat(eventId, parseInt(guestId), selectedSeat);
    setSelectedSeat(null);
    setLoading(false);
  };

  return (
    // 👇 CHANGED: bg-black/40 makes it transparent. backdrop-blur-sm blurs the background image slightly.
    <div className="bg-black/40 p-6 rounded-xl shadow-lg border border-pub-wood h-fit backdrop-blur-md">
      <h2 className="text-lg font-bold mb-4 text-pub-gold flex items-center gap-2 border-b border-gray-600 pb-3">
        🪑 Seating Plan
      </h2>
      
      {/* THE GRID */}
      <div className="grid grid-cols-4 gap-3 mb-6 max-w-xs mx-auto p-4 bg-black/30 rounded-xl border border-gray-700">
        {rows.map(row => 
          cols.map(col => {
            const seatId = `${row}${col}`;
            const occupant = guests.find(g => g.seatNumber === seatId);
            const isSelected = selectedSeat === seatId;

            return (
              <button
                key={seatId}
                onClick={() => setSelectedSeat(seatId)}
                disabled={!!occupant}
                // 👇 Updated button styles for dark mode transparency
                className={`
                  p-2 rounded-lg text-xs font-bold aspect-square flex flex-col items-center justify-center transition shadow-sm border
                  ${occupant ? 'bg-pub-gold text-pub-black border-pub-gold cursor-not-allowed opacity-90' : 
                    isSelected ? 'bg-white text-black border-white scale-105' : 'bg-white/10 hover:bg-white/20 text-gray-300 border-gray-600 hover:border-pub-gold'}
                `}
              >
                <span className={occupant ? 'text-black text-[10px]' : 'text-lg'}>{occupant ? '👤' : '🪑'}</span>
                <span className="mt-1">{seatId}</span>
              </button>
            );
          })
        )}
      </div>

      {/* ASSIGNMENT PANEL */}
      {selectedSeat && (
        <div className="bg-pub-gold/10 p-4 rounded-lg border border-pub-gold animate-in fade-in slide-in-from-top-2">
          <p className="text-sm font-bold text-white mb-3">Assign Table <span className="text-lg text-pub-gold">{selectedSeat}</span> to:</p>
          <div className="flex gap-2">
            {/* 👇 Updated Select to be dark with white text */}
            <select 
                className="flex-1 text-sm border border-pub-gold p-2 rounded-lg bg-black text-white font-medium focus:ring-0 outline-none"
                onChange={(e) => handleAssign(e.target.value)}
                disabled={loading}
                defaultValue=""
            >
                <option value="" disabled className="text-gray-500">Select Patron</option>
                {guests.filter(g => !g.seatNumber).map(g => (
                    <option key={g.id} value={g.id} className="text-white bg-black">{g.name}</option>
                ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
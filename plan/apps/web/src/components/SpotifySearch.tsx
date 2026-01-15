'use client';
import { useState } from 'react';
import { findTracks, addTrackToEvent } from '../app/actions';

export default function SpotifySearch({ eventId }: { eventId: number }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    const tracks = await findTracks(query);
    setResults(tracks);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {/* 👇 ADDED min-w-0 to prevent overflow */}
        <input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search for a song..." 
            className="flex-1 min-w-0 border border-gray-600 p-2 rounded-lg text-sm bg-black/40 outline-none focus:border-pub-gold text-white font-medium placeholder:text-gray-500" 
        />
        {/* 👇 ADDED whitespace-nowrap to prevent text wrapping */}
        <button onClick={handleSearch} className="bg-green-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition border border-green-500 shadow-sm whitespace-nowrap">
            Search
        </button>
      </div>
      
      
      <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar pr-1">
        {results.map((track: any) => (
          <form key={track.id} action={addTrackToEvent} className="flex items-center gap-2 p-2 bg-black/60 rounded border border-gray-700 hover:border-pub-gold transition">
             <input type="hidden" name="eventId" value={eventId} />
             <input type="hidden" name="title" value={track.name} />
             <input type="hidden" name="artist" value={track.artists[0].name} />
             <input type="hidden" name="spotifyId" value={track.id} />
             <input type="hidden" name="albumArt" value={track.album.images[0]?.url} />
             <img src={track.album.images[2]?.url} className="w-8 h-8 rounded border border-gray-600" alt="Album Art" />
             <div className="flex-1 min-w-0">
               <p className="text-xs font-extrabold truncate text-white">{track.name}</p>
               <p className="text-[10px] text-pub-gold truncate">{track.artists[0].name}</p>
             </div>
             <button className="text-xl text-green-500 hover:scale-110 transition font-bold px-2">+</button>
          </form>
        ))}
      </div>
    </div>
  );
}
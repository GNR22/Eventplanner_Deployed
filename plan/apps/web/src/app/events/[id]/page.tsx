import { prisma } from "@acme/database";
import { addGuest, addTask, addExpense, toggleTask, deleteTrack, finalizeEvent } from "../../actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import SpotifySearch from "@/components/SpotifySearch";
import SeatMap from "@/components/SeatMap";
import { getServerAuthSession } from "@/lib/auth";
import { cache } from "react";
import { GuestForm, ExpenseForm, TaskForm } from "@/components/ClearableForms";

const getEvent = cache(async (id: number) => {
  return await prisma.event.findUnique({
    where: { id },
    include: { guests: true, tasks: true, expenses: true, tracks: true }
  });
});

export default async function EventDashboard({ params }: { params: { id: string } }) {
  const eventId = parseInt(params.id);
  if (isNaN(eventId)) return notFound();
  const event = await getEvent(eventId);
  const session = await getServerAuthSession();
  if (!event) return notFound();

  const totalExpenses = event.expenses.reduce((sum, item) => sum + item.cost, 0);
  const remainingBudget = event.budgetLimit - totalExpenses;
  const isOverBudget = totalExpenses > event.budgetLimit;
  const progressPercent = Math.min((totalExpenses / event.budgetLimit) * 100, 100);
  const isDone = event.status === "DONE";
  // @ts-ignore
  const isGoogleUser = session?.user?.provider === 'google' || session?.user?.image?.includes('googleusercontent');

  // Theme Colors
  const progressColors = isOverBudget ? 'bg-red-600' : 'bg-pub-gold';
  const bgColors = isOverBudget ? 'bg-red-900/30' : 'bg-gray-700';

  return (
    <div className="min-h-screen pb-24">
      {/* HEADER: Dark Wood Menu Board Look */}
      <div className="bg-pub-charcoal border-b-2 border-pub-gold sticky top-0 z-10 shadow-lg text-pub-chalk backdrop-blur-md bg-opacity-95">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
                {event.name}
                {isDone && <span className="text-xs bg-pub-gold text-pub-black px-3 py-1 rounded-full border-2 border-pub-black font-bold shadow-sm">✅ TAB CLOSED</span>}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-gray-400 font-mono text-xs uppercase tracking-widest">
                <p>ID: {event.id}</p>
                {isGoogleUser && <span className="flex items-center gap-1 ml-2 bg-black/50 px-2 rounded"><span className="font-bold text-pub-gold">G</span> Google</span>}
            </div>
          </div>
          <Link href="/" className="text-sm font-bold text-pub-gold hover:text-white transition underline-offset-4 hover:underline">
            ← Main Menu
          </Link>
        </div>
      </div>

      <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
        
        {/* COL 1: BUDGET */}
        <div className="space-y-6">
          <div className="bg-pub-charcoal/90 p-6 rounded-xl shadow-lg border border-pub-wood relative backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-6 text-pub-gold flex items-center gap-2 border-b border-gray-600 pb-3">
              <span>💰</span> Budget
            </h2>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2 text-gray-300 font-bold text-sm">
                <span>Spent: ${totalExpenses.toFixed(2)}</span>
                <span>Limit: ${event.budgetLimit}</span>
              </div>
              <div className={`w-full ${bgColors} rounded-full h-4 overflow-hidden border border-black/50`}>
                <div 
                  className={`h-full transition-all duration-500 ${progressColors} relative shadow-[0_0_10px_rgba(255,179,0,0.5)]`} 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {isOverBudget ? (
              <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg text-sm font-bold flex items-center gap-2">
                ⚠️ Over limit by ${(totalExpenses - event.budgetLimit).toFixed(2)}
              </div>
            ) : (
              <div className="bg-green-900/30 border border-green-600 text-green-400 p-4 rounded-lg text-sm text-center font-bold">
                 Remaining: ${remainingBudget.toFixed(2)}
              </div>
            )}
            
            {!isDone && (
                <>
                    <hr className="my-6 border-gray-600 border-dashed"/>
                    <ExpenseForm action={addExpense} eventId={event.id} />
                </>
            )}

            <div className="mt-6 space-y-1 max-h-48 overflow-y-auto pr-2 font-mono text-sm custom-scrollbar">
              {event.expenses.map(ex => (
                <div key={ex.id} className="flex justify-between py-2 border-b border-gray-700 text-gray-300 hover:bg-white/5 px-1 rounded transition">
                  <span>{ex.item}</span>
                  <span className="font-bold text-pub-gold">-${ex.cost.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COL 2: GUESTS */}
        <div className="space-y-8">
          <div className="bg-pub-charcoal/90 p-6 rounded-xl shadow-lg border border-pub-wood backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 text-pub-gold flex items-center gap-2 border-b border-gray-600 pb-3">
              <span>👥</span> Guest ({event.guests.length})
            </h2>
            {!isDone && <GuestForm action={addGuest} eventId={event.id} />}
            <ul className="space-y-3 max-h-64 overflow-y-auto pr-2 mt-4 custom-scrollbar">
              {event.guests.map(guest => (
                <li key={guest.id} className="flex items-center gap-3 p-3 bg-black/40 rounded-lg border border-gray-700 justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🍺</span>
                    <span className="font-bold text-gray-200 text-sm">{guest.name}</span>
                  </div>
                  {guest.seatNumber && <span className="text-[10px] bg-pub-gold text-pub-black px-2 py-1 rounded font-bold border border-pub-wood shadow-sm uppercase tracking-wider">Table {guest.seatNumber}</span>}
                </li>
              ))}
              {event.guests.length === 0 && <p className="text-sm text-gray-500 italic text-center py-4">Empty house.</p>}
            </ul>
          </div>
          <SeatMap eventId={event.id} guests={event.guests} />
        </div>

        {/* COL 3: ATMOSPHERE */}
        <div className="space-y-8">
           <div className="bg-pub-charcoal/90 p-6 rounded-xl shadow-lg border border-pub-wood backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 text-pub-gold flex items-center gap-2 border-b border-gray-600 pb-3">
                <span>🎧</span> Add Playlist
            </h2>
            {!isDone && <SpotifySearch eventId={event.id} />}
            <div className="space-y-4 mt-6">
                {event.tracks.map((track) => (
                <div key={track.id} className="p-3 bg-black/40 rounded-xl border border-gray-700 space-y-3 relative overflow-hidden group hover:border-pub-gold transition">
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3 overflow-hidden">
                            {track.albumArt && <img src={track.albumArt} className="w-12 h-12 rounded-lg object-cover border border-gray-600 shadow-sm" alt="Art" />}
                            <div className="min-w-0"><p className="text-sm font-extrabold truncate text-gray-200">{track.title}</p><p className="text-xs text-pub-gold truncate font-medium">{track.artist}</p></div>
                        </div>
                        {!isDone && <form action={deleteTrack}><input type="hidden" name="id" value={track.id} /><input type="hidden" name="eventId" value={event.id} /><button className="text-gray-500 hover:text-red-500 text-lg transition p-1 font-bold">✕</button></form>}
                    </div>
                    <iframe src={`https://open.spotify.com/embed/track/{track.spotifyId}?utm_source=generator&theme=0`} width="100%" height="80" frameBorder="0" allow="encrypted-media" className="rounded-lg relative z-10 shadow-lg opacity-80 group-hover:opacity-100 transition"></iframe>
                </div>
                ))}
            </div>
          </div>
          
          <div className="bg-pub-charcoal/90 p-6 rounded-xl shadow-lg border border-pub-wood backdrop-blur-sm">
             <h2 className="text-xl font-bold mb-4 text-pub-gold flex items-center gap-2 border-b border-gray-600 pb-3">
                <span>📋</span> To do list
             </h2>
             {!isDone && <TaskForm action={addTask} eventId={event.id} />}
             <ul className="space-y-2 mt-4 pl-1">
                {event.tasks.map(task => (
                <li key={task.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${task.isDone ? 'bg-green-900/20 border-green-800' : 'bg-black/40 border-gray-700'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${task.isDone ? 'bg-green-600 border-green-600' : 'border-gray-500 bg-transparent'}`}>
                            {task.isDone && <span className="text-white text-xs font-bold">✓</span>}
                        </div>
                        <span className={`text-sm font-bold ${task.isDone ? "line-through text-gray-500" : "text-gray-200"}`}>{task.title}</span>
                    </div>
                    <form action={toggleTask}><input type="hidden" name="id" value={task.id} /><input type="hidden" name="eventId" value={event.id} /><input type="hidden" name="isDone" value={String(task.isDone)} /><button disabled={isDone} className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm ${task.isDone ? 'bg-gray-700 text-gray-400' : 'bg-pub-gold text-pub-black hover:bg-white'}`}>{task.isDone ? "Undo" : "Done"}</button></form>
                </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
      
      {/* FINALIZATION FOOTER */}
      {!isDone && (
        <div className="fixed bottom-0 left-0 w-full bg-pub-charcoal/95 border-t-2 border-pub-gold p-4 flex justify-center shadow-[0_-5px_20px_rgba(0,0,0,0.5)] backdrop-blur-md z-20">
            <form action={finalizeEvent}><input type="hidden" name="eventId" value={event.id} /><button className="bg-pub-gold text-pub-black px-8 py-4 rounded-full font-extrabold text-lg hover:scale-105 transition shadow-[0_0_15px_rgba(255,179,0,0.5)] border-2 border-black flex items-center gap-2 uppercase tracking-wider"><span>🍺</span> Close Tab (Finalize)</button></form>
        </div>
      )}
      {isDone && (
         <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-xl animate-bounce border-2 border-white z-50">✨ Tab Closed!</div>
      )}
    </div>
  );
}
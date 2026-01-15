import { prisma } from "@acme/database";
import { createEvent, deleteEvent } from "./actions";
import Link from "next/link";
import { getServerAuthSession } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton"; // 👈 Import the new button

export default async function HomePage() {
  const session = await getServerAuthSession();
  
  const allEvents = session?.user 
    ? await prisma.event.findMany({ 
        where: { ownerId: session.user.id as string }, orderBy: { createdAt: 'desc' } 
      }) : [];

  return (
    <main className="container mx-auto p-8 max-w-4xl min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 border-b-2 border-pub-gold pb-6 border-dashed">
        <h1 className="text-4xl font-extrabold text-pub-gold tracking-tight flex items-center gap-3 drop-shadow-md">
            <span>🍺</span> The Event Pub
        </h1>
        
        {session ? (
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-pub-charcoal flex items-center justify-center text-pub-gold font-bold border-2 border-pub-gold shadow-sm">
                    {session.user?.name?.[0] || "U"}
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-pub-foam">{session.user?.name}</p>
                  {/* 👇 REPLACED THE OLD LINK WITH THIS BUTTON */}
                  <SignOutButton />
                </div>
            </div>
        ) : (
            <div className="text-sm font-bold text-pub-gold font-mono border border-pub-gold px-2 py-1 rounded">EST. 2025</div>
        )}
      </div>

      {session ? (
        <>
          {/* CREATE FORM */}
          <div className="bg-pub-charcoal/90 p-6 rounded-xl shadow-xl mb-8 border-2 border-pub-wood backdrop-blur-sm">
            <h2 className="text-xl font-bold mb-4 text-pub-chalk flex items-center gap-2">
                <span className="text-2xl">📝</span> Create new event
            </h2>
            <form action={createEvent} className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                  <input name="name" type="text" placeholder="Event Name (e.g. Friday Night Pints)" className="border-2 border-pub-wood p-3 rounded-lg flex-1 bg-black/40 outline-none focus:border-pub-gold text-pub-chalk placeholder:text-gray-500 font-medium transition" required />
                  <div className="relative w-full md:w-48">
                    <span className="absolute left-3 top-3 text-pub-gold font-bold">$</span>
                    <input name="budget" type="number" placeholder="Budget" className="border-2 border-pub-wood p-3 pl-8 rounded-lg w-full bg-black/40 outline-none focus:border-pub-gold text-pub-chalk placeholder:text-gray-500 font-medium font-mono transition" required />
                  </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <input name="date" type="datetime-local" className="border-2 border-pub-wood p-3 rounded-lg bg-black/40 flex-1 outline-none focus:border-pub-gold text-pub-chalk font-medium transition [color-scheme:dark]" required />
                <button type="submit" className="bg-pub-gold text-pub-black px-8 py-3 rounded-lg font-bold hover:bg-black transition shadow-md border-2 border-pub-gold uppercase tracking-wider">Create</button>
              </div>
            </form>
          </div>

          <div className="grid gap-4">
            {allEvents.map((event) => (
              <div key={event.id} className="border border-pub-wood p-5 rounded-xl flex justify-between items-center bg-pub-charcoal/80 shadow-md hover:border-pub-gold hover:bg-pub-charcoal transition group">
                <Link href={`/events/${event.id}`} className="flex-1">
                  <h3 className="font-bold text-lg text-pub-chalk group-hover:text-pub-gold transition">{event.name}</h3>
                  <div className="flex gap-4 text-sm text-gray-400 mt-1 font-medium">
                    <span className="flex items-center gap-1">💰 Limit: <span className="font-mono text-pub-gold">${event.budgetLimit}</span></span>
                    {event.date && <span>📅 {new Date(event.date).toLocaleDateString()}</span>}
                  </div>
                </Link>
                <form action={deleteEvent}>
                    <input type="hidden" name="id" value={event.id} />
                    <button className="text-pub-wood hover:text-red-500 p-2 text-sm rounded transition font-bold border border-transparent hover:border-red-500/30">✕</button>
                </form>
              </div>
            ))}
            {allEvents.length === 0 && <p className="text-center text-gray-500 py-10 italic">The board is empty.</p>}
          </div>
        </>
      ) : (
          /* LOGGED OUT HERO */
          <div className="text-center py-20 bg-black/60 rounded-2xl border-4 border-double border-pub-gold shadow-2xl backdrop-blur-md">
              <div className="w-20 h-20 bg-pub-gold text-pub-black rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-[0_0_20px_rgba(255,179,0,0.5)] border-4 border-pub-black">
                🍻
              </div>
              <h2 className="text-4xl font-extrabold text-pub-chalk mb-4 text-shadow">Welcome to the Pub</h2>
              <p className="text-pub-foam mb-8 max-w-md mx-auto font-medium text-lg">
                Create the atmosphere. Handle guests effortlessly.
              </p>
              
              <div className="bg-red-900/50 text-red-200 px-6 py-3 rounded-lg inline-block mb-8 border border-red-800 font-bold text-sm shadow-sm">
                  ⚠️ Please sign in to start planning your events!
              </div>
              
              <div className="flex justify-center">
                <Link 
                    href="/register"
                    className="inline-block bg-pub-gold text-pub-black px-10 py-4 rounded-full font-bold hover:bg-black transition shadow-[0_0_15px_rgba(255,179,0,0.4)] hover:shadow-[0_0_25px_rgba(255,179,0,0.6)] transform hover:-translate-y-0.5 text-lg border-2 border-pub-gold uppercase tracking-widest"
                >
                    Get Started →
                </Link>
              </div>
          </div>
      )}
    </main>
  );
}
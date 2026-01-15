import { prisma } from "@acme/database";
import Link from "next/link";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";

export default async function EventSummaryPage({ params }: { params: { id: string } }) {
  const eventId = parseInt(params.id);
  if (isNaN(eventId)) return notFound();
  
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { guests: true, tasks: true, expenses: true, tracks: true }
  });
  
  if (!event) return notFound();

  const totalExpenses = event.expenses.reduce((sum, item) => sum + item.cost, 0);
  const remainingBudget = event.budgetLimit - totalExpenses;

  return (
    <div className="min-h-screen py-10 px-4 backdrop-blur-sm bg-black/40">
      <div className="max-w-4xl mx-auto bg-pub-charcoal shadow-2xl rounded-sm overflow-hidden border-4 border-pub-wood print:shadow-none print:border-none relative">
        
        {/* Decorative top border */}
        <div className="h-2 bg-pub-gold w-full absolute top-0"></div>

        <div className="bg-black/50 text-white p-10 text-center relative mt-2 border-b-2 border-dashed border-gray-600">
            <h1 className="text-5xl font-extrabold mb-2 uppercase tracking-[0.2em] text-pub-gold font-serif text-shadow">The Tab</h1>
            <p className="text-gray-400 font-mono text-xs tracking-widest uppercase">Invoice ID: #{event.id}</p>
            <div className="w-24 h-1 bg-pub-wood mx-auto my-4 rounded-full"></div>
            <h2 className="text-3xl font-bold text-white">{event.name}</h2>
            {event.date && (
                <div className="mt-4 inline-block bg-pub-gold/10 px-6 py-1 rounded-full text-sm border border-pub-gold/30 text-pub-gold">
                    📅 {new Date(event.date).toLocaleDateString()}
                </div>
            )}
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Financial Breakdown */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-pub-gold border-b border-gray-600 pb-2 uppercase tracking-wide flex items-center gap-2">
                    <span>💰</span> Financials
                </h2>
                <div className="bg-black/30 p-6 rounded-sm border border-gray-700 font-mono">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Total Limit:</span>
                        <span>${event.budgetLimit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-red-400 mb-4">
                        <span>Total Spent:</span>
                        <span>-${totalExpenses.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-gray-600 w-full mb-4"></div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-lg uppercase">Balance:</span>
                        <span className={`text-2xl font-black ${remainingBudget >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ${remainingBudget.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Guest Manifest */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-pub-gold border-b border-gray-600 pb-2 uppercase tracking-wide flex items-center gap-2">
                    <span>👥</span> Guests
                </h2>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar border border-gray-800 bg-black/20 p-2 rounded">
                    {event.guests.map(guest => (
                        <div key={guest.id} className="flex justify-between p-2 border-b border-gray-700 text-sm hover:bg-white/5 transition">
                            <span className="font-bold text-gray-200">{guest.name}</span>
                            <span className="font-mono text-pub-black bg-pub-gold px-2 rounded text-xs font-bold py-0.5">
                                {guest.seatNumber ? `Table ${guest.seatNumber}` : 'BAR'}
                            </span>
                        </div>
                    ))}
                    {event.guests.length === 0 && <p className="text-gray-500 italic text-center text-xs py-2">No patrons listed.</p>}
                </div>
            </div>
        </div>
        
        {/* Footer Actions */}
        <div className="bg-black/40 p-6 flex justify-center gap-4 print:hidden border-t-2 border-pub-wood">
            <PrintButton />
            <Link 
                href="/" 
                className="bg-transparent text-pub-gold border-2 border-pub-gold px-6 py-2 rounded-lg font-bold hover:bg-pub-gold hover:text-pub-black transition uppercase tracking-wider text-sm flex items-center"
            >
                Return to Pub
            </Link>
        </div>
        
        <div className="text-center pb-6 pt-2 bg-pub-charcoal">
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                Generated by The Event Pub • Please Drink Responsibly
            </p>
        </div>
      </div>
    </div>
  );
}
'use client';
import { useRef } from 'react';
type Action = (formData: FormData) => Promise<void>;

export function GuestForm({ action, eventId }: { action: Action; eventId: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef} action={async (formData) => { await action(formData); formRef.current?.reset(); }} className="flex gap-2 mb-4">
      <input type="hidden" name="eventId" value={eventId} />
      {/* 👇 ADDED min-w-0 */}
      <input 
        name="name" 
        placeholder="Guest name..." 
        className="flex-1 min-w-0 border border-gray-600 p-2 rounded-lg text-sm bg-black/40 outline-none focus:border-pub-gold text-white placeholder:text-gray-500 font-medium transition" 
        required 
      />
      <button className="bg-pub-gold text-black px-4 py-2 rounded-lg font-bold hover:bg-white transition border border-pub-gold whitespace-nowrap">+</button>
    </form>
  );
}

export function ExpenseForm({ action, eventId }: { action: Action; eventId: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef} action={async (formData) => { await action(formData); formRef.current?.reset(); }} className="space-y-3">
      <input type="hidden" name="eventId" value={eventId} />
      <input 
        name="item" 
        placeholder="Expense name..." 
        className="w-full border border-gray-600 p-3 rounded-lg text-sm bg-black/40 outline-none focus:border-pub-gold text-white placeholder:text-gray-500 font-medium transition" 
        required 
      />
      <input 
        name="cost" 
        type="number" 
        step="0.01" 
        placeholder="Amount ($)" 
        className="w-full border border-gray-600 p-3 rounded-lg text-sm bg-black/40 outline-none focus:border-pub-gold text-white placeholder:text-gray-500 font-medium font-mono transition" 
        required 
      />
      <button className="w-full bg-pub-gold text-black py-3 rounded-lg text-sm font-extrabold hover:bg-white transition-colors shadow-sm border border-pub-gold uppercase tracking-wider">Record Tab</button>
    </form>
  );
}

export function TaskForm({ action, eventId }: { action: Action; eventId: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form ref={formRef} action={async (formData) => { await action(formData); formRef.current?.reset(); }} className="flex gap-2 mb-4">
      <input type="hidden" name="eventId" value={eventId} />
      {/* 👇 ADDED min-w-0 */}
      <input 
        name="title" 
        placeholder="New Task..." 
        className="flex-1 min-w-0 border border-gray-600 p-2 rounded-lg text-sm bg-black/40 outline-none focus:border-pub-gold text-white placeholder:text-gray-500 font-medium transition" 
        required 
      />
      <button className="bg-pub-gold text-black px-4 py-2 rounded-lg font-bold hover:bg-white transition border border-pub-gold whitespace-nowrap">+</button>
    </form>
  );
}
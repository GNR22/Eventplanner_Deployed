import { prisma } from "@acme/database";
import { createEvent, deleteEvent } from "./actions";

export default async function HomePage() {
  const allEvents = await prisma.event.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">My Space Project</h1>

      {/* CREATE FORM */}
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4 text-black">Create New Event</h2>
        <form action={createEvent} className="flex gap-4">
          <input
            name="name"
            type="text"
            placeholder="Event Name"
            className="border p-2 rounded flex-1 text-black"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">
            Create
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="grid gap-4">
        {allEvents.map((event) => (
          <div key={event.id} className="border p-4 rounded flex justify-between bg-white">
            <h3 className="font-bold text-lg text-black">{event.name}</h3>
            <form action={deleteEvent}>
              <input type="hidden" name="id" value={event.id} />
              <button className="text-red-500 font-bold">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}
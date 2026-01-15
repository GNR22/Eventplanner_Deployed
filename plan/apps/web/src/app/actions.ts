'use server';

import { prisma } from "@acme/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { searchSpotify } from "@/utils/spotify";
import { getServerAuthSession } from "@/lib/auth"; 
import bcrypt from "bcryptjs";

// --- CORE EVENT ACTIONS ---
export async function createEvent(formData: FormData) {
  const session = await getServerAuthSession();
  // @ts-ignore
  if (!session || !session.user?.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const budget = parseFloat(formData.get("budget") as string) || 0;
  const dateStr = formData.get("date") as string;
  const eventDate = dateStr ? new Date(dateStr) : null;

  if (!name) return;

  const newEvent = await prisma.event.create({
    data: {
      name,
      budgetLimit: budget,
      date: eventDate,
      // @ts-ignore
      ownerId: session.user.id,
      status: "PLANNING"
    },
  });
  revalidatePath("/");
  redirect(`/events/${newEvent.id}`);
}

export async function finalizeEvent(formData: FormData) {
  const eventId = parseInt(formData.get("eventId") as string);
  await prisma.event.update({
      where: { id: eventId },
      data: { status: "DONE" }
  });
  redirect(`/events/${eventId}/summary`);
}

export async function deleteEvent(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  await prisma.event.delete({ where: { id } });
  revalidatePath("/");
}

// --- SUB-ITEM ACTIONS ---
export async function addGuest(formData: FormData) {
  const eventId = parseInt(formData.get("eventId") as string);
  const name = formData.get("name") as string;
  await prisma.guest.create({ data: { name, eventId } });
  revalidatePath(`/events/${eventId}`);
}

export async function assignSeat(eventId: number, guestId: number, seatNumber: string) {
  await prisma.guest.update({
      where: { id: guestId },
      data: { seatNumber }
  });
  revalidatePath(`/events/${eventId}`);
}

export async function addTask(formData: FormData) {
  const eventId = parseInt(formData.get("eventId") as string);
  const title = formData.get("title") as string;
  await prisma.task.create({ data: { title, eventId } });
  revalidatePath(`/events/${eventId}`);
}

export async function toggleTask(formData: FormData) {
    const id = parseInt(formData.get("id") as string);
    const eventId = parseInt(formData.get("eventId") as string);
    const isDone = formData.get("isDone") === "true"; 
    await prisma.task.update({ where: { id }, data: { isDone: !isDone } });
    revalidatePath(`/events/${eventId}`);
}

export async function addExpense(formData: FormData) {
  const eventId = parseInt(formData.get("eventId") as string);
  const item = formData.get("item") as string;
  const cost = parseFloat(formData.get("cost") as string);
  await prisma.expense.create({ data: { item, cost, eventId } });
  revalidatePath(`/events/${eventId}`);
}

// --- SPOTIFY ACTIONS ---
export async function findTracks(query: string) {
  if (!query) return [];
  const data = await searchSpotify(query);
  return data.tracks?.items || []; 
}

export async function addTrackToEvent(formData: FormData) {
  const eventId = parseInt(formData.get("eventId") as string);
  const title = formData.get("title") as string;
  const artist = formData.get("artist") as string;
  const spotifyId = formData.get("spotifyId") as string;
  const albumArt = formData.get("albumArt") as string;
  await prisma.track.create({ data: { title, artist, spotifyId, albumArt, eventId } });
  revalidatePath(`/events/${eventId}`);
}

export async function deleteTrack(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const eventId = parseInt(formData.get("eventId") as string);
  await prisma.track.delete({ where: { id } });
  revalidatePath(`/events/${eventId}`);
}

// --- AUTH ACTIONS ---
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  if (!email || !password) throw new Error("Missing fields");

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return;

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, password: hashedPassword } });
  redirect("/api/auth/signin");
}
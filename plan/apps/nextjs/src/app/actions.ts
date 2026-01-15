'use server';

import { prisma } from "@acme/database";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) return;

  await prisma.event.create({
    data: {
      name: name,
      ownerId: "demo-user",
    },
  });

  revalidatePath("/");
}

export async function deleteEvent(formData: FormData) {
  const id = parseInt(formData.get("id") as string);

  await prisma.event.delete({
    where: { id },
  });

  revalidatePath("/");
}
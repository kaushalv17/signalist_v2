'use server';

import { connectToDatabase } from '@/database/mongoose';

// Used by Inngest daily digest to iterate over all registered users
export async function getAllUsersForNewsEmail(): Promise<
  { id: string; email: string; name: string }[]
> {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('[user.actions] DB not connected');

    const docs = await db
      .collection('user')
      .find(
        { email: { $exists: true, $ne: null } },
        { projection: { id: 1, _id: 1, email: 1, name: 1 } }
      )
      .toArray();

    return docs
      .filter((u) => u.email && u.name)
      .map((u) => ({
        id:    String(u.id ?? u._id),
        email: String(u.email),
        name:  String(u.name),
      }));
  } catch (err) {
    console.error('[getAllUsersForNewsEmail]', err);
    return [];
  }
}

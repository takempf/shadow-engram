// db/seed.ts
import { db, Contact } from "astro:db";

export default async function seed() {
  await db.insert(Contact).values([
    { name: "John Doe", email: "john.doe@example.com", phone: "123-456-7890" },
    { name: "Jane Smith", email: "jane.smith@example.com" },
  ]);
}

// db/seed.ts
import { db, Contact } from "astro:db";
import slugify from 'slugify';

export default async function seed() {
  await db.insert(Contact).values([
    {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      slug: slugify("John Doe", { lower: true, strict: true })
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      slug: slugify("Jane Smith", { lower: true, strict: true })
    },
  ]);
}

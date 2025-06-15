// db/seed.ts
import { db, Contact } from "astro:db";

import { slugifyName } from "../src/utils/slugUtils";

export default async function seed() {
  await db.insert(Contact).values([
    {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      slug: slugifyName("John Doe"),
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      slug: slugifyName("Jane Smith"),
    },
  ]);
}

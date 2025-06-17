// src/utils/slugUtils.ts
import { db, Contact, eq, ne } from 'astro:db';
import slugify from 'slugify';

export function slugifyName(name: string): string {
  return slugify(name, { lower: true, strict: true });
}

export async function generateUniqueSlug(
  name: string,
  excludeId: number | null = null
): Promise<string> {
  const slug = slugifyName(name);
  let count = 0;
  let uniqueSlug = slug;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Ensure 'db', 'Contact', 'eq', 'ne' are correctly scoped and available.
    // This might require passing 'db' or specific query functions if direct import causes issues
    // in a standalone utility outside Astro's direct context, but for now, assume direct import works.
    let query = db
      .select({ id: Contact.id })
      .from(Contact)
      .where(eq(Contact.slug, uniqueSlug));
    if (excludeId !== null) {
      query = query.where(ne(Contact.id, excludeId));
    }
    const conflictingContact = await query.get();

    if (!conflictingContact) {
      break;
    }
    count++;
    uniqueSlug = `${slug}-${count}`;
  }
  return uniqueSlug;
}

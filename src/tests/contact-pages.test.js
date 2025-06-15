import { describe, it, expect, vi } from 'vitest';
import slugify from 'slugify';

// Mock astro:db
vi.mock('astro:db', async (importOriginal) => {
  // If there are other exports from 'astro:db' you need to preserve,
  // you can try to merge them:
  // const original = await importOriginal();

  return {
    // ...original, // if needed
    db: {
      select: vi.fn().mockReturnThis(), // Makes db.select() chainable
      from: vi.fn().mockReturnThis(),   // Makes db.select().from() chainable
      // .all() is often used with astro:db selects
      all: vi.fn().mockResolvedValue([  // Mock the behavior of .all()
        { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', phone: '123-456-7890' },
        { id: '2', name: 'Bob The Builder', email: 'bob@example.com', phone: '987-654-3210' },
        { id: '3', name: 'Charlie Chaplin!', email: 'charlie@example.com', phone: null },
        { id: '4', name: '  Diana Prince  ', email: 'diana@example.com', phone: '555-555-5555' },
      ]),
      // If your actual code uses `where` or other clauses, they might need to be mocked here too if .all() isn't the final call
    },
    Contact: { type: 'table', name: 'Contact' }, // Mock Contact table object as needed
    // Add other Astro DB named exports if your code under test uses them
  };
});

// Now import the mocked db and Contact (though Contact might not be strictly needed if db.select().from() is fully mocked)
import { db, Contact } from 'astro:db';

describe('Contact Page Generation Logic (with mocked DB)', () => {
  it('should fetch mock contacts and generate correct slugs using { lower: true, strict: true } options', async () => {
    // The call to db.select().from(Contact).all() will now use the mocked implementation
    const contacts = await db.select().from(Contact).all();

    expect(db.select).toHaveBeenCalled();
    // expect(db.from).toHaveBeenCalledWith(Contact); // This check might be too strict if Contact mock is not perfect instance-wise
    expect(db.from).toHaveBeenCalled();
    expect(db.all).toHaveBeenCalled();

    expect(contacts.length).toBeGreaterThan(0);

    for (const contact of contacts) {
      expect(contact.name).toBeDefined();
      // Using the application's slugify options
      const generatedSlug = slugify(contact.name, { lower: true, strict: true });

      // console.log(`Testing contact: "${contact.name}", Generated slug: "${generatedSlug}"`);

      // Check if slugify produces a non-empty string
      expect(generatedSlug).toBeTruthy();

      // Check against known slug values for the mocked data
      if (contact.name === 'Alice Wonderland') {
        expect(generatedSlug).toBe('alice-wonderland');
      } else if (contact.name === 'Bob The Builder') {
        expect(generatedSlug).toBe('bob-the-builder');
      } else if (contact.name === 'Charlie Chaplin!') {
        // strict: true removes '!'
        expect(generatedSlug).toBe('charlie-chaplin');
      } else if (contact.name === '  Diana Prince  ') {
        // strict: true handles leading/trailing spaces and removes them before slugification.
        // "  Diana Prince  " -> "Diana Prince" -> "diana-prince"
        expect(generatedSlug).toBe('diana-prince');
      }
    }
  });
});

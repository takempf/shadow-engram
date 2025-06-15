import { describe, it, expect, vi } from 'vitest';
// Vitest will use the alias in vitest.config.ts to resolve 'astro:db' to src/tests/mocks/astro-db.js
import { db, Contact } from 'astro:db';

// We need access to the raw mock data to compare against
// This is a bit of a hack; ideally the mock module would export it,
// or we'd duplicate it here. For now, let's redefine it for clarity in the test.
const mockContactsForCheck = [
  { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', phone: '123-456-7890', slug: 'alice-wonderland' },
  { id: '2', name: 'Bob The Builder', email: 'bob@example.com', phone: '987-654-3210', slug: 'bob-the-builder' },
  { id: '3', name: 'Charlie Chaplin!', email: 'charlie@example.com', phone: null, slug: 'charlie-chaplin' },
  { id: '4', name: '  Diana Prince  ', email: 'diana@example.com', phone: '555-555-5555', slug: 'diana-prince' },
  { id: '5', name: 'Alice Wonderland Twin', email: 'alice.twin@example.com', phone: '111-222-3333', slug: 'alice-wonderland-twin' }
];

describe('Contact Page Generation Logic (using global mock for astro:db)', () => {

  it('getStaticPaths (simulated) should use stored slugs from contacts', async () => {
    // This uses the globally mocked db from src/tests/mocks/astro-db.js via vitest.config.ts alias
    const contactsFromDbMock = await db.select().from(Contact).all();

    // Simulate the .map() operation from getStaticPaths
    const paths = contactsFromDbMock.map(contact => {
      // The actual [slug].astro getStaticPaths has a check for !contact.slug
      if (!contact.slug) {
        // This case should ideally not happen if all mock data has slugs
        console.warn(`Mocked contact with ID ${contact.id} is missing a slug.`);
        return null;
      }
      return {
        params: { slug: contact.slug }, // Directly use slug from mocked contact
        props: { contact },
      };
    }).filter(path => path !== null);


    expect(paths.length).toBe(mockContactsForCheck.length);

    for (let i = 0; i < paths.length; i++) {
      const pathItem = paths[i];
      const correspondingMockContact = mockContactsForCheck.find(c => c.id === pathItem.props.contact.id);

      expect(pathItem.params.slug).toBe(correspondingMockContact.slug);
      expect(pathItem.props.contact.name).toBe(correspondingMockContact.name);
      // Verify that all parts of the contact are passed as props
      expect(pathItem.props.contact).toEqual(correspondingMockContact);
    }
  });
});

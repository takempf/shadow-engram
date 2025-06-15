// src/tests/slugUtils.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateUniqueSlug } from '../utils/slugUtils'; // Path to the new util

// This will store our mock contacts for each test scenario
const mockDbContacts = [];

vi.mock('astro:db', () => {
  // This is the factory function for the mock.
  // It needs to return an object that has all the exports of 'astro:db' that slugUtils.ts uses.
  const actualDbFunctions = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn(function(condition) {
      // 'this' refers to the object returned by from() or a previous where().
      // Store the condition for 'get' to use.
      this.currentQueryConditions = this.currentQueryConditions || [];
      this.currentQueryConditions.push(condition);
      return this;
    }),
    get: vi.fn(function() {
      // Simulate .get() based on the conditions stored by .where() calls
      let results = [...mockDbContacts]; // Start with all mock contacts

      if (this.currentQueryConditions) {
        this.currentQueryConditions.forEach(cond => {
          if (cond.type === 'eq') {
            results = results.filter(contact => contact[cond.fieldKey] === cond.value);
          } else if (cond.type === 'ne') {
            results = results.filter(contact => contact[cond.fieldKey] !== cond.value);
          }
        });
      }

      // .get() should return a single object or undefined
      const result = results.length > 0 ? results[0] : undefined;
      // Clear conditions for the next independent chain of query
      this.currentQueryConditions = [];
      return Promise.resolve(result);
    }),
  };

  return {
    db: actualDbFunctions,
    Contact: {
      type: 'table',
      name: 'Contact',
      slug: 'Contact.slug', // Using string keys for field access in mock
      id: 'Contact.id'
    },
    eq: vi.fn((field, value) => ({ type: 'eq', fieldKey: field.toString().split('.')[1], value })),
    ne: vi.fn((field, value) => ({ type: 'ne', fieldKey: field.toString().split('.')[1], value })),
  };
});


describe('generateUniqueSlug', () => {
  beforeEach(() => {
    // Reset mocks and the in-memory database before each test
    vi.clearAllMocks(); // Clears call counts, etc.
    mockDbContacts.length = 0; // Empties the array

    // Reset the state of the chained mocks on 'db' object if necessary.
    // The mock above is designed to reset queryConditions on each .get(),
    // and vi.clearAllMocks() should reset call history for db.select etc.
  });

  it('should return the original slug if it is unique', async () => {
    const slug = await generateUniqueSlug('New Contact');
    expect(slug).toBe('new-contact');
    // Check that db.select().from().where().get() was called once for the initial slug check
    expect(db.select().from().where().get).toHaveBeenCalledTimes(1);
  });

  it('should append -1 if original slug exists once', async () => {
    mockDbContacts.push({ id: 1, name: 'Existing', slug: 'existing-contact' });
    const slug = await generateUniqueSlug('Existing Contact');
    expect(slug).toBe('existing-contact-1');
    // Initial check for 'existing-contact', then check for 'existing-contact-1'
    expect(db.select().from().where().get).toHaveBeenCalledTimes(2);
  });

  it('should increment number if multiple slugs exist', async () => {
    mockDbContacts.push({ id: 1, name: 'Test', slug: 'test' });
    mockDbContacts.push({ id: 2, name: 'Test 1', slug: 'test-1' });
    const slug = await generateUniqueSlug('Test');
    expect(slug).toBe('test-2');
    // test (exists) -> test-1 (exists) -> test-2 (unique)
    expect(db.select().from().where().get).toHaveBeenCalledTimes(3);
  });

  it('should not conflict with its own slug when excludeId is provided and name is unchanged', async () => {
    mockDbContacts.push({ id: 1, name: 'My Contact', slug: 'my-contact' });
    // Simulating editing contact '1' but keeping its name the same
    const slug = await generateUniqueSlug('My Contact', 1);
    expect(slug).toBe('my-contact');
    // Initial check for 'my-contact' (excluding id 1). Should not find a conflict.
    expect(db.select().from().where().get).toHaveBeenCalledTimes(1);
  });

  it('should generate a new numbered slug if name changes to an existing slug (even if that slug belongs to another contact)', async () => {
    mockDbContacts.push({ id: 1, name: 'Original Name', slug: 'original-name' });
    mockDbContacts.push({ id: 2, name: 'Other Contact', slug: 'new-name-target' }); // This slug exists for contact 2

    // Contact 1 is being edited, and its name changes to "New Name Target"
    const slug = await generateUniqueSlug('New Name Target', 1);
    // 'new-name-target' exists (for id 2), so it should become 'new-name-target-1'
    expect(slug).toBe('new-name-target-1');
    // Check for 'new-name-target' (excluding id 1) - finds contact 2.
    // Check for 'new-name-target-1' (excluding id 1) - finds nothing.
    expect(db.select().from().where().get).toHaveBeenCalledTimes(2);
  });

   it('should correctly generate a unique slug when the base slug exists multiple times for other contacts', async () => {
    mockDbContacts.push({ id: 2, name: 'User Two', slug: 'another-user' });
    mockDbContacts.push({ id: 3, name: 'User Three', slug: 'another-user-1' });
    // Trying to create/update a contact (id 1) to have the name "Another User"
    const slug = await generateUniqueSlug('Another User', 1);
    expect(slug).toBe('another-user-2');
    expect(db.select().from().where().get).toHaveBeenCalledTimes(3); // another-user, another-user-1, another-user-2
  });

  it('should handle empty string name gracefully', async () => {
    // slugify('') is ''
    const slug = await generateUniqueSlug('');
    expect(slug).toBe(''); // or perhaps 'n-a' or some default if slugify('') is empty
     mockDbContacts.push({ id: 1, name: 'Empty Slug Test', slug: '' });
    const slug2 = await generateUniqueSlug('');
    expect(slug2).toBe('-1'); // slugify('') is '', so it becomes '-1'
  });
});

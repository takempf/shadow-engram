// src/tests/mocks/astro-db.js
import { vi } from 'vitest';

const mockContactsData = [
  { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', phone: '123-456-7890', slug: 'alice-wonderland' },
  { id: '2', name: 'Bob The Builder', email: 'bob@example.com', phone: '987-654-3210', slug: 'bob-the-builder' },
  { id: '3', name: 'Charlie Chaplin!', email: 'charlie@example.com', phone: null, slug: 'charlie-chaplin' },
  { id: '4', name: '  Diana Prince  ', email: 'diana@example.com', phone: '555-555-5555', slug: 'diana-prince' },
  { id: '5', name: 'Alice Wonderland Twin', email: 'alice.twin@example.com', phone: '111-222-3333', slug: 'alice-wonderland-twin' }
];

// Store the last 'where' condition for .get() to simulate filtering
let lastWhereCondition = null;
let lastNeId = null; // For simulating ne(Contact.id, excludeId)

export const db = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  all: vi.fn().mockResolvedValue(mockContactsData),
  // Mock for .where(eq(Contact.slug, uniqueSlug)) or .where(eq(Contact.id, contactId))
  where: vi.fn(function(condition) {
    lastWhereCondition = condition;
    // If there was a NE condition chained before for the same query object, clear it
    // This is a simplification; real chaining is more complex to mock.
    // For generateUniqueSlug, `ne` is chained *after* `eq`.
    // For other uses (like `select().from().where(eq(id,...))`), `ne` is not used.
    if (condition && condition.type === 'eq') { // Reset NE if EQ is primary
        lastNeId = null;
    }
    if (condition && condition.type === 'ne') { // Capture NE id
        lastNeId = condition.value;
    }
    return this;
  }),
  get: vi.fn(() => {
    if (!lastWhereCondition) {
      return Promise.resolve(undefined);
    }

    const { field, value } = lastWhereCondition; // field is a string like 'Contact.slug' or 'Contact.id'
    const fieldName = field.includes('.') ? field.split('.')[1] : field;

    let result = mockContactsData.find(contact => {
        // Check primary EQ condition
        let matchesEq = contact[fieldName] === value;
        if (!matchesEq) return false;

        // Check NE condition if it was set on this query chain
        if (lastNeId !== null) {
            return contact.id !== lastNeId;
        }
        return true;
    });

    // Reset conditions for next independent .get() call if needed, though Vitest's clearAllMocks is better
    // lastWhereCondition = null;
    // lastNeId = null;
    return Promise.resolve(result);
  }),
};

export const Contact = { type: 'table', name: 'Contact' };

// Mock implementations for eq and ne that are compatible with the where mock
export const eq = vi.fn((field, value) => ({ type: 'eq', field: String(field), value }));
export const ne = vi.fn((field, value) => ({ type: 'ne', field: String(field), value }));

// src/tests/mocks/astro-db.js
import { vi } from 'vitest';

export const db = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  all: vi.fn().mockResolvedValue([
    { id: '1', name: 'Alice Wonderland', email: 'alice@example.com', phone: '123-456-7890' },
    { id: '2', name: 'Bob The Builder', email: 'bob@example.com', phone: '987-654-3210' },
    { id: '3', name: 'Charlie Chaplin!', email: 'charlie@example.com', phone: null },
    { id: '4', name: '  Diana Prince  ', email: 'diana@example.com', phone: '555-555-5555' },
  ]),
};

export const Contact = { type: 'table', name: 'Contact' };

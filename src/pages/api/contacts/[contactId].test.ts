import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { db, Contact, Names, EmailAddresses, seed, eq } from 'astro:db'; // Using mock astro:db
import { GET } from './[contactId]'; // Adjust path if your test file is elsewhere

// Helper function to simulate an Astro API request
const mockAPIRouteRequest = (method: string, params?: Record<string, string>, body?: any) => {
  return {
    request: new Request(`http://localhost/api/contacts/${params?.contactId || ''}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    }),
    params: params || {},
    url: new URL(`http://localhost/api/contacts/${params?.contactId || ''}`),
  } as any; // Cast to any to satisfy Astro's APIRoute context
};

describe('API Route: /api/contacts/[contactId]', () => {
  let seededContact: Awaited<ReturnType<typeof db.select>>[0];
  let seededName: Awaited<ReturnType<typeof db.select>>[0];
  let seededEmail: Awaited<ReturnType<typeof db.select>>[0];

  beforeAll(async () => {
    // Clear existing data and seed new data
    // Note: The mock 'astro:db' needs to support these operations.
    // This seed function is from astro:db, assuming it works with the mock.
    // If not, we'll need to manually use `db.insert` and `db.delete`.
    // await seed(); // If seed.ts populates what we need. Or:

    // Clear relevant tables. Order matters due to potential foreign key constraints.
    // This depends on how your mock astro:db handles deletions.
    // For simplicity, assuming mock allows direct deletion or tables are fresh.
    await db.delete(Names);
    await db.delete(EmailAddresses);
    await db.delete(Contact);

    // Seed a contact
    const contactResult = await db.insert(Contact).values([
      { FirstName: 'Test', LastName: 'User', slug: 'test-user-api', OwnerId: 1, TenantId: 'test-tenant' }
    ]).returning();
    seededContact = contactResult[0];

    // Seed related data
    const nameResult = await db.insert(Names).values([
      { contactId: seededContact.id, name: 'primary', value: 'Test User Primary' }
    ]).returning();
    seededName = nameResult[0];

    const emailResult = await db.insert(EmailAddresses).values([
      { contactId: seededContact.id, name: 'work', value: 'testuser-api@example.com' }
    ]).returning();
    seededEmail = emailResult[0];
  });

  afterAll(async () => {
    // Clean up seeded data
    await db.delete(Names).where(eq(Names.contactId, seededContact.id));
    await db.delete(EmailAddresses).where(eq(EmailAddresses.contactId, seededContact.id));
    await db.delete(Contact).where(eq(Contact.id, seededContact.id));
  });

  describe('GET /api/contacts/[contactId]', () => {
    it('should return 200 and the contact data if found', async () => {
      const context = mockAPIRouteRequest('GET', { contactId: String(seededContact.id) });
      const response = await GET(context);

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.id).toBe(seededContact.id);
      expect(data.FirstName).toBe('Test');
      expect(data.Names).toBeInstanceOf(Array);
      expect(data.Names.length).toBeGreaterThan(0);
      expect(data.Names[0].value).toBe('Test User Primary');
      expect(data.EmailAddresses).toBeInstanceOf(Array);
      expect(data.EmailAddresses.length).toBeGreaterThan(0);
      expect(data.EmailAddresses[0].value).toBe('testuser-api@example.com');
    });

    it('should return 404 if contact not found', async () => {
      const nonExistentId = seededContact.id + 999; // An ID that likely doesn't exist
      const context = mockAPIRouteRequest('GET', { contactId: String(nonExistentId) });
      const response = await GET(context);

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.message).toContain('not found');
    });

    it('should return 400 if contactId is not a number', async () => {
      const context = mockAPIRouteRequest('GET', { contactId: 'not-a-number' });
      const response = await GET(context);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toContain('Invalid Contact ID format');
    });
  });
});

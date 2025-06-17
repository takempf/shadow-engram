import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { db, Contact, Names, EmailAddresses, seed, eq, and } from 'astro:db'; // Using mock astro:db
import { PATCH } from './data'; // Assuming PATCH is exported from data.ts

// Helper function to simulate an Astro API request for PATCH
const mockPatchRequest = (body: any, params?: Record<string, string>) => {
  return {
    request: new Request('http://localhost/api/contacts/data', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    params: params || {},
    url: new URL('http://localhost/api/contacts/data'),
  } as any; // Cast to any to satisfy Astro's APIRoute context
};

describe('API Route: /api/contacts/data', () => {
  let seededContact: Awaited<ReturnType<typeof db.select>>[0];
  let seededName: Awaited<ReturnType<typeof db.select>>[0];

  beforeAll(async () => {
    // Clear and seed
    await db.delete(Names);
    await db.delete(Contact);

    const contactResult = await db.insert(Contact).values([
      { FirstName: 'Patch', LastName: 'TestUser', slug: 'patch-test-user', OwnerId: 1, TenantId: 'test-tenant' }
    ]).returning();
    seededContact = contactResult[0];

    const nameResult = await db.insert(Names).values([
      { contactId: seededContact.id, name: 'primary', value: 'Original Name Value' }
    ]).returning();
    seededName = nameResult[0];
  });

  afterAll(async () => {
    // Clean up
    await db.delete(Names).where(eq(Names.contactId, seededContact.id));
    await db.delete(Contact).where(eq(Contact.id, seededContact.id));
  });

  describe('PATCH /api/contacts/data', () => {
    it('should update a field successfully and return 200', async () => {
      const newNameValue = 'Updated Name Value';
      const requestBody = {
        contactId: seededContact.id,
        dataType: 'Names', // Corresponds to tableMap key in data.ts
        dataId: seededName.id,
        field: 'value',
        newValue: newNameValue,
      };
      const context = mockPatchRequest(requestBody);
      const response = await PATCH(context);

      expect(response.status).toBe(200);
      const responseData = await response.json();
      expect(responseData.message).toBe('Update successful');

      // Verify in DB (mock)
      const updatedNameRecord = await db.select().from(Names).where(eq(Names.id, seededName.id)).get();
      expect(updatedNameRecord).toBeDefined();
      expect(updatedNameRecord!.value).toBe(newNameValue);
      // Also check updatedAt if your mock DB handles it.
      // expect(updatedNameRecord!.updatedAt).not.toBe(seededName.updatedAt);
    });

    it('should update a field on the Contact table successfully', async () => {
        const newFirstName = 'PatchedFirstName';
        const requestBody = {
            contactId: seededContact.id,
            dataType: 'Contact',
            // dataId could be contactId itself, or not strictly needed if API implies contactId is PK
            dataId: seededContact.id,
            field: 'FirstName',
            newValue: newFirstName,
        };
        const context = mockPatchRequest(requestBody);
        const response = await PATCH(context);

        expect(response.status).toBe(200);
        const responseData = await response.json();
        expect(responseData.message).toBe('Update successful');

        const updatedContactRecord = await db.select().from(Contact).where(eq(Contact.id, seededContact.id)).get();
        expect(updatedContactRecord).toBeDefined();
        expect(updatedContactRecord!.FirstName).toBe(newFirstName);
    });


    it('should return 400 if required fields are missing', async () => {
      const requestBody = {
        contactId: seededContact.id,
        // Missing dataType, dataId, field, newValue
      };
      const context = mockPatchRequest(requestBody);
      const response = await PATCH(context);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toContain('Missing required fields');
    });

    it('should return 400 for invalid dataType', async () => {
      const requestBody = {
        contactId: seededContact.id,
        dataType: 'InvalidTable',
        dataId: seededName.id,
        field: 'value',
        newValue: 'test',
      };
      const context = mockPatchRequest(requestBody);
      const response = await PATCH(context);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toContain('Invalid dataType');
    });

    it('should return 404 if record to update is not found', async () => {
        const nonExistentDataId = seededName.id + 999;
        const requestBody = {
            contactId: seededContact.id,
            dataType: 'Names',
            dataId: nonExistentDataId,
            field: 'value',
            newValue: 'No one will see this',
        };
        const context = mockPatchRequest(requestBody);
        const response = await PATCH(context);
        expect(response.status).toBe(404); // Assuming update of non-existent returns 404
        const data = await response.json();
        expect(data.message).toContain('Record not found');
    });

    it('should return 400 if dataId is missing for non-Contact dataType', async () => {
      const requestBody = {
        contactId: seededContact.id,
        dataType: 'Names', // This type requires dataId
        // dataId is missing
        field: 'value',
        newValue: 'some value',
      };
      const context = mockPatchRequest(requestBody);
      const response = await PATCH(context);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.message).toContain('dataId is mandatory for this dataType');
    });


    // Add more tests:
    // - Updating a field that is not allowed (if field validation was implemented)
    // - Incorrect contactId for a dataId (should result in 0 rows affected -> 404)
    // - Test with other dataTypes (EmailAddresses, etc.)
  });
});

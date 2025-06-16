import { describe, it, expect, vi, beforeEach } from "vitest";
// Import the mock db and all mock table schemas. This will use the mock from vitest.config.ts alias.
import {
  db,
  Contact,
  Names,
  EmailAddresses,
  PhoneNumbers,
  Addresses,
  Jobs,
  GithubProfiles,
  GameAccounts,
  StravaAccounts,
  Notes,
  eq,
  and,
} from "astro:db";

// Import the raw mock data directly to verify against.
// Path is relative from this test file (src/pages/contacts/) to src/mocks/
import {
  mockContacts,
  mockNames as allMockNames,
  mockEmailAddresses as allMockEmails,
  mockPhoneNumbers as allMockPhones,
  mockAddresses as allMockAddresses,
  mockJobs as allMockJobs,
  mockGithubProfiles as allMockGithubs,
  mockGameAccounts as allMockGames,
  mockStravaAccounts as allMockStravas,
  mockNotes as allMockNotes,
} from "../../mocks/astro-db.js";

describe("Contact Page ([slug].astro) - getStaticPaths", () => {
  it("should generate correct paths with slugs from mock Contacts", async () => {
    // The mock db is automatically used due to Vitest alias.
    const contactsFromDbMock = await db
      .select({ slug: Contact.slug })
      .from(Contact)
      .all();

    const paths = contactsFromDbMock
      .map((c) => {
        if (!c.slug) {
          console.warn(
            `Mocked contact is missing a slug. This shouldn't happen in test data.`
          );
          return null;
        }
        return {
          params: { slug: c.slug },
          props: { slug: c.slug }, // getStaticPaths now only passes the slug
        };
      })
      .filter((path) => path !== null);

    expect(paths.length).toBe(mockContacts.length);

    for (const pathItem of paths) {
      const correspondingMockContact = mockContacts.find(
        (mc) => mc.slug === pathItem.params.slug
      );
      expect(correspondingMockContact).toBeDefined(); // Ensure a match was found
      expect(pathItem.params.slug).toBe(correspondingMockContact.slug);
      expect(pathItem.props.slug).toBe(correspondingMockContact.slug);
    }
  });
});

describe("Contact Page ([slug].astro) - Page Data Logic", () => {
  // Test data fetching for the first mock contact ('timothy-kempf')
  const testContactSlug = mockContacts[0].slug;
  let contactDataForPage; // This will hold the data prepared as if by the Astro page script

  beforeEach(async () => {
    // Simulate the data fetching that happens in [slug].astro's script section
    const contact = await db
      .select()
      .from(Contact)
      .where(eq(Contact.slug, testContactSlug))
      .get();
    if (!contact) {
      contactDataForPage = {
        contact: null,
        error: "Contact not found",
        slug: testContactSlug,
      };
      return;
    }

    const contactId = contact.id;
    const names = await db
      .select()
      .from(Names)
      .where(eq(Names.contactId, contactId))
      .all();
    const emailAddresses = await db
      .select()
      .from(EmailAddresses)
      .where(eq(EmailAddresses.contactId, contactId))
      .all();
    const phoneNumbers = await db
      .select()
      .from(PhoneNumbers)
      .where(eq(PhoneNumbers.contactId, contactId))
      .all();
    const addresses = await db
      .select()
      .from(Addresses)
      .where(eq(Addresses.contactId, contactId))
      .all();
    const jobs = await db
      .select()
      .from(Jobs)
      .where(eq(Jobs.contactId, contactId))
      .all();
    const githubProfiles = await db
      .select()
      .from(GithubProfiles)
      .where(eq(GithubProfiles.contactId, contactId))
      .all();
    const gameAccounts = await db
      .select()
      .from(GameAccounts)
      .where(eq(GameAccounts.contactId, contactId))
      .all();
    const stravaAccounts = await db
      .select()
      .from(StravaAccounts)
      .where(eq(StravaAccounts.contactId, contactId))
      .all();
    // Note: The page uses orderBy(Notes.createdAt). The mock db's orderBy is simplified but should handle this.
    const notes = await db
      .select()
      .from(Notes)
      .where(eq(Notes.contactId, contactId))
      .orderBy(Notes.createdAt)
      .all();

    let displayName = contact.slug; // Default
    const primaryNameObj = names.find((n) => n.name === "primary");
    if (primaryNameObj) displayName = primaryNameObj.value;
    else if (names.length > 0) displayName = names[0].value; // Fallback as in page

    contactDataForPage = {
      contact,
      names,
      emailAddresses,
      phoneNumbers,
      addresses,
      jobs,
      githubProfiles,
      gameAccounts,
      stravaAccounts,
      notes,
      displayName,
      slug: testContactSlug,
    };
  });

  it("should fetch the main contact details correctly", () => {
    expect(contactDataForPage.contact).toBeDefined();
    expect(contactDataForPage.contact.slug).toBe(testContactSlug);
    const expectedContact = mockContacts.find(
      (c) => c.slug === testContactSlug
    );
    expect(contactDataForPage.contact.id).toBe(expectedContact.id);
  });

  it("should determine the correct displayName", () => {
    const expectedPrimaryName = allMockNames.find(
      (n) =>
        n.contactId === contactDataForPage.contact.id && n.name === "primary"
    );
    if (expectedPrimaryName) {
      expect(contactDataForPage.displayName).toBe(expectedPrimaryName.value);
    } else {
      // Fallback logic check if no primary name (though mock data has one)
      const firstAnyName = allMockNames.find(
        (n) => n.contactId === contactDataForPage.contact.id
      );
      expect(contactDataForPage.displayName).toBe(
        firstAnyName ? firstAnyName.value : testContactSlug
      );
    }
  });

  it("should fetch associated names", () => {
    const expectedNames = allMockNames.filter(
      (n) => n.contactId === contactDataForPage.contact.id
    );
    expect(contactDataForPage.names.length).toBe(expectedNames.length);
    contactDataForPage.names.forEach((name) => {
      expect(name.contactId).toBe(contactDataForPage.contact.id);
      expect(expectedNames.some((en) => en.id === name.id)).toBe(true);
    });
  });

  it("should fetch associated email addresses", () => {
    const expectedEmails = allMockEmails.filter(
      (e) => e.contactId === contactDataForPage.contact.id
    );
    expect(contactDataForPage.emailAddresses.length).toBe(
      expectedEmails.length
    );
    contactDataForPage.emailAddresses.forEach((email) => {
      expect(email.contactId).toBe(contactDataForPage.contact.id);
      expect(
        expectedEmails.some(
          (ee) => ee.id === email.id && ee.value === email.value
        )
      ).toBe(true);
    });
  });

  it("should fetch associated phone numbers", () => {
    const expectedPhones = allMockPhones.filter(
      (p) => p.contactId === contactDataForPage.contact.id
    );
    expect(contactDataForPage.phoneNumbers.length).toBe(expectedPhones.length);
  });

  it("should fetch addresses and the primary address value should be valid JSON", () => {
    const expectedAddresses = allMockAddresses.filter(
      (a) => a.contactId === contactDataForPage.contact.id
    );
    expect(contactDataForPage.addresses.length).toBe(expectedAddresses.length);
    const primaryAddress = contactDataForPage.addresses.find(
      (a) => a.name === "primary"
    );
    if (primaryAddress) {
      // Only proceed if primary address exists, which it does in mock
      expect(typeof primaryAddress.value).toBe("string");
      expect(() => JSON.parse(primaryAddress.value)).not.toThrow();
    } else {
      // If no primary address, this part of test might not apply or should assert absence
      const hasAnyAddress = contactDataForPage.addresses.length > 0;
      expect(hasAnyAddress && !primaryAddress).toBe(false); // Fail if addresses exist but no primary (adjust if non-primary addresses are valid for test)
    }
  });

  it("should fetch jobs", () => {
    const expectedJobs = allMockJobs.filter(
      (j) => j.contactId === contactDataForPage.contact.id
    );
    expect(contactDataForPage.jobs.length).toBe(expectedJobs.length);
  });

  it("should fetch GitHub profiles", () => {
    const expectedGithubs = allMockGithubs.filter(
      (g) => g.contactId === contactDataForPage.contact.id
    );
    expect(contactDataForPage.githubProfiles.length).toBe(
      expectedGithubs.length
    );
  });

  it("should fetch game accounts", () => {
    const expectedGames = allMockGames.filter(
      (g) => g.contactId === contactDataForPage.contact.id
    );
    expect(contactDataForPage.gameAccounts.length).toBe(expectedGames.length);
  });

  it("should fetch Strava accounts", () => {
    const expectedStravas = allMockStravas.filter(
      (s) => s.contactId === contactDataForPage.contact.id
    );
    expect(contactDataForPage.stravaAccounts.length).toBe(
      expectedStravas.length
    );
  });

  it("should fetch notes and respect orderBy createdAt", () => {
    const contactId = contactDataForPage.contact.id;
    // Re-create expected order from raw mock data
    const expectedNotes = allMockNotes
      .filter((n) => n.contactId === contactId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    expect(contactDataForPage.notes.length).toBe(expectedNotes.length);
    for (let i = 0; i < expectedNotes.length; i++) {
      expect(contactDataForPage.notes[i].id).toBe(expectedNotes[i].id);
      expect(contactDataForPage.notes[i].value).toBe(expectedNotes[i].value);
    }
  });
});

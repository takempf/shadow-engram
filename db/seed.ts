// db/seed.ts
import { db, Contact, Names, EmailAddresses, PhoneNumbers, Addresses, Jobs, GithubProfiles, GameAccounts, StravaAccounts, Notes, eq } from "astro:db";
import { slugifyName } from "../src/utils/slugUtils";

export default async function seed() {
  // 0. Set a consistent timestamp for all seed data
  const now = new Date();

  // 1. Clear Existing Data (in reverse order of dependency)
  await db.delete(Notes);
  await db.delete(StravaAccounts);
  await db.delete(GameAccounts);
  await db.delete(GithubProfiles);
  await db.delete(Jobs);
  await db.delete(Addresses);
  await db.delete(PhoneNumbers);
  await db.delete(EmailAddresses);
  await db.delete(Names);
  await db.delete(Contact); // Delete Contact last

  // 2. Seed Contact Table and Related Tables

  // === First Contact: Timothy Kempf ===
  const contact1Name = "Timothy Kempf";
  const contact1Slug = slugifyName(contact1Name);

  await db.insert(Contact).values({
    slug: contact1Slug,
    createdAt: now,
    updatedAt: now,
  });

  const timothy = await db.select().from(Contact).where(eq(Contact.slug, contact1Slug)).get();

  if (timothy) {
    // Names for Timothy
    await db.insert(Names).values([
      { contactId: timothy.id, name: 'givenName', value: 'Timothy', createdAt: now, updatedAt: now },
      { contactId: timothy.id, name: 'familyName', value: 'Kempf', createdAt: now, updatedAt: now },
      { contactId: timothy.id, name: 'primary', value: contact1Name, createdAt: now, updatedAt: now },
    ]);

    // EmailAddresses for Timothy
    await db.insert(EmailAddresses).values([
      { contactId: timothy.id, name: 'primary', value: 'tim@kempf.dev', createdAt: now, updatedAt: now },
      { contactId: timothy.id, name: 'secondary', value: 'another@example.com', createdAt: now, updatedAt: now },
    ]);

    // PhoneNumbers for Timothy
    await db.insert(PhoneNumbers).values([
      { contactId: timothy.id, name: 'primary', value: '8652553692', createdAt: now, updatedAt: now },
    ]);

    // Addresses for Timothy
    await db.insert(Addresses).values([
      { contactId: timothy.id, name: 'primary', value: JSON.stringify({ street: '123 Innovation Dr', city: 'Techville', zip: '98765', country: 'USA' }), createdAt: now, updatedAt: now },
    ]);

    // Jobs for Timothy
    await db.insert(Jobs).values([
      { contactId: timothy.id, name: 'primary', company: 'Meadow', role: 'Frontend Lead', linkedInUsername: 'takempf', createdAt: now, updatedAt: now },
    ]);

    // GithubProfiles for Timothy
    await db.insert(GithubProfiles).values([
      { contactId: timothy.id, name: 'primary', username: 'takempf', createdAt: now, updatedAt: now },
    ]);

    // GameAccounts for Timothy
    await db.insert(GameAccounts).values([
      { contactId: timothy.id, platform: 'steam', username: 'pantherxiii', createdAt: now, updatedAt: now },
      { contactId: timothy.id, platform: 'psn', username: 'pantherxiii_psn', createdAt: now, updatedAt: now },
    ]);

    // StravaAccounts for Timothy
    await db.insert(StravaAccounts).values([
      { contactId: timothy.id, name: 'primary', username: 'takempf', createdAt: now, updatedAt: now },
    ]);

    // Notes for Timothy
    await db.insert(Notes).values([
      { contactId: timothy.id, name: 'initial thoughts', value: 'This is a big ol note about the contact system.', createdAt: now, updatedAt: now },
    ]);
  } else {
    console.error("Failed to create contact: Timothy Kempf");
  }

  // === Second Contact: Alex Doe ===
  const contact2Name = "Alex Doe";
  const contact2Slug = slugifyName(contact2Name);

  await db.insert(Contact).values({
    slug: contact2Slug,
    createdAt: now,
    updatedAt: now,
  });

  const alex = await db.select().from(Contact).where(eq(Contact.slug, contact2Slug)).get();

  if (alex) {
    // Names for Alex
    await db.insert(Names).values([
      { contactId: alex.id, name: 'primary', value: contact2Name, createdAt: now, updatedAt: now },
    ]);

    // EmailAddresses for Alex
    await db.insert(EmailAddresses).values([
      { contactId: alex.id, name: 'primary', value: 'alex@example.com', createdAt: now, updatedAt: now },
    ]);

    // PhoneNumbers for Alex (Optional)
    await db.insert(PhoneNumbers).values([
      { contactId: alex.id, name: 'primary', value: '555-123-4567', createdAt: now, updatedAt: now },
    ]);

    // Example of adding a note for Alex
    await db.insert(Notes).values([
      { contactId: alex.id, name: 'Follow up', value: 'Remember to discuss project details.', createdAt: now, updatedAt: now },
    ]);

  } else {
    console.error("Failed to create contact: Alex Doe");
  }

  console.log("Database seeded successfully!");
}

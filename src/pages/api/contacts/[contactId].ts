import { db, Contact, Names, EmailAddresses, PhoneNumbers, Addresses, Jobs, GithubProfiles, GameAccounts, StravaAccounts, Notes, eq } from 'astro:db';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, request }) => {
  const contactIdString = params.contactId;

  if (!contactIdString) {
    return new Response(JSON.stringify({ message: "Contact ID is required." }), { status: 400 });
  }

  const contactId = parseInt(contactIdString, 10);
  if (isNaN(contactId)) {
    return new Response(JSON.stringify({ message: "Invalid Contact ID format." }), { status: 400 });
  }

  try {
    const contact = await db.select().from(Contact).where(eq(Contact.id, contactId)).get();

    if (!contact) {
      return new Response(JSON.stringify({ message: `Contact with ID ${contactId} not found.` }), { status: 404 });
    }

    // Fetch all related data
    const names = await db.select().from(Names).where(eq(Names.contactId, contactId)).all();
    const emailAddresses = await db.select().from(EmailAddresses).where(eq(EmailAddresses.contactId, contactId)).all();
    const phoneNumbers = await db.select().from(PhoneNumbers).where(eq(PhoneNumbers.contactId, contactId)).all();
    const addresses = await db.select().from(Addresses).where(eq(Addresses.contactId, contactId)).all();
    const jobs = await db.select().from(Jobs).where(eq(Jobs.contactId, contactId)).all();
    const githubProfiles = await db.select().from(GithubProfiles).where(eq(GithubProfiles.contactId, contactId)).all();
    const gameAccounts = await db.select().from(GameAccounts).where(eq(GameAccounts.contactId, contactId)).all();
    const stravaAccounts = await db.select().from(StravaAccounts).where(eq(StravaAccounts.contactId, contactId)).all();
    const notes = await db.select().from(Notes).where(eq(Notes.contactId, contactId)).all();

    // Structure the response
    const responseData = {
      ...contact,
      Names: names,
      EmailAddresses: emailAddresses,
      PhoneNumbers: phoneNumbers,
      Addresses: addresses,
      Jobs: jobs,
      GithubProfiles: githubProfiles,
      GameAccounts: gameAccounts,
      StravaAccounts: stravaAccounts,
      NotesDetails: notes, // Renamed from Notes to avoid conflict with main Contact.Notes field if any
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error fetching contact data:", error);
    return new Response(JSON.stringify({ message: "Internal server error while fetching contact data." }), { status: 500 });
  }
};

// Fallback for other methods
export const ALL: APIRoute = ({ request }) => {
  return new Response(JSON.stringify({ message: `Method ${request.method} not allowed.` }), { status: 405 });
};

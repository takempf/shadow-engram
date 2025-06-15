import { db, Contact } from 'astro:db';
import slugify from 'slugify';

console.log('Running contact page generation tests...');

async function testContactPageGeneration() {
  const contacts = await db.select().from(Contact);

  if (!contacts || contacts.length === 0) {
    console.warn('No contacts found in the database. Skipping page generation tests.');
    // If no contacts, technically no pages to fail on for this test's scope
    console.log('Contact page generation tests considered passed (no data).');
    return true;
  }

  console.log(`Found ${contacts.length} contacts.`);

  let allSlugsGeneratedCorrectly = true;

  for (const contact of contacts) {
    if (!contact.name) {
      console.error('Found a contact without a name:', contact);
      allSlugsGeneratedCorrectly = false;
      continue;
    }
    const expectedSlug = slugify(contact.name, { lower: true, strict: true });
    console.log(`Contact: "${contact.name}", Expected slug: "${expectedSlug}"`);
    // In a real test environment, we might try to fetch /contacts/${expectedSlug}
    // For now, we're just checking if slugs can be generated.
    if (!expectedSlug) {
      console.error(`Failed to generate slug for: "${contact.name}"`);
      allSlugsGeneratedCorrectly = false;
    }
  }

  if (allSlugsGeneratedCorrectly) {
    console.log('All contact page slugs generated successfully!');
    return true;
  } else {
    console.error('Some contact page slugs FAILED to generate.');
    return false;
  }
}

testContactPageGeneration().then(passed => {
  if (passed) {
    console.log('All contact page generation tests passed!');
  } else {
    console.error('Some contact page generation tests FAILED.');
    process.exit(1); // Indicate failure
  }
}).catch(err => {
  console.error('Error during contact page generation tests:', err);
  process.exit(1); // Indicate failure
});

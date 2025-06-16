// db/config.ts
import { column, defineDb, defineTable } from "astro:db";

const Contact = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    slug: column.text(), // New slug field
    createdAt: column.date(),
    updatedAt: column.date(),
  },
});

const Names = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    contactId: column.number({ references: () => Contact.columns.id }),
    name: column.text(), // e.g., 'givenName', 'familyName', 'primary'
    value: column.text(),
    createdAt: column.date(),
    updatedAt: column.date(),
  },
});

const Addresses = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    contactId: column.number({ references: () => Contact.columns.id }),
    name: column.text(), // e.g., 'primary', 'home', 'work'
    value: column.text(), // JSON stringified address data
    createdAt: column.date(),
    updatedAt: column.date(),
  },
});

const PhoneNumbers = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    contactId: column.number({ references: () => Contact.columns.id }),
    name: column.text(), // e.g., 'primary', 'mobile', 'work'
    value: column.text(),
    createdAt: column.date(),
    updatedAt: column.date(),
  },
});

const EmailAddresses = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    contactId: column.number({ references: () => Contact.columns.id }),
    name: column.text(), // e.g., 'primary', 'work'
    value: column.text(), // Should be unique if name is 'primary' - Note: DB level uniqueness for conditional cases might need app logic
    createdAt: column.date(),
    updatedAt: column.date(),
  },
});

const Jobs = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    contactId: column.number({ references: () => Contact.columns.id }),
    name: column.text(), // e.g., 'primary'
    company: column.text(),
    role: column.text(),
    linkedInUsername: column.text({ optional: true }),
    createdAt: column.date(),
    updatedAt: column.date(),
  },
});

const GithubProfiles = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    contactId: column.number({ references: () => Contact.columns.id }),
    name: column.text(), // e.g., 'primary'
    username: column.text(),
    createdAt: column.date(),
    updatedAt: column.date(),
  },
});

const GameAccounts = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    contactId: column.number({ references: () => Contact.columns.id }),
    platform: column.text(), // e.g., 'steam', 'psn'
    username: column.text(),
    createdAt: column.date(),
    updatedAt: column.date(),
  },
});

const StravaAccounts = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    contactId: column.number({ references: () => Contact.columns.id }),
    name: column.text(), // e.g., 'primary'
    username: column.text(),
    createdAt: column.date(),
    updatedAt: column.date(),
  },
});

const Notes = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    contactId: column.number({ references: () => Contact.columns.id }),
    name: column.text(), // e.g., 'note title'
    value: column.text(), // For the note content
    createdAt: column.date(),
    updatedAt: column.date(),
  },
});

export default defineDb({
  tables: {
    Contact,
    Names,
    Addresses,
    PhoneNumbers,
    EmailAddresses,
    Jobs,
    GithubProfiles,
    GameAccounts,
    StravaAccounts,
    Notes,
  },
});

// db/config.ts
import { column, defineDb, defineTable } from "astro:db";

const Contact = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    email: column.text({ unique: true }),
    phone: column.text({ optional: true }), // Phone number is optional
  },
});

export default defineDb({
  tables: { Contact },
});

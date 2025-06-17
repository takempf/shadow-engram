import { db, Contact, Names, EmailAddresses, PhoneNumbers, Addresses, Jobs, GithubProfiles, GameAccounts, StravaAccounts, Notes, eq, and } from 'astro:db';
import type { APIRoute } from 'astro';

// Map string data types to actual DB table objects
const tableMap = {
  Contact, // For updating fields directly on the Contact table itself
  Names,
  EmailAddresses,
  PhoneNumbers,
  Addresses,
  Jobs,
  GithubProfiles,
  GameAccounts,
  StravaAccounts,
  Notes,
};

// Define a type for allowed table names for stricter validation (optional but good practice)
type AllowedTableNames = keyof typeof tableMap;

// Define a type for the expected request body
interface UpdateRequestBody {
  contactId: number;
  dataType: AllowedTableNames;
  dataId?: number; // Optional: not needed if updating Contact table directly by contactId
  field: string;
  newValue: any;
}

export const PATCH: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") !== "application/json") {
    return new Response(JSON.stringify({ message: "Content-Type must be application/json" }), { status: 415 });
  }

  let body: UpdateRequestBody;
  try {
    body = await request.json();
  } catch (error) {
    return new Response(JSON.stringify({ message: "Invalid JSON body" }), { status: 400 });
  }

  const { contactId, dataType, dataId, field, newValue } = body;

  // Basic validation
  if (!contactId || !dataType || !field) {
    // dataId is not strictly required if we are updating the Contact table itself,
    // but the current design implies it's for related tables.
    // If updating Contact table, dataId might be the same as contactId or handled differently.
    // For now, let's assume dataId is required for non-Contact updates.
    return new Response(JSON.stringify({ message: "Missing required fields: contactId, dataType, field are mandatory." }), { status: 400 });
  }

  const Table = tableMap[dataType];
  if (!Table) {
    return new Response(JSON.stringify({ message: `Invalid dataType: ${dataType}` }), { status: 400 });
  }

  // More specific validation for dataId when not updating Contact table directly
  if (dataType !== 'Contact' && (dataId === undefined || dataId === null)) {
    return new Response(JSON.stringify({ message: "Missing required field: dataId is mandatory for this dataType." }), { status: 400 });
  }

  // **Security Note:** In a production environment, `field` should be validated against a list
  // of allowed updatable fields for the given `Table` to prevent arbitrary column updates.
  // For example:
  // const allowedFieldsForTable = { Names: ['value', 'name'], EmailAddresses: ['value', 'name'], ... };
  // if (!allowedFieldsForTable[dataType] || !allowedFieldsForTable[dataType].includes(field)) {
  //   return new Response(JSON.stringify({ message: `Field '${field}' is not updatable for dataType '${dataType}'` }), { status: 400 });
  // }

  try {
    let result;
    if (dataType === 'Contact') {
      // If updating the Contact table itself, dataId is typically the contactId
      // Or, if 'field' is on Contact table, dataId might not be used if contactId is the primary key for update.
      // Assuming for Contact table, the primary key for update is its own 'id' field which is contactId.
      result = await db.update(Contact)
        .set({ [field]: newValue, updatedAt: new Date() }) // Also update 'updatedAt' timestamp
        .where(eq(Contact.id, contactId))
        .run();
    } else {
      // For related tables, use dataId for the specific record and ensure it belongs to the contactId
      // This requires related tables to have a 'contactId' column.
      // And their primary key is 'id' (which corresponds to dataId).
      // @ts-ignore
      if (!Table.columns.contactId || !Table.columns.id) {
        console.error(`Table ${dataType} does not have contactId or id columns for scoped update.`);
        return new Response(JSON.stringify({ message: "Internal server error: Table configuration issue." }), { status: 500 });
      }

      result = await db.update(Table)
        // @ts-ignore
        .set({ [field]: newValue, updatedAt: new Date() }) // Also update 'updatedAt' timestamp if table has it
        // @ts-ignore
        .where(and(eq(Table.id, dataId), eq(Table.contactId, contactId)))
        .run();
    }

    if (result.rowsAffected === 0) {
      return new Response(JSON.stringify({ message: "Record not found or no changes made." }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Update successful", data: { contactId, dataType, dataId, field, newValue } }), { status: 200 });

  } catch (error) {
    console.error("Error updating contact data:", error);
    // Check for specific error types if possible, e.g., foreign key constraint, data type mismatch
    return new Response(JSON.stringify({ message: "Internal server error while updating data." }), { status: 500 });
  }
};

// Fallback for other methods
export const ALL: APIRoute = ({ request }) => {
  return new Response(JSON.stringify({ message: `Method ${request.method} not allowed.` }), { status: 405 });
};

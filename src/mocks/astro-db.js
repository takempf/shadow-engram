// src/mocks/astro-db.js

// --- Mock Data ---
const now = new Date(); // Standardized 'now' for all entries
const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // tomorrow

export const mockContacts = [
  { id: 1, slug: 'timothy-kempf', createdAt: now, updatedAt: now },
  { id: 2, slug: 'alex-doe', createdAt: now, updatedAt: futureDate } // Alex Doe updated later
];

export const mockNames = [
  {
    id: 1,
    contactId: 1,
    name: 'primary',
    value: 'Timothy Kempf',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 2,
    contactId: 1,
    name: 'givenName',
    value: 'Timothy',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 3,
    contactId: 1,
    name: 'familyName',
    value: 'Kempf',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 10,
    contactId: 2,
    name: 'primary',
    value: 'Alex Doe',
    createdAt: now,
    updatedAt: now
  }
];

export const mockEmailAddresses = [
  {
    id: 1,
    contactId: 1,
    name: 'primary',
    value: 'tim@kempf.dev',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 2,
    contactId: 1,
    name: 'secondary',
    value: 'another@example.com',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 10,
    contactId: 2,
    name: 'primary',
    value: 'alex@example.com',
    createdAt: now,
    updatedAt: now
  }
];

export const mockPhoneNumbers = [
  {
    id: 1,
    contactId: 1,
    name: 'primary',
    value: '8652553692',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 10,
    contactId: 2,
    name: 'primary',
    value: '555-123-4567',
    createdAt: now,
    updatedAt: now
  }
];

export const mockAddresses = [
  {
    id: 1,
    contactId: 1,
    name: 'primary',
    value: JSON.stringify({
      street: '123 Mock St',
      city: 'Testville',
      zip: '00000',
      country: 'Mockland'
    }),
    createdAt: now,
    updatedAt: now
  }
];

export const mockJobs = [
  {
    id: 1,
    contactId: 1,
    name: 'primary',
    company: 'Meadow',
    role: 'Frontend Lead',
    linkedInUsername: 'takempf',
    createdAt: now,
    updatedAt: now
  }
];

export const mockGithubProfiles = [
  {
    id: 1,
    contactId: 1,
    name: 'primary',
    username: 'takempf',
    createdAt: now,
    updatedAt: now
  }
];

export const mockGameAccounts = [
  {
    id: 1,
    contactId: 1,
    platform: 'steam',
    username: 'pantherxiii',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 2,
    contactId: 1,
    platform: 'psn',
    username: 'pantherxiii_psn',
    createdAt: now,
    updatedAt: now
  }
];

export const mockStravaAccounts = [
  {
    id: 1,
    contactId: 1,
    name: 'primary',
    username: 'takempf',
    createdAt: now,
    updatedAt: now
  }
];

export const mockNotes = [
  // Notes for contactId 1, with different createdAt to test ordering
  {
    id: 1,
    contactId: 1,
    name: 'Initial thoughts',
    value: 'This is a big ol note about the contact system.',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 3,
    contactId: 1,
    name: 'Later note',
    value: 'This is a later note, should appear after initial.',
    createdAt: futureDate,
    updatedAt: futureDate
  },
  {
    id: 10,
    contactId: 2,
    name: 'Follow up',
    value: 'Remember to discuss project details.',
    createdAt: now,
    updatedAt: now
  }
];

const allMockTables = {
  // Used as a fallback in 'from' or for other functions if needed
  Contact: mockContacts,
  Names: mockNames,
  EmailAddresses: mockEmailAddresses,
  PhoneNumbers: mockPhoneNumbers,
  Addresses: mockAddresses,
  Jobs: mockJobs,
  GithubProfiles: mockGithubProfiles,
  GameAccounts: mockGameAccounts,
  StravaAccounts: mockStravaAccounts,
  Notes: mockNotes
};

// --- Mock Column Definitions ---
const createMockColumn = (name, type = 'string') => ({ // Added type for potential future use
  name,
  type,
  toString: () => `mock_column_${name}`
});

// Helper to create a full table schema object with columns
const createTableSchema = (tableName, columnDefinitions) => {
  const schema = { _tableName: tableName, columns: {} };
  for (const colName in columnDefinitions) {
    schema[colName] = createMockColumn(colName, columnDefinitions[colName]);
    schema.columns[colName] = schema[colName]; // For direct access like Table.columns.contactId
  }
  return schema;
};

export const Contact = createTableSchema('Contact', {
  id: 'number', slug: 'string', FirstName: 'string', LastName: 'string', // Added more fields from ContactDetail
  PreferredName: 'string', Prefix: 'string', Suffix: 'string', Company: 'string',
  JobTitle: 'string', Department: 'string', Birthday: 'string', Website: 'string',
  Source: 'string', Notes: 'string', // Main contact notes
  OwnerId: 'number', TenantId: 'string',
  createdAt: 'date', updatedAt: 'date'
});
export const Names = createTableSchema('Names', {
  id: 'number', contactId: 'number', name: 'string', value: 'string',
  createdAt: 'date', updatedAt: 'date'
});
export const EmailAddresses = createTableSchema('EmailAddresses', {
  id: 'number', contactId: 'number', name: 'string', value: 'string', type: 'string', // Added type
  createdAt: 'date', updatedAt: 'date'
});
export const PhoneNumbers = createTableSchema('PhoneNumbers', {
  id: 'number', contactId: 'number', name: 'string', value: 'string', type: 'string', // Added type
  createdAt: 'date', updatedAt: 'date'
});
export const Addresses = createTableSchema('Addresses', {
  id: 'number', contactId: 'number', name: 'string', value: 'string', type: 'string', // Added type
  createdAt: 'date', updatedAt: 'date'
});
export const Jobs = createTableSchema('Jobs', {
  id: 'number', contactId: 'number', name: 'string', company: 'string', role: 'string',
  linkedInUsername: 'string', createdAt: 'date', updatedAt: 'date'
});
export const GithubProfiles = createTableSchema('GithubProfiles', {
  id: 'number', contactId: 'number', name: 'string', username: 'string',
  createdAt: 'date', updatedAt: 'date'
});
export const GameAccounts = createTableSchema('GameAccounts', {
  id: 'number', contactId: 'number', platform: 'string', username: 'string',
  createdAt: 'date', updatedAt: 'date'
});
export const StravaAccounts = createTableSchema('StravaAccounts', {
  id: 'number', contactId: 'number', name: 'string', username: 'string',
  createdAt: 'date', updatedAt: 'date'
});
export const Notes = createTableSchema('Notes', { // This is for the NotesDetails table in ContactDetail
  id: 'number', contactId: 'number', name: 'string', value: 'string',
  createdAt: 'date', updatedAt: 'date'
});

const tableObjectToDataMap = new Map([
  [Contact, mockContacts],
  [Names, mockNames],
  [EmailAddresses, mockEmailAddresses],
  [PhoneNumbers, mockPhoneNumbers],
  [Addresses, mockAddresses],
  [Jobs, mockJobs],
  [GithubProfiles, mockGithubProfiles],
  [GameAccounts, mockGameAccounts],
  [StravaAccounts, mockStravaAccounts],
  [Notes, mockNotes]
]);

// --- Mock DB Implementation ---
export const db = {
  _fields: null,
  _tableData: null,
  _conditions: [],
  _orderBy: null, // Stores { column: mockColumnObject, direction: 'asc' | 'desc' }

  select: function (fieldsToSelect) {
    this._fields = fieldsToSelect || null;
    this._tableData = null;
    this._conditions = [];
    this._orderBy = null;
    return this;
  },
  from: function (tableSchema) {
    this._tableData = tableObjectToDataMap.get(tableSchema);
    if (!this._tableData) {
      this._tableData = allMockTables[tableSchema._tableName || tableSchema]; // Fallback for string name or _tableName lookup
      if (!this._tableData) {
        throw new Error(
          `Mock DB: Unknown table schema or name: ${tableSchema}`
        );
      }
    }
    return this;
  },
  where: function (conditionFn) {
    this._conditions.push(conditionFn);
    return this;
  },
  orderBy: function (column, direction = 'asc') {
    if (!column || !column.name)
      throw new Error('Mock orderBy: Invalid column object.');
    this._orderBy = { column, direction: direction.toLowerCase() };
    return this;
  },
  _applyFiltersAndOrder: function (data) {
    let results = [...data]; // Work on a copy to avoid mutating original mock data arrays

    if (this._conditions.length > 0) {
      results = results.filter((item) =>
        this._conditions.every((condFunc) => condFunc(item))
      );
    }

    if (this._orderBy && this._orderBy.column) {
      const fieldName = this._orderBy.column.name;
      const direction = this._orderBy.direction;
      results.sort((a, b) => {
        const valA = a[fieldName];
        const valB = b[fieldName];
        let comparison = 0;

        if (valA instanceof Date && valB instanceof Date) {
          comparison = valA.getTime() - valB.getTime();
        } else if (typeof valA === 'number' && typeof valB === 'number') {
          comparison = valA - valB;
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } else {
          // Basic comparison for other types or mixed types
          if (valA < valB) comparison = -1;
          if (valA > valB) comparison = 1;
        }
        return direction === 'desc' ? comparison * -1 : comparison;
      });
    }
    return results;
  },
  _mapSelectedFields: function (item) {
    if (!this._fields) return item;
    const selectedItem = {};
    for (const key in this._fields) {
      const columnObject = this._fields[key];
      if (columnObject && columnObject.name) {
        selectedItem[key] = item[columnObject.name];
      } else {
        // This case might happen if a raw string was passed in select, though unlikely with astro:db
        console.warn(
          `Mock DB: _mapSelectedFields encountered unexpected field: ${key}`
        );
      }
    }
    return selectedItem;
  },
  all: function () {
    if (!this._tableData)
      throw new Error('Mock DB: .from(table) must be called before .all()');
    const filteredAndOrdered = this._applyFiltersAndOrder(this._tableData);
    const results = filteredAndOrdered.map((item) =>
      this._mapSelectedFields(item)
    );
    this._fields = null;
    this._tableData = null;
    this._conditions = [];
    this._orderBy = null;
    return Promise.resolve(results);
  },
  get: function () {
    if (!this._tableData)
      throw new Error('Mock DB: .from(table) must be called before .get()');
    const filteredAndOrdered = this._applyFiltersAndOrder(this._tableData);
    const result =
      filteredAndOrdered.length > 0
        ? this._mapSelectedFields(filteredAndOrdered[0])
        : undefined;
    this._fields = null;
    this._tableData = null;
    this._conditions = [];
    this._orderBy = null;
    return Promise.resolve(result);
  },

  // --- INSERT ---
  _insertTable: null,
  _insertValues: [],
  insert: function (tableSchema) {
    this._insertTable = tableObjectToDataMap.get(tableSchema);
    if (!this._insertTable) {
      throw new Error(`Mock DB: insert: Unknown table schema: ${tableSchema}`);
    }
    this._insertValues = [];
    return this;
  },
  values: function (records) {
    if (!this._insertTable) throw new Error('Mock DB: insert().values() called before insert(table)');
    // Ensure records is an array
    const recordsArray = Array.isArray(records) ? records : [records];
    this._insertValues = recordsArray.map(record => ({
      ...record,
      id: record.id || Math.floor(Math.random() * 1000000), // Simple ID generation
      createdAt: record.createdAt || new Date(),
      updatedAt: record.updatedAt || new Date(),
    }));
    return this;
  },
  returning: function () { // Optional: pass specific columns to return
    if (!this._insertTable || this._insertValues.length === 0) {
      throw new Error('Mock DB: insert().returning() called without table or values');
    }
    this._insertValues.forEach(record => this._insertTable.push(record));
    const inserted = [...this._insertValues]; // Return copies
    this._insertTable = null;
    this._insertValues = [];
    return Promise.resolve(inserted);
  },

  // --- UPDATE ---
  _updateTable: null,
  _updateSetValues: null,
  // _updateConditions: [], // Already have this._conditions from select
  update: function (tableSchema) {
    this._updateTable = tableObjectToDataMap.get(tableSchema);
    if (!this._updateTable) {
      throw new Error(`Mock DB: update: Unknown table schema: ${tableSchema}`);
    }
    this._updateSetValues = null;
    this._conditions = []; // Reset conditions for update
    return this;
  },
  set: function (valuesToSet) {
    if (!this._updateTable) throw new Error('Mock DB: update().set() called before update(table)');
    this._updateSetValues = { ...valuesToSet, updatedAt: new Date() };
    return this;
  },
  // .where() is reused from select
  run: async function () { // For update and delete completion
    if (this._updateTable && this._updateSetValues) { // UPDATE operation
      if (!this._updateSetValues) throw new Error('Mock DB: update().run() called without .set()');

      let rowsAffected = 0;
      const originalData = this._updateTable; // Get the actual array

      // Apply conditions to a temporary copy to identify indices
      const itemsToUpdate = originalData.filter(item => this._conditions.every(condFunc => condFunc(item)));

      itemsToUpdate.forEach(item => {
        const itemIndex = originalData.findIndex(originalItem => originalItem.id === item.id);
        if (itemIndex !== -1) {
          originalData[itemIndex] = { ...originalData[itemIndex], ...this._updateSetValues };
          rowsAffected++;
        }
      });

      this._updateTable = null;
      this._updateSetValues = null;
      this._conditions = [];
      return Promise.resolve({ rowsAffected });

    } else if (this._deleteTable) { // DELETE operation
      let rowsAffected = 0;
      const originalData = this._deleteTable; // Get the actual array for deletion

      // Filter out items that should be deleted
      const itemsToKeep = originalData.filter(item => !this._conditions.every(condFunc => condFunc(item)));
      rowsAffected = originalData.length - itemsToKeep.length;

      // Replace the original array content
      originalData.length = 0; // Clear original array
      itemsToKeep.forEach(item => originalData.push(item)); // Push back items to keep

      this._deleteTable = null;
      this._conditions = [];
      return Promise.resolve({ rowsAffected });
    }
    throw new Error('Mock DB: run() called in invalid state');
  },

  // --- DELETE ---
  _deleteTable: null,
  // _deleteConditions: [], // Reusing this._conditions
  delete: function (tableSchema) {
    this._deleteTable = tableObjectToDataMap.get(tableSchema);
     if (!this._deleteTable) {
      throw new Error(`Mock DB: delete: Unknown table schema: ${tableSchema}`);
    }
    this._conditions = []; // Reset conditions for delete
    return this;
  }
  // .where() is reused
  // .run() is reused
};

// --- Condition Functions ---
export function eq(column, value) {
  if (!column || !column.name)
    throw new Error(
      "Mock eq: Invalid column object. Must have a 'name' property."
    );
  return (item) => item[column.name] === value;
}

export function and(...conditions) {
  return (item) => conditions.every((condFunc) => condFunc(item));
}

// src/mocks/astro-db.js

// --- Mock Data ---
const now = new Date(); // Standardized 'now' for all entries
const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // tomorrow

export const mockContacts = [
  { id: 1, slug: 'timothy-kempf', createdAt: now, updatedAt: now },
  { id: 2, slug: 'alex-doe', createdAt: now, updatedAt: futureDate }, // Alex Doe updated later
];

export const mockNames = [
  { id: 1, contactId: 1, name: 'primary', value: 'Timothy Kempf', createdAt: now, updatedAt: now },
  { id: 2, contactId: 1, name: 'givenName', value: 'Timothy', createdAt: now, updatedAt: now },
  { id: 3, contactId: 1, name: 'familyName', value: 'Kempf', createdAt: now, updatedAt: now },
  { id: 10, contactId: 2, name: 'primary', value: 'Alex Doe', createdAt: now, updatedAt: now },
];

export const mockEmailAddresses = [
  { id: 1, contactId: 1, name: 'primary', value: 'tim@kempf.dev', createdAt: now, updatedAt: now },
  { id: 2, contactId: 1, name: 'secondary', value: 'another@example.com', createdAt: now, updatedAt: now },
  { id: 10, contactId: 2, name: 'primary', value: 'alex@example.com', createdAt: now, updatedAt: now },
];

export const mockPhoneNumbers = [
    { id: 1, contactId: 1, name: 'primary', value: '8652553692', createdAt: now, updatedAt: now },
    { id: 10, contactId: 2, name: 'primary', value: '555-123-4567', createdAt: now, updatedAt: now },
];

export const mockAddresses = [
    { id: 1, contactId: 1, name: 'primary', value: JSON.stringify({ street: '123 Mock St', city: 'Testville', zip: '00000', country: 'Mockland' }), createdAt: now, updatedAt: now },
];

export const mockJobs = [
    { id: 1, contactId: 1, name: 'primary', company: 'Meadow', role: 'Frontend Lead', linkedInUsername: 'takempf', createdAt: now, updatedAt: now },
];

export const mockGithubProfiles = [
    { id: 1, contactId: 1, name: 'primary', username: 'takempf', createdAt: now, updatedAt: now },
];

export const mockGameAccounts = [
    { id: 1, contactId: 1, platform: 'steam', username: 'pantherxiii', createdAt: now, updatedAt: now },
    { id: 2, contactId: 1, platform: 'psn', username: 'pantherxiii_psn', createdAt: now, updatedAt: now },
];

export const mockStravaAccounts = [
    { id: 1, contactId: 1, name: 'primary', username: 'takempf', createdAt: now, updatedAt: now },
];

export const mockNotes = [
    // Notes for contactId 1, with different createdAt to test ordering
    { id: 1, contactId: 1, name: 'Initial thoughts', value: 'This is a big ol note about the contact system.', createdAt: now, updatedAt: now },
    { id: 3, contactId: 1, name: 'Later note', value: 'This is a later note, should appear after initial.', createdAt: futureDate, updatedAt: futureDate},
    { id: 10, contactId: 2, name: 'Follow up', value: 'Remember to discuss project details.', createdAt: now, updatedAt: now },
];

const allMockTables = { // Used as a fallback in 'from' or for other functions if needed
  Contact: mockContacts,
  Names: mockNames,
  EmailAddresses: mockEmailAddresses,
  PhoneNumbers: mockPhoneNumbers,
  Addresses: mockAddresses,
  Jobs: mockJobs,
  GithubProfiles: mockGithubProfiles,
  GameAccounts: mockGameAccounts,
  StravaAccounts: mockStravaAccounts,
  Notes: mockNotes,
};

// --- Mock Column Definitions ---
const createMockColumn = (name) => ({ name, toString: () => `mock_column_${name}` });

export const Contact = {
  _tableName: 'Contact', // For easier debugging or alternative mapping
  id: createMockColumn('id'),
  slug: createMockColumn('slug'),
  createdAt: createMockColumn('createdAt'),
  updatedAt: createMockColumn('updatedAt'),
};
export const Names = {
  _tableName: 'Names',
  id: createMockColumn('id'),
  contactId: createMockColumn('contactId'),
  name: createMockColumn('name'),
  value: createMockColumn('value'),
  createdAt: createMockColumn('createdAt'),
  updatedAt: createMockColumn('updatedAt'),
};
export const EmailAddresses = {
  _tableName: 'EmailAddresses',
  id: createMockColumn('id'),
  contactId: createMockColumn('contactId'),
  name: createMockColumn('name'),
  value: createMockColumn('value'),
  createdAt: createMockColumn('createdAt'),
  updatedAt: createMockColumn('updatedAt'),
};
export const PhoneNumbers = {
  _tableName: 'PhoneNumbers',
  id: createMockColumn('id'),
  contactId: createMockColumn('contactId'),
  name: createMockColumn('name'),
  value: createMockColumn('value'),
  createdAt: createMockColumn('createdAt'),
  updatedAt: createMockColumn('updatedAt'),
};
export const Addresses = {
  _tableName: 'Addresses',
  id: createMockColumn('id'),
  contactId: createMockColumn('contactId'),
  name: createMockColumn('name'),
  value: createMockColumn('value'),
  createdAt: createMockColumn('createdAt'),
  updatedAt: createMockColumn('updatedAt'),
};
export const Jobs = {
  _tableName: 'Jobs',
  id: createMockColumn('id'),
  contactId: createMockColumn('contactId'),
  name: createMockColumn('name'),
  company: createMockColumn('company'),
  role: createMockColumn('role'),
  linkedInUsername: createMockColumn('linkedInUsername'),
  createdAt: createMockColumn('createdAt'),
  updatedAt: createMockColumn('updatedAt'),
};
export const GithubProfiles = {
  _tableName: 'GithubProfiles',
  id: createMockColumn('id'),
  contactId: createMockColumn('contactId'),
  name: createMockColumn('name'),
  username: createMockColumn('username'),
  createdAt: createMockColumn('createdAt'),
  updatedAt: createMockColumn('updatedAt'),
};
export const GameAccounts = {
  _tableName: 'GameAccounts',
  id: createMockColumn('id'),
  contactId: createMockColumn('contactId'),
  platform: createMockColumn('platform'),
  username: createMockColumn('username'),
  createdAt: createMockColumn('createdAt'),
  updatedAt: createMockColumn('updatedAt'),
};
export const StravaAccounts = {
  _tableName: 'StravaAccounts',
  id: createMockColumn('id'),
  contactId: createMockColumn('contactId'),
  name: createMockColumn('name'),
  username: createMockColumn('username'),
  createdAt: createMockColumn('createdAt'),
  updatedAt: createMockColumn('updatedAt'),
};
export const Notes = {
  _tableName: 'Notes',
  id: createMockColumn('id'),
  contactId: createMockColumn('contactId'),
  name: createMockColumn('name'),
  value: createMockColumn('value'),
  createdAt: createMockColumn('createdAt'),
  updatedAt: createMockColumn('updatedAt'),
};

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
    [Notes, mockNotes],
]);

// --- Mock DB Implementation ---
export const db = {
  _fields: null,
  _tableData: null,
  _conditions: [],
  _orderBy: null, // Stores { column: mockColumnObject, direction: 'asc' | 'desc' }

  select: function(fieldsToSelect) {
    this._fields = fieldsToSelect || null;
    this._tableData = null;
    this._conditions = [];
    this._orderBy = null;
    return this;
  },
  from: function(tableSchema) {
    this._tableData = tableObjectToDataMap.get(tableSchema);
    if (!this._tableData) {
        this._tableData = allMockTables[tableSchema._tableName || tableSchema]; // Fallback for string name or _tableName lookup
        if(!this._tableData) {
            throw new Error(`Mock DB: Unknown table schema or name: ${tableSchema}`);
        }
    }
    return this;
  },
  where: function(conditionFn) {
    this._conditions.push(conditionFn);
    return this;
  },
  orderBy: function(column, direction = 'asc') {
    if (!column || !column.name) throw new Error("Mock orderBy: Invalid column object.");
    this._orderBy = { column, direction: direction.toLowerCase() };
    return this;
  },
  _applyFiltersAndOrder: function(data) {
    let results = [...data]; // Work on a copy to avoid mutating original mock data arrays

    if (this._conditions.length > 0) {
      results = results.filter(item => this._conditions.every(condFunc => condFunc(item)));
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
        } else { // Basic comparison for other types or mixed types
          if (valA < valB) comparison = -1;
          if (valA > valB) comparison = 1;
        }
        return direction === 'desc' ? comparison * -1 : comparison;
      });
    }
    return results;
  },
  _mapSelectedFields: function(item) {
    if (!this._fields) return item;
    const selectedItem = {};
    for (const key in this._fields) {
      const columnObject = this._fields[key];
      if (columnObject && columnObject.name) {
        selectedItem[key] = item[columnObject.name];
      } else {
        // This case might happen if a raw string was passed in select, though unlikely with astro:db
        console.warn(`Mock DB: _mapSelectedFields encountered unexpected field: ${key}`);
      }
    }
    return selectedItem;
  },
  all: function() {
    if (!this._tableData) throw new Error("Mock DB: .from(table) must be called before .all()");
    const filteredAndOrdered = this._applyFiltersAndOrder(this._tableData);
    const results = filteredAndOrdered.map(item => this._mapSelectedFields(item));
    this._fields = null; this._tableData = null; this._conditions = []; this._orderBy = null;
    return Promise.resolve(results);
  },
  get: function() {
    if (!this._tableData) throw new Error("Mock DB: .from(table) must be called before .get()");
    const filteredAndOrdered = this._applyFiltersAndOrder(this._tableData);
    const result = filteredAndOrdered.length > 0 ? this._mapSelectedFields(filteredAndOrdered[0]) : undefined;
    this._fields = null; this._tableData = null; this._conditions = []; this._orderBy = null;
    return Promise.resolve(result);
  }
};

// --- Condition Functions ---
export function eq(column, value) {
  if (!column || !column.name) throw new Error("Mock eq: Invalid column object. Must have a 'name' property.");
  return item => item[column.name] === value;
}

export function and(...conditions) {
  return item => conditions.every(condFunc => condFunc(item));
}

// src/mocks/astro-db.js

// --- Mock Data ---
const now = new Date();
export const mockContacts = [
  { id: 1, slug: 'timothy-kempf', createdAt: now, updatedAt: now },
  { id: 2, slug: 'alex-doe', createdAt: now, updatedAt: now },
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
    { id: 1, contactId: 1, name: 'initial thoughts', value: 'This is a big ol note about the contact system.', createdAt: now, updatedAt: now },
    { id: 10, contactId: 2, name: 'Follow up', value: 'Remember to discuss project details.', createdAt: now, updatedAt: now },
];

const allMockTables = {
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
  _tableName: 'Contact',
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

// Map table definition objects to their data arrays
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
  _orderBy: null,

  select: function(fieldsToSelect) {
    this._fields = fieldsToSelect || null;
    this._tableData = null;
    this._conditions = [];
    this._orderBy = null;
    return this;
  },
  from: function(tableSchema) { // tableSchema is one of the exported const objects like 'Contact' or 'Names'
    this._tableData = tableObjectToDataMap.get(tableSchema);
    if (!this._tableData) {
        // Fallback if string name was passed, though schema object is preferred
        this._tableData = allMockTables[tableSchema];
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
  orderBy: function(column, direction = 'asc') { // column can be a mock column object or string
    const fieldName = typeof column === 'string' ? column : column.name;
    this._orderBy = { field: fieldName, direction };
    return this;
  },
  _applyFiltersAndOrder: function(data) {
    let results = data;
    if (this._conditions.length > 0) {
      results = results.filter(item => this._conditions.every(condFunc => condFunc(item)));
    }
    if (this._orderBy) {
      const { field, direction } = this._orderBy;
      results.sort((a, b) => {
        let comparison = 0;
        if (a[field] < b[field]) comparison = -1;
        if (a[field] > b[field]) comparison = 1;
        return direction === 'desc' ? comparison * -1 : comparison;
      });
    }
    return results;
  },
  _mapSelectedFields: function(item) {
    if (!this._fields) return item; // Return full item if no specific fields selected
    const selectedItem = {};
    for (const key in this._fields) {
      // key is the alias, this._fields[key] is the column object (e.g. Contact.slug)
      selectedItem[key] = item[this._fields[key].name];
    }
    return selectedItem;
  },
  all: function() {
    if (!this._tableData) throw new Error("Mock DB: .from(table) must be called before .all()");
    const filteredAndOrdered = this._applyFiltersAndOrder([...this._tableData]); // Use spread to avoid mutating original mock data
    const results = filteredAndOrdered.map(item => this._mapSelectedFields(item));

    // Reset for next query chain
    this._fields = null; this._tableData = null; this._conditions = []; this._orderBy = null;
    return Promise.resolve(results);
  },
  get: function() {
    if (!this._tableData) throw new Error("Mock DB: .from(table) must be called before .get()");
    const filteredAndOrdered = this._applyFiltersAndOrder([...this._tableData]); // Use spread
    const result = filteredAndOrdered.length > 0 ? this._mapSelectedFields(filteredAndOrdered[0]) : undefined;

    // Reset for next query chain
    this._fields = null; this._tableData = null; this._conditions = []; this._orderBy = null;
    return Promise.resolve(result);
  }
};

// --- Condition Functions ---
export function eq(column, value) {
  if (!column || !column.name) throw new Error("Mock eq: Invalid column object. Ensure it's from the mock table definition.");
  return item => item[column.name] === value;
}

export function and(...conditions) {
  return item => conditions.every(condFunc => condFunc(item));
}

// --- Other DB operations if needed for tests (not used by [slug].astro page) ---
// export const insert = vi.fn().mockReturnThis();
// export const values = vi.fn().mockResolvedValue({ /* ... */ });
// export const returning = vi.fn().mockReturnThis();
// ... etc.

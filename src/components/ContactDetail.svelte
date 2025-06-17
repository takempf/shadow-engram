<script lang="ts">
  import { createQuery, QueryClient } from '@tanstack/svelte-query';
  import EditableField from './EditableField.svelte';
  // Assuming types are defined, or we can define a basic one here for now
  // import type { ContactFull } from '$lib/types';

  // Define a basic structure for the fetched contact data, including related entities
  // This should ideally come from a shared types file ($lib/types.ts)
  interface ContactField {
    id: number;
    value: string | null | undefined;
    type?: string | null | undefined; // For emails, phones, addresses
    name?: string | null | undefined; // For names, jobs, etc.
    // Add other common fields from related tables if needed
    [key: string]: any; // Allow other properties
  }
  interface ContactFull {
    id: number;
    FirstName?: string | null;
    LastName?: string | null;
    PreferredName?: string | null;
    Prefix?: string | null;
    Suffix?: string | null;
    Company?: string | null;
    JobTitle?: string | null;
    Department?: string | null;
    Birthday?: string | Date | null;
    Website?: string | null;
    Source?: string | null;
    Notes?: string | null; // This is the main Contact.Notes
    // Related entities
    Names?: ContactField[];
    EmailAddresses?: ContactField[];
    PhoneNumbers?: ContactField[];
    Addresses?: ContactField[]; // Address value might be JSON string
    Jobs?: ContactField[];
    GithubProfiles?: ContactField[];
    GameAccounts?: ContactField[];
    StravaAccounts?: ContactField[];
    NotesDetails?: ContactField[]; // This is for the Notes table entries
    // Timestamps & other fields
    createdAt: string | Date;
    updatedAt: string | Date;
    [key: string]: any; // Allow other properties from Contact table
  }

  export let contactId: number;

  const queryClient = new QueryClient(); // Instantiate client directly for now

  const contactQuery = createQuery<ContactFull>(
    {
      queryKey: ['contact', contactId],
      queryFn: async (): Promise<ContactFull> => {
        const response = await fetch(`/api/contacts/${contactId}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error('Contact not found');
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      },
      // staleTime: 5 * 60 * 1000, // Optional: 5 minutes
    },
    queryClient // Pass client instance here
  );

  // Helper to stringify address for display/editing if it's an object
  // This is particularly for the Addresses.value field which is stored as JSON string
  function formatAddressValue(addressValue: string | object | undefined | null): string {
    if (addressValue === null || addressValue === undefined) return '';
    // If it's already a string, assume it's the JSON string from DB or simple text
    // If it's an object (e.g., if API parsed it, though our API sends it as string from DB), stringify it
    if (typeof addressValue === 'object') {
      return JSON.stringify(addressValue);
    }
    return String(addressValue);
  }

  // Helper to determine the field name for the API from the main contact object
  function getContactFieldName(key: string): string {
    // Most fields on the main Contact object map directly
    return key;
  }
</script>

<div class="contact-detail p-4 bg-white dark:bg-gray-900 shadow-md rounded-lg">
  {#if $contactQuery.isLoading}
    <p class="text-gray-700 dark:text-gray-300">Loading contact details...</p>
  {:else if $contactQuery.isError}
    <p class="text-red-600 dark:text-red-400">
      Error loading contact: {$contactQuery.error?.message || 'Unknown error'}
    </p>
  {:else if $contactQuery.data}
    {@const contact = $contactQuery.data}
    <h1 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
      {contact.Prefix || ''} {contact.FirstName || ''} {contact.LastName || ''} {contact.Suffix || ''}
      {#if contact.PreferredName}({contact.PreferredName}){/if}
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
      <EditableField label="First Name" dataType="Contact" fieldName="FirstName" value={contact.FirstName} contactId={contact.id} dataId={contact.id} queryClient={queryClient} />
      <EditableField label="Last Name" dataType="Contact" fieldName="LastName" value={contact.LastName} contactId={contact.id} dataId={contact.id} queryClient={queryClient} />
      <EditableField label="Preferred Name" dataType="Contact" fieldName="PreferredName" value={contact.PreferredName} contactId={contact.id} dataId={contact.id} queryClient={queryClient} />
      <EditableField label="Prefix" dataType="Contact" fieldName="Prefix" value={contact.Prefix} contactId={contact.id} dataId={contact.id} queryClient={queryClient} />
      <EditableField label="Suffix" dataType="Contact" fieldName="Suffix" value={contact.Suffix} contactId={contact.id} dataId={contact.id} queryClient={queryClient} />
      <EditableField label="Company" dataType="Contact" fieldName="Company" value={contact.Company} contactId={contact.id} dataId={contact.id} queryClient={queryClient} />
      <EditableField label="Job Title" dataType="Contact" fieldName="JobTitle" value={contact.JobTitle} contactId={contact.id} dataId={contact.id} queryClient={queryClient} />
      <EditableField label="Department" dataType="Contact" fieldName="Department" value={contact.Department} contactId={contact.id} dataId={contact.id} queryClient={queryClient} />
      <EditableField label="Birthday" dataType="Contact" fieldName="Birthday" value={contact.Birthday ? new Date(contact.Birthday).toISOString().split('T')[0] : null} contactId={contact.id} dataId={contact.id} queryClient={queryClient} />
      <EditableField label="Website" dataType="Contact" fieldName="Website" value={contact.Website} contactId={contact.id} dataId={contact.id} queryClient={queryClient} />
      <EditableField label="Source" dataType="Contact" fieldName="Source" value={contact.Source} contactId={contact.id} dataId={contact.id} queryClient={queryClient} />
      <EditableField label="Notes (Overall)" dataType="Contact" fieldName="Notes" value={contact.Notes} contactId={contact.id} dataId={contact.id} queryClient={queryClient} />
    </div>

    <!-- Related Entities -->
    {#each ['Names', 'EmailAddresses', 'PhoneNumbers', 'Addresses', 'Jobs', 'GithubProfiles', 'GameAccounts', 'StravaAccounts', 'NotesDetails'] as entityType}
      {@const items = contact[entityType] || []}
      {#if items.length > 0}
        <div class="mt-6">
          <h2 class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{entityType.replace(/([A-Z])/g, ' $1').trim()}</h2>
          {#each items as item, i}
            <div class="p-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              {#if entityType === 'Addresses'}
                <EditableField
                  label={`${item.type || item.name || entityType + ' ' + (i+1)} Value`}
                  dataType={'Addresses'}
                  fieldName={'value'}
                  value={formatAddressValue(item.value)}
                  contactId={contact.id}
                  dataId={item.id}
                  queryClient={queryClient} />
              {:else if entityType === 'Jobs'}
                 <EditableField label={`Company (${item.name || i+1})`} dataType={'Jobs'} fieldName={'company'} value={item.company} contactId={contact.id} dataId={item.id} queryClient={queryClient} />
                 <EditableField label={`Role (${item.name || i+1})`} dataType={'Jobs'} fieldName={'role'} value={item.role} contactId={contact.id} dataId={item.id} queryClient={queryClient} />
                 <EditableField label={`LinkedIn (${item.name || i+1})`} dataType={'Jobs'} fieldName={'linkedInUsername'} value={item.linkedInUsername} contactId={contact.id} dataId={item.id} queryClient={queryClient} />
              {:else if entityType === 'GithubProfiles' || entityType === 'GameAccounts' || entityType === 'StravaAccounts'}
                 <EditableField label={`Username (${item.name || item.platform || i+1})`} dataType={entityType} fieldName={'username'} value={item.username} contactId={contact.id} dataId={item.id} queryClient={queryClient} />
              {:else} <!-- Default for Names, EmailAddresses, PhoneNumbers, NotesDetails -->
                <EditableField
                  label={`${item.type || item.name || entityType + ' ' + (i+1)} Value`}
                  dataType={entityType}
                  fieldName={'value'}
                  value={item.value}
                  contactId={contact.id}
                  dataId={item.id}
                  queryClient={queryClient} />
              {/if}

              <!-- Common editable 'type' or 'name' field for related items where applicable -->
              {#if item.hasOwnProperty('type')}
                <EditableField label={`Type`} dataType={entityType} fieldName={'type'} value={item.type} contactId={contact.id} dataId={item.id} queryClient={queryClient} />
              {/if}
              {#if item.hasOwnProperty('name') && entityType !== 'Jobs' && entityType !== 'GithubProfiles' && entityType !== 'GameAccounts' && entityType !== 'StravaAccounts'}
                 <EditableField label={`Label/Name`} dataType={entityType} fieldName={'name'} value={item.name} contactId={contact.id} dataId={item.id} queryClient={queryClient} />
              {/if}
            </div>
          {/each}
        </div>
      {/if}
       <!-- TODO: Button to add new items for each entityType -->
    {/each}

    <div class="mt-6 text-xs text-gray-500 dark:text-gray-400">
      <p>Contact ID: {contact.id}</p>
      <p>Created At: {new Date(contact.createdAt).toLocaleString()}</p>
      <p>Last Updated: {new Date(contact.updatedAt).toLocaleString()}</p>
    </div>

  {/if}
</div>

<style>
  .contact-detail {
    max-width: 800px;
    margin: auto;
  }
</style>

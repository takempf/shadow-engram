import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readable } from 'svelte/store'; // Added readable import
import ContactDetail from './ContactDetail.svelte'; // Re-enabled
import { QueryClient } from '@tanstack/svelte-query';

// Mock createQuery from @tanstack/svelte-query
const mockCreateQuery = vi.fn();

// Mock EditableField component as its detailed testing is separate
vi.mock('./EditableField.svelte', () => ({
  default: vi.fn().mockImplementation(() => ({
    // Mock Svelte component lifecycle methods if needed, or just be an empty object
  })),
}));

vi.mock('@tanstack/svelte-query', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    createQuery: (options: any, client: any) => mockCreateQuery(options, client),
    QueryClient: vi.fn(() => ({
      invalidateQueries: vi.fn(),
    })),
  };
});


describe('ContactDetail.svelte', () => { // Re-enabled full describe block
  const contactId = 123;
  let mockQueryClientInstance: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    mockQueryClientInstance = new QueryClient();
    // Reset mockCreateQuery to a default implementation for each test
    // Default mock implementation can be a generic loading state store
    mockCreateQuery.mockImplementation((options) =>
      readable({ data: null, isLoading: true, isError: false, error: null })
    );
  });

  it('displays a loading message when query is loading', () => {
    // Specific mock for this test case, ensuring it returns a store
    mockCreateQuery.mockReturnValue(readable({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    }));

    render(ContactDetail, { contactId, queryClient: mockQueryClientInstance });
    expect(screen.getByText('Loading contact details...')).toBeInTheDocument();
  });

  it('displays an error message when query has an error', () => {
    const errorMessage = 'Failed to fetch';
    // Specific mock for this test case
    mockCreateQuery.mockReturnValue(readable({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error(errorMessage),
    }));

    render(ContactDetail, { contactId, queryClient: mockQueryClientInstance });
    // Adjust to find the full error message string or use a regex
    expect(screen.getByText(`Error loading contact: ${errorMessage}`)).toBeInTheDocument();
  });

  it('renders contact details when data is fetched successfully', async () => {
    const mockContactData = {
      id: contactId,
      FirstName: 'John',
      LastName: 'Doe',
      Prefix: 'Mr.',
      Suffix: 'Jr.',
      PreferredName: 'Johnny',
      Company: 'TestCorp',
      JobTitle: 'Tester',
      Department: 'QA',
      Birthday: '1990-01-01',
      Website: 'https://johndoe.com',
      Source: 'Referral',
      Notes: 'Overall notes here.',
      Names: [{ id: 1, value: 'Johnathan Doe', type: 'Full Legal Name', name: 'Legal', contactId }],
      EmailAddresses: [{ id: 1, value: 'john@example.com', type: 'Work', contactId }],
      PhoneNumbers: [{ id: 1, value: '123-456-7890', type: 'Mobile', contactId }],
      Addresses: [{ id: 1, value: JSON.stringify({ street: '123 Main', city: 'Testville' }), type: 'Home', contactId }],
      NotesDetails: [{id:1, value: "Specific note one", name: "Detail Note 1", contactId}],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockCreateQuery.mockReturnValue(readable({ // Ensure this returns a readable store
      data: mockContactData,
      isLoading: false,
      isError: false,
      error: null,
    }));

    render(ContactDetail, { contactId, queryClient: mockQueryClientInstance });

    expect(screen.getByRole('heading', { name: /Mr. John Doe Jr. \(Johnny\)/i })).toBeInTheDocument();

    // EditableField is mocked to render nothing, so we cannot assert for labels rendered by it.
    // We can assert that ContactDetail renders section headings.
    expect(screen.getByRole('heading', { name: /Names/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Email Addresses/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Phone Numbers/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Addresses$/i })).toBeInTheDocument(); // More specific regex
    expect(screen.getByRole('heading', { name: /Notes Details/i })).toBeInTheDocument();

    // Assertions for data directly rendered by ContactDetail (not via EditableField's label prop)
    expect(screen.getByText(/Contact ID: 123/)).toBeInTheDocument(); // Use regex to find '123' within the text node
    expect(screen.getByText(/Created At:/)).toBeInTheDocument();
    expect(screen.getByText(/Last Updated:/)).toBeInTheDocument();

  });

  it('uses the contactId prop in the queryKey for createQuery', () => {
    render(ContactDetail, { contactId, queryClient: mockQueryClientInstance });

    expect(mockCreateQuery).toHaveBeenCalled();
    const callOptions = mockCreateQuery.mock.calls[0][0];
    expect(callOptions.queryKey).toEqual(['contact', contactId]);
  });

});

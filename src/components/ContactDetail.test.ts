import { render, screen, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ContactDetail from './ContactDetail.svelte';
import { QueryClient } from '@tanstack/svelte-query'; // Actual QueryClient for type, but will be mocked

// Mock createQuery from @tanstack/svelte-query
const mockCreateQuery = vi.fn();

// Mock EditableField component as its detailed testing is separate
vi.mock('./EditableField.svelte', () => ({
  default: vi.fn().mockImplementation(() => ({
    // Mock Svelte component lifecycle methods if needed, or just be an empty object
    // For testing presence, it's enough that it's called.
    // If we need to check props, we might need a more sophisticated mock or use actual component.
    // For now, let's assume it's a simple placeholder for counting/prop checking.
    // This is a basic stub.
  })),
}));
// A more robust way to check props would be to extract them if @testing-library/svelte allows,
// or use a more advanced mocking technique for Svelte components.
// For now, we'll rely on checking if ContactDetail passes props by observing createQuery mock.

vi.mock('@tanstack/svelte-query', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    createQuery: (options: any, client: any) => mockCreateQuery(options, client),
    QueryClient: vi.fn(() => ({ // Mock QueryClient constructor
      invalidateQueries: vi.fn(),
      // other methods if needed by ContactDetail directly (likely not)
    })),
  };
});


describe('ContactDetail.svelte', () => {
  const contactId = 123;
  let mockQueryClientInstance: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    mockQueryClientInstance = new QueryClient(); // Instantiate our mock-ready QueryClient
     // Reset mockCreateQuery to a default implementation for each test
    mockCreateQuery.mockImplementation((options) => ({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
        subscribe: vi.fn(() => () => {}), // Basic subscribe mock
    }));
  });

  it('displays a loading message when query is loading', () => {
    mockCreateQuery.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      subscribe: vi.fn(() => () => {}),
    });

    render(ContactDetail, { contactId, queryClient: mockQueryClientInstance });
    expect(screen.getByText('Loading contact details...')).toBeInTheDocument();
  });

  it('displays an error message when query has an error', () => {
    const errorMessage = 'Failed to fetch';
    mockCreateQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error(errorMessage),
      subscribe: vi.fn(() => () => {}),
    });

    render(ContactDetail, { contactId, queryClient: mockQueryClientInstance });
    expect(screen.getByText(/Error loading contact:/)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
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
      Names: [{ id: 1, value: 'Johnathan Doe', type: 'Full Legal Name', contactId }],
      EmailAddresses: [{ id: 1, value: 'john@example.com', type: 'Work', contactId }],
      PhoneNumbers: [{ id: 1, value: '123-456-7890', type: 'Mobile', contactId }],
      Addresses: [{ id: 1, value: JSON.stringify({ street: '123 Main', city: 'Testville' }), type: 'Home', contactId }],
      NotesDetails: [{id:1, value: "Specific note one", name: "Detail Note 1", contactId}],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockCreateQuery.mockReturnValue({
      data: mockContactData,
      isLoading: false,
      isError: false,
      error: null,
      subscribe: vi.fn(() => () => {}),
    });

    const { container } = render(ContactDetail, { contactId, queryClient: mockQueryClientInstance });

    // Check for presence of some key fields
    expect(screen.getByRole('heading', { name: /Mr. John Doe Jr. \(Johnny\)/i })).toBeInTheDocument();

    // Check if EditableField was called for some fields.
    // This relies on EditableField being mocked. We can't directly see props of mocked Svelte components easily.
    // Instead, we check if the data that would be passed to EditableField is displayed or parts of it.
    // Since EditableField is mocked to be nothing, we look for labels that ContactDetail renders *around* EditableField.

    // For Contact fields:
    expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'label' && content.startsWith('First Name'))).toBeInTheDocument();
    expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'label' && content.startsWith('Last Name'))).toBeInTheDocument();
    expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'label' && content.startsWith('Company'))).toBeInTheDocument();

    // For related entities:
    // Check section headers
    expect(screen.getByRole('heading', { name: /Names/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Email Addresses/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Phone Numbers/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Addresses/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Notes Details/i })).toBeInTheDocument();

    // Check labels for specific related items (these labels are constructed in ContactDetail)
    // This implies EditableField would be rendered for these.
    expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'label' && content.includes('Full Legal Name Value'))).toBeInTheDocument();
    expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'label' && content.includes('Work Value'))).toBeInTheDocument(); // For email
    expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'label' && content.includes('Mobile Value'))).toBeInTheDocument(); // For phone
    expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'label' && content.includes('Home Value'))).toBeInTheDocument(); // For address
    expect(screen.getByText((content, element) => element?.tagName.toLowerCase() === 'label' && content.includes('Detail Note 1 Value'))).toBeInTheDocument(); // For NotesDetails

    // Check timestamps
    expect(screen.getByText(/Contact ID:/)).toBeInTheDocument();
    expect(screen.getByText(contactId.toString())).toBeInTheDocument();
    expect(screen.getByText(/Created At:/)).toBeInTheDocument();
    expect(screen.getByText(/Last Updated:/)).toBeInTheDocument();

  });

  it('uses the contactId prop in the queryKey for createQuery', () => {
    render(ContactDetail, { contactId, queryClient: mockQueryClientInstance });

    // Check that createQuery was called with a queryKey that includes the contactId
    expect(mockCreateQuery).toHaveBeenCalled();
    const callOptions = mockCreateQuery.mock.calls[0][0]; // First argument of the first call
    expect(callOptions.queryKey).toEqual(['contact', contactId]);
  });

});

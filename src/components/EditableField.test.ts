import { render, fireEvent, screen, act } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EditableField from './EditableField.svelte';
import { QueryClient } from '@tanstack/svelte-query';

// Mock createMutation from @tanstack/svelte-query
const mockMutate = vi.fn();
const mockCreateMutation = vi.fn(() => ({
  mutate: mockMutate,
  isLoading: false,
  isError: false,
  error: null,
}));

vi.mock('@tanstack/svelte-query', async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    createMutation: (options: any) => mockCreateMutation(options), // Ensure options are passed to allow spying on them
    QueryClient: vi.fn(() => ({ // Mock QueryClient constructor
      invalidateQueries: vi.fn(),
    })),
  };
});


describe('EditableField.svelte', () => {
  let mockQueryClientInstance: QueryClient;

  const defaultProps = {
    value: 'Initial Value',
    fieldName: 'TestField',
    contactId: 1,
    dataId: 10,
    dataType: 'Names',
    label: 'Test Label',
  };

  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
    // Create a new mock QueryClient instance for each test to ensure isolation
    mockQueryClientInstance = new QueryClient();
  });

  it('renders the initial value and label', () => {
    render(EditableField, { ...defaultProps, queryClient: mockQueryClientInstance });

    expect(screen.getByText('Test Label:')).toBeInTheDocument();
    expect(screen.getByText('Initial Value')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument(); // Input should not be visible initially
  });

  it('switches to input mode on click', async () => {
    render(EditableField, { ...defaultProps, queryClient: mockQueryClientInstance });

    const displayElement = screen.getByText('Initial Value');
    await fireEvent.click(displayElement);

    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('Initial Value');
  });

  it('calls mutation with correct parameters on input change and blur', async () => {
    render(EditableField, { ...defaultProps, queryClient: mockQueryClientInstance });

    // Click to enter edit mode
    await fireEvent.click(screen.getByText('Initial Value'));

    const inputElement = screen.getByRole('textbox') as HTMLInputElement;
    await fireEvent.input(inputElement, { target: { value: 'Updated Value' } });
    expect(inputElement.value).toBe('Updated Value'); // Ensure Svelte's bind:value has updated

    await fireEvent.blur(inputElement);

    expect(mockCreateMutation).toHaveBeenCalled(); // Check if createMutation itself was called
    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith({
      contactId: defaultProps.contactId,
      dataType: defaultProps.dataType,
      dataId: defaultProps.dataId,
      field: defaultProps.fieldName,
      newValue: 'Updated Value',
    });
  });

  it('calls mutation on Enter key press', async () => {
    render(EditableField, { ...defaultProps, queryClient: mockQueryClientInstance });

    await fireEvent.click(screen.getByText('Initial Value'));
    const inputElement = screen.getByRole('textbox');
    await fireEvent.input(inputElement, { target: { value: 'New Value via Enter' } });
    await fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });

    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith(expect.objectContaining({ newValue: 'New Value via Enter' }));
  });

  it('does not call mutation if value is unchanged', async () => {
    render(EditableField, { ...defaultProps, queryClient: mockQueryClientInstance });

    await fireEvent.click(screen.getByText('Initial Value'));
    const inputElement = screen.getByRole('textbox');
    await fireEvent.blur(inputElement); // Blur without changing value

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('reverts to display mode on Escape key press', async () => {
    render(EditableField, { ...defaultProps, queryClient: mockQueryClientInstance });

    await fireEvent.click(screen.getByText('Initial Value'));
    const inputElement = screen.getByRole('textbox')  as HTMLInputElement;
    await fireEvent.input(inputElement, { target: { value: 'Temporary Value' } });
    await fireEvent.keyDown(inputElement, { key: 'Escape', code: 'Escape' });

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByText('Initial Value')).toBeInTheDocument(); // Should revert to original value display
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('invalidates queries on successful mutation', async () => {
    // Redefine mockCreateMutation for this specific test to simulate success path
    const specificMockMutate = vi.fn();
    const successMockCreateMutation = vi.fn((options: any) => {
      // Simulate calling onSuccess
      const originalOnSuccess = options.onSuccess;
      specificMockMutate.mockImplementation((vars) => {
        // Call original onSuccess with dummy data if it exists
        if (originalOnSuccess) originalOnSuccess({ status: 'success' });
      });
      return {
        mutate: specificMockMutate,
        isLoading: false,
        isError: false,
      };
    });
    // vi.mocked(mockCreateMutation).mockImplementation(successMockCreateMutation as any);
    // Instead of the above, directly assign to the mock fn used by the vi.mock factory
    (mockCreateMutation as ReturnType<typeof vi.fn>).mockImplementation(successMockCreateMutation);


    render(EditableField, { ...defaultProps, queryClient: mockQueryClientInstance });

    await fireEvent.click(screen.getByText('Initial Value'));
    const inputElement = screen.getByRole('textbox');
    await fireEvent.input(inputElement, { target: { value: 'Success Test' } });
    await fireEvent.blur(inputElement);

    expect(specificMockMutate).toHaveBeenCalled();
    expect(mockQueryClientInstance.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['contact', defaultProps.contactId] });
  });

  // TODO: Test loading state display (if mutation.isLoading is true)
  // TODO: Test error state display (if mutation.isError is true and error message is shown)
});

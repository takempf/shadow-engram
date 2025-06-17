<script lang="ts">
  import { createMutation, type QueryClient } from '@tanstack/svelte-query';

  export let value: string | undefined | null;
  export let fieldName: string; // The actual column name in the DB table
  export let contactId: number; // ID of the parent contact
  export let dataId: number; // ID of the specific data item being edited (e.g., email_id, address_id, or contact_id if editing Contact table)
  export let dataType: string; // Table name like 'Names', 'EmailAddresses', 'Contact'
  export let label: string;
  export let queryClient: QueryClient; // Pass QueryClient for invalidation

  let editing = false;
  let inputValue = value;

  // Ensure inputValue reflects external changes to `value` when not editing
  $: if (!editing) {
    inputValue = value;
  }

  const mutation = createMutation({
    mutationFn: async (variables: {
      contactId: number;
      dataType: string;
      dataId: number;
      field: string;
      newValue: string | undefined | null;
    }) => {
      const response = await fetch('/api/contacts/data', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variables),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        throw new Error(errorData.message || `Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate the contact query to refetch and show updated data
      // This will trigger a refresh in ContactDetail.svelte
      queryClient.invalidateQueries({ queryKey: ['contact', contactId] });
      editing = false;
      // `value` prop will be updated by Svelte when parent re-renders due to query refresh
    },
    onError: (error: Error) => {
      console.error('Error updating field:', error.message);
      // Optionally, revert inputValue or show an error message to the user
      inputValue = value; // Revert to original value on error
      editing = false;
      // Consider a more user-friendly error display than just console.error
    }
  });

  function handleFocus() {
    editing = true;
    inputValue = value; // Initialize with current value when starting to edit
  }

  function handleSubmit() {
    if (inputValue !== value) {
      mutation.mutate({ contactId, dataType, dataId, field: fieldName, newValue: inputValue });
    } else {
      editing = false; // No change, just exit editing mode
    }
  }

  function handleBlur() {
    // Delay blur slightly to allow click on potential save/cancel buttons or error messages
    // For now, direct submit
    handleSubmit();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    } else if (event.key === 'Escape') {
      editing = false;
      inputValue = value; // Revert on escape
    }
  }
</script>

<div class="editable-field mb-1">
  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400">{label}:</label>
  {#if editing}
    <input
      type="text"
      bind:value={inputValue}
      on:blur={handleBlur}
      on:keydown={handleKeydown}
      class="mt-1 block w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
      aria-label={`Edit ${label}`}
      autofocus
    />
  {:else}
    <div
      class="mt-1 block w-full px-2 py-1 min-h-[30px] border border-transparent rounded-md hover:border-gray-300 dark:hover:border-gray-600 cursor-text text-sm text-gray-800 dark:text-gray-200"
      on:click={handleFocus}
      on:focus={handleFocus}
      tabindex="0"
      role="button"
      aria-label={`Value for ${label}`}
      title="Click to edit"
    >
      {value || <span class="text-gray-400 dark:text-gray-500 italic">N/A</span>}
    </div>
  {/if}

  {#if mutation.isLoading}
    <p class="text-xs text-gray-500 dark:text-gray-400">Saving...</p>
  {/if}
  {#if mutation.isError}
    <p class="text-xs text-red-500 dark:text-red-400">Error: {mutation.error?.message || 'Could not save.'}</p>
  {/if}
</div>

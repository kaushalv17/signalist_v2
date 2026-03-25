import { Inngest } from 'inngest';

// Single Inngest client instance shared across the app.
// The `id` must match what you register in the Inngest dashboard.
export const inngest = new Inngest({
  id: 'signalist',
  // In production Inngest reads INNGEST_EVENT_KEY automatically.
  // Locally the dev-server handles auth without a key.
});

import { cache } from 'react';
import { client } from './sanity.client';

// barely using this right now but good to have
// might do more caching stuff later
export const getCachedClient = cache(() => client);

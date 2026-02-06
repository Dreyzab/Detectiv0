import { treaty } from '@elysiajs/eden';
import type { App } from '../../../../server/src/index';

/**
 * Eden Treaty Client
 * Provides end-to-end type safety for API calls.
 */
export const api = treaty<App>('http://localhost:3000');

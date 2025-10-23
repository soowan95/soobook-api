import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContextStore {
  ip?: string;
}

export const requestContext = new AsyncLocalStorage<RequestContextStore>();

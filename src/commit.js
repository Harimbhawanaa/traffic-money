import { isStateShapeValid } from './store.js';

/** Persist first; only return a new active state after a successful write. */
export function commitState(state, mutator, persist) {
  try {
    const next = structuredClone(state);
    mutator(next);
    if (!isStateShapeValid(next)) return { state, errorType: 'validation' };
    try {
      persist(next);
    } catch {
      return { state, errorType: 'storage' };
    }
    return { state: next, errorType: null };
  } catch {
    return { state, errorType: 'internal' };
  }
}

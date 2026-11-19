import { describe, it, expect, vi } from 'vitest';
import { createExampleState, validateTransaction, validateCategory, getTotals, getBudgetUsage, saveState } from '../src/store.js';
import { commitState } from '../src/commit.js';

describe('security: invalid input', () => {
  const state = createExampleState();
  const category = state.categories[0];
  const transaction = { type: category.type, categoryId: category.id, amount: 100, date: '2026-11-19', note: '' };
  it('rejects null note without throwing', () => expect(() => validateTransaction({...transaction, note: null}, state.categories)).not.toThrow());
  it('reports invalid note type', () => expect(validateTransaction({...transaction, note: null}, state.categories)).toBeTruthy());
  it('rejects null category name without throwing', () => expect(() => validateCategory({type:'expense',name:null},state.categories)).not.toThrow());
  it('reports invalid category name type', () => expect(validateCategory({type:'expense',name:null},state.categories)).toBeTruthy());
  it('rejects malformed transaction objects without throwing', () => expect(() => validateTransaction(null,state.categories)).not.toThrow());
});
describe('security: safe financial arithmetic', () => {
  it('rejects income accumulation above safe integer', () => expect(() => getTotals([{type:'income',amount:Number.MAX_SAFE_INTEGER},{type:'income',amount:2}])).toThrow());
  it('rejects unsafe budget spending accumulation', () => expect(() => getBudgetUsage({amount:100,year:2026,month:11,categoryId:'c'},[{type:'expense',categoryId:'c',date:'2026-11-01',amount:Number.MAX_SAFE_INTEGER},{type:'expense',categoryId:'c',date:'2026-11-02',amount:2}])).toThrow());
  it('keeps normal totals correct', () => expect(getTotals([{type:'income',amount:200},{type:'expense',amount:80}]).balance).toBe(120));
});
describe('security: atomic commit and error classification', () => {
  it('preserves active state when persistence fails', () => {
    const state = createExampleState();
    const write = vi.fn(() => { throw new DOMException('Quota exceeded','QuotaExceededError'); });
    const result = commitState(state, next => { next.transactions.push({...next.transactions[0],id:'extra'}); }, write);
    expect(result.state).toBe(state);
    expect(result.errorType).toBe('storage');
  });
  it('classifies validation failures separately from storage failures', () => {
    const state = createExampleState();
    const result = commitState(state, next => { next.transactions[0].amount = 0; }, saveState);
    expect(result.errorType).toBe('validation');
  });
});

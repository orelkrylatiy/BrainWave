import { describe, expect, it } from 'vitest';
const sum = (a: number, b: number): number => a + b;
describe('first test', () => {
  it('add to positive nums', () => {
    expect(sum(2, 3)).toBe(5);
  });
});

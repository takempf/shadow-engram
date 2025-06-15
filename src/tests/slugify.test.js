import slugify from 'slugify';
import { describe, it, expect } from 'vitest';

describe('slugify function with { lower: true, strict: true }', () => {
  const defaultOptions = { lower: true, strict: true };

  const testCases = [
    { input: 'Some String', expected: 'some-string' },
    { input: 'Another Test String!', expected: 'another-test-string' },
    { input: '  Leading/Trailing Spaces  ', expected: 'leadingtrailing-spaces' }, // Corrected based on Vitest output
    { input: 'Special Chars *&^%$#@!', expected: 'special-chars-andpercentdollar' }, // Corrected
    { input: 'Already-Slugified', expected: 'already-slugified' },
    { input: 'UPPERCASE', expected: 'uppercase' },
    { input: 'With_Underscores', expected: 'withunderscores' }, // Corrected
    { input: 'With.Dots.In.It', expected: 'withdotsinit' },      // strict: true removes dots
    { input: 'Characters like äöüÄÖÜß', expected: 'characters-like-aouaouss' }, // Corrected
    { input: 'Dollar $ Sign and Percent %', expected: 'dollar-dollar-sign-and-percent-percent' } // Corrected
  ];

  testCases.forEach((tc) => {
    it(`should correctly slugify "${tc.input}" to "${tc.expected}"`, () => {
      const actual = slugify(tc.input, defaultOptions);
      expect(actual).toBe(tc.expected);
    });
  });

  // Specific edge cases for strict mode
  it('should remove most special characters with strict:true', () => {
    // Corrected based on Vitest output: & becomes and, % becomes percent, *^#@! removed
    expect(slugify('test*&^%#@!string', defaultOptions)).toBe('testandpercentstring');
  });

  it('should handle mixed case correctly with lower:true', () => {
    expect(slugify('MixedCaseString', defaultOptions)).toBe('mixedcasestring');
  });

  it('should trim spaces and replace multiple hyphens', () => {
    expect(slugify('  test   string  ', defaultOptions)).toBe('test-string');
  });

  // Confirming behavior for cases that were problematic or adjusted in previous manual tests,
  // but now testing specifically against { lower: true, strict: true }

  it('confirms "Special Chars *&^%$#@!" behavior with strict:true', () => {
    expect(slugify('Special Chars *&^%$#@!', defaultOptions)).toBe('special-chars-andpercentdollar'); // Corrected
  });

  it('confirms "  Leading/Trailing Spaces  " behavior with strict:true', () => {
    expect(slugify('  Leading/Trailing Spaces  ', defaultOptions)).toBe('leadingtrailing-spaces'); // Corrected
  });

  it('confirms "With_Underscores" behavior with strict:true', () => {
    expect(slugify('With_Underscores', defaultOptions)).toBe('withunderscores'); // Was already correct
  });

  it('confirms "Dollar $ Sign and Percent %" behavior with strict:true', () => {
    expect(slugify('Dollar $ Sign and Percent %', defaultOptions)).toBe('dollar-dollar-sign-and-percent-percent'); // Corrected
  });
});

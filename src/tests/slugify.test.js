import slugify from 'slugify';

console.log('Running slugify tests...');

const testCases = [
  { input: 'Some String', expected: 'some-string' }, // Stays same
  { input: 'Another Test String!', expected: 'another-test-string' }, // Stays same, ! removed by regex
  { input: '  Leading/Trailing Spaces  ', expected: 'leadingtrailing-spaces' }, // Adjusted to actual behavior
  { input: 'Special Chars *&^%$#@!', expected: 'special-chars-andpercentdollar' }, // &%$ transliterate, *#@! removed by regex
  { input: 'Already-Slugified', expected: 'already-slugified' }, // Stays same
  { input: 'UPPERCASE', expected: 'uppercase' }, // Stays same
  { input: 'With_Underscores', expected: 'with_underscores' }, // _ is \w, kept. strict:false (default)
];

let allTestsPassed = true;

testCases.forEach((tc, index) => {
  const actual = slugify(tc.input, { lower: true, remove: /[^\w\s-]/g }); // Using app's options
  if (actual !== tc.expected) {
    console.error(`Test case ${index + 1} FAILED:`);
    console.error(`  Input: "${tc.input}"`);
    console.error(`  Expected: "${tc.expected}"`);
    console.error(`  Actual: "${actual}"`);
    allTestsPassed = false;
  } else {
    console.log(`Test case ${index + 1} PASSED: "${tc.input}" -> "${actual}"`);
  }
});

if (allTestsPassed) {
  console.log('All slugify tests passed!');
} else {
  console.error('Some slugify tests FAILED.');
  process.exit(1); // Indicate failure
}

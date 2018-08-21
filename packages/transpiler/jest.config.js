module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  automock: false,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__fixtures__/',
    '/utils/',
    '/spec.ts'
  ],
  setupFiles: ['<rootDir>/__test__/utils/setup.ts']
}

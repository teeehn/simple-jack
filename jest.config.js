/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/*.(test|spec).+(ts|tsx|js)'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            useESM: true
        }],
        '^.+\\.(js|jsx)$': ['ts-jest', {
            useESM: true
        }]
    },
    collectCoverageFrom: [
        'src/**/*.{ts,tsx,js,jsx}',
        '!src/**/*.d.ts',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    }
};

module.exports = config;

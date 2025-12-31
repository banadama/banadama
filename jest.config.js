module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^jose$': '<rootDir>/__mocks__/joseMock.js',
    },
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.jest.json',
        }],
    },
    transformIgnorePatterns: ["/node_modules/(?!@?some-esm-package)"],
    setupFiles: ['<rootDir>/jest.setup.js'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.jest.json',
            diagnostics: { warnOnly: true }
        }
    }
};

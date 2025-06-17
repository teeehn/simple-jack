module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};

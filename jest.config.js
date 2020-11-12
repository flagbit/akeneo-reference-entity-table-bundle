module.exports = {
    verbose: true,
    rootDir: './',
    testURL: 'http://localhost/',
    testMatch: ['**/jest/**/*.test.(js|ts|tsx)'],
    moduleNameMapper: {
        'akeneoreferenceentity\/(.+)': '<rootDir>/vendor/akeneo/pim-enterprise-dev/src/Akeneo/ReferenceEntity/front/$1.ts'
    },
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
};

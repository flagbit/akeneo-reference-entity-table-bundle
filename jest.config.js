module.exports = {
    verbose: true,
    rootDir: './',
    testURL: 'http://localhost/',
    testMatch: ['**/jest/**/*.test.(js|ts|tsx)'],
    moduleNameMapper: {
        'akeneoreferenceentity\/(.+)': '<rootDir>/vendor/akeneo/pim-enterprise-dev/src/Akeneo/ReferenceEntity/front/$1',
        'pimui\/(.+)': '<rootDir>/vendor/akeneo/pim-community-dev/src/Akeneo/Platform/Bundle/UIBundle/Resources/public/$1'
    },
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    setupFiles: [
        `<rootDir>/vendor/akeneo/pim-community-dev/tests/front/unit/jest/enzyme.js`,
        `<rootDir>/jest/mock-fix.ts`
    ],
};

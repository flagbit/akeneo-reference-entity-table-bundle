module.exports = {
    verbose: true,
    rootDir: './',
    testURL: 'http://localhost/',
    testMatch: ['**/jest/**/*.test.(js|ts|tsx)'],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
};

// @ts-ignore jQuery is used in vendor/akeneo/pim-community-dev/src/Akeneo/Platform/Bundle/UIBundle/Resources/public/lib/select2/select2.js
global.jQuery = require('jquery');
jest.mock('pim/user-context', () => {});

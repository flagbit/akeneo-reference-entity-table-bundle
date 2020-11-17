import * as React from 'react';
import renderType from "./test-helper";

jest.mock('akeneoreferenceentity/tools/translator');

describe('Text type', function () {
    test('Default rendering', function () {
        const renderedAttributeType = renderType({}, 'text', jest.fn());

        expect(renderedAttributeType.key()).toBe('text0');
        expect(renderedAttributeType.text()).toBe('');
    });
});

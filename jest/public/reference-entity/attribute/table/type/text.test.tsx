import * as React from 'react';
import renderType from './test-helper';
import TextType from "../../../../../../src/Resources/public/reference-entity/attribute/table/type/text";

jest.mock('akeneoreferenceentity/tools/translator');

describe('Text type', function () {
    test('Default rendering', function () {
        const renderedAttributeType = renderType({}, new TextType('text'), jest.fn());

        expect(renderedAttributeType.key()).toBe('text0');
        expect(renderedAttributeType.text()).toBe('');
    });
});

import * as React from 'react';
import renderType from './test-helper';
import { NumberConfig } from '../../../../../../src/Resources/public/reference-entity/attribute/table/type/number';

jest.mock('akeneoreferenceentity/tools/translator');

describe('Text type', function () {
    test('Default rendering', function () {
        const renderedAttributeType = renderType({}, 'number', jest.fn());

        const select = renderedAttributeType.find('select');
        const optionList = select.find('option');

        expect(renderedAttributeType.key()).toBe('number0');
        expect(select.props().value).toBe('false');
        expect(optionList.at(0).props().value).toBe('true');
        expect(optionList.at(1).props().value).toBe('false');
    });

    test('Pre-set config', function () {
        const renderedAttributeType = renderType({ decimal: 'true' }, 'number', jest.fn());

        const select = renderedAttributeType.find('select');

        expect(select.props().value).toBe('true');
    });

    test('Change decimal config', function () {
        const onchange = jest.fn();
        const renderedAttributeType = renderType({}, 'number', onchange);

        const select = renderedAttributeType.find('select');

        select.simulate('change', { target: { value: 'true' } });

        const expectedConfig: NumberConfig = {
            decimal: 'true',
        };

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toStrictEqual(expectedConfig);
        expect(onchange.mock.calls[0][1]).toBe(0);
    });
});

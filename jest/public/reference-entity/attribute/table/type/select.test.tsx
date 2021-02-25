import * as React from 'react';
import renderType from './test-helper';
import { SelectConfig } from '../../../../../../src/Resources/public/reference-entity/attribute/table/type/select';

jest.mock('akeneoreferenceentity/tools/translator');

describe('Text type', function () {
    test('Default rendering', function () {
        const renderedAttributeType = renderType({}, 'simple_select', jest.fn());

        const emptyOptionFields = renderedAttributeType.find('tbody').find('td').find('input');

        expect(renderedAttributeType.key()).toBe('simple_select0');

        // Modal is closed
        const modalSelector = renderedAttributeType.find('#flagbit_table_simple_select_0');
        expect(modalSelector.length).toBe(1);
        expect(modalSelector.props().style.display).toBe('none');
        expect(modalSelector.props().style.zIndex).toBe(1060);

        expect(emptyOptionFields.length).toBe(0);
    });

    test('Add empty option row on open modal and add them to React state', function () {
        const onchange = jest.fn();
        const renderedAttributeType = renderType({}, 'simple_select', onchange);

        const modalButton = renderedAttributeType.find('button').at(0);
        modalButton.simulate('click');

        const expectedConfig: SelectConfig = { options: [{ code: '', value: '' }] };

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toStrictEqual(expectedConfig);
        expect(onchange.mock.calls[0][1]).toBe(0);
    });

    test('Change value of row 1', function () {
        const onchange = jest.fn();
        const config: SelectConfig = { options: [{ code: 'code', value: 'oldvalue' }] };
        const renderedAttributeType = renderType(config, 'simple_select', onchange);

        const firstRowValueField = renderedAttributeType.find('tbody').find('input').at(1);
        firstRowValueField.simulate('change', { target: { value: 'foo' } });

        const expectedConfig: SelectConfig = {
            options: [
                { code: 'code', value: 'foo' },
                { code: '', value: '' },
            ],
        };

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toStrictEqual(expectedConfig);
        expect(onchange.mock.calls[0][1]).toBe(0);
    });

    test('Change code of row 1', function () {
        const onchange = jest.fn();
        const config: SelectConfig = { options: [{ code: 'oldcode', value: 'value' }] };
        const renderedAttributeType = renderType(config, 'simple_select', onchange);

        const firstRowValueField = renderedAttributeType.find('tbody').find('input').at(0);
        firstRowValueField.simulate('change', { target: { value: 'code' } });

        const expectedConfig: SelectConfig = {
            options: [
                { code: 'code', value: 'value' },
                { code: '', value: '' },
            ],
        };

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toStrictEqual(expectedConfig);
        expect(onchange.mock.calls[0][1]).toBe(0);
    });

    test('Remove single option', function () {
        const onchange = jest.fn();
        const config: SelectConfig = {
            options: [
                {
                    code: 'code1',
                    value: 'value2',
                },
                {
                    code: 'deletecode',
                    value: 'deletevalue',
                },
                {
                    code: 'code3',
                    value: 'value3',
                },
            ],
        };
        const renderedAttributeType = renderType(config, 'simple_select', onchange);

        const closeButton = renderedAttributeType.find('tbody').find('Close').at(1);
        closeButton.simulate('click');

        const expectedConfig: SelectConfig = {
            options: [
                {
                    code: 'code1',
                    value: 'value2',
                },
                {
                    code: 'code3',
                    value: 'value3',
                },
            ],
        };

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toStrictEqual(expectedConfig);
        expect(onchange.mock.calls[0][1]).toBe(0);
    });

    test('Clean all empty option rows on closing modal and add options to React state', function () {
        const onchange = jest.fn();
        const config: SelectConfig = {
            options: [
                {
                    code: '',
                    value: '',
                },
                {
                    code: 'code',
                    value: 'value',
                },
                {
                    code: '',
                    value: '',
                },
            ],
        };
        const renderedAttributeType = renderType(config, 'simple_select', onchange);

        const confirmChanges = renderedAttributeType.find('button.ok');
        confirmChanges.simulate('click');

        const expectedConfig: SelectConfig = {
            options: [
                {
                    code: 'code',
                    value: 'value',
                },
            ],
        };

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toStrictEqual(expectedConfig);
        expect(onchange.mock.calls[0][1]).toBe(0);
    });
});

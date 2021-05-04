import LocalizedSelect, {
    SelectConfig,
} from '../../../../../../src/Resources/public/reference-entity/attribute/table/type/localized-select';
import Locale, { ConcreteLocale } from 'akeneoreferenceentity/domain/model/locale';
import renderType from './test-helper';
import * as React from 'react';

jest.mock('akeneoreferenceentity/tools/translator');

describe('Localized Simple Select type', function () {
    test('Default rendering', function () {
        const onchange = jest.fn();

        const renderedRecordType = renderType(
            {} as SelectConfig,
            new LocalizedSelect('simple_select_localized'),
            onchange,
            createLocales()
        );

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toStrictEqual({ options: [] });
        expect(onchange.mock.calls[0][1]).toBe(0);

        // buttons rendering
        const buttons = renderedRecordType.find('button');
        expect(buttons.first().props().className).toBe('AknButton AknButton--apply'); // modal
        expect(buttons.last().props().className).toBe('AknButton AknButton--apply AknFullPage-ok ok confirm'); // confirm

        // th header rendering
        const tr = renderedRecordType.find('thead').find('tr');

        expect(tr.length).toBe(1);

        const th = tr.find('th');

        expect(th.at(0).text()).toBe('');
        expect(th.at(1).text()).toBe('de_DE');
        expect(th.at(2).text()).toBe('en_US');
    });

    test('Render options', function () {
        const renderedRecordType = renderType(getOptions(), new LocalizedSelect('simple_select_localized'), jest.fn(), createLocales());

        const tr = renderedRecordType.find('tbody').find('tr');
        expect(tr.length).toBe(2);

        const input = tr.find('input');

        expect(input.length).toBe(6);
        expect(input.at(0).props().value).toBe('a');
        expect(input.at(1).props().value).toBe('Ä');
        expect(input.at(2).props().value).toBe('A');

        expect(input.at(3).props().value).toBe('b');
        expect(input.at(4).props().value).toBe('');
        expect(input.at(5).props().value).toBe('B');
    });

    test('Change option value', function () {
        const onchange = jest.fn();
        const renderedRecordType = renderType(getOptions(), new LocalizedSelect('simple_select_localized'), onchange, createLocales());

        const tr = renderedRecordType.find('tbody').find('tr');
        const input = tr.find('input');

        input.at(2).simulate('change', { target: { value: 'C' } });

        const expectedOptions = getOptions();
        expectedOptions.options[0].values.en_US = 'C';
        expectedOptions.options.push({ code: '', values: {} });

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toStrictEqual(expectedOptions);
        expect(onchange.mock.calls[0][1]).toBe(0);
    });

    test('Change option value (with PHP json encode behaviour)', function () {
        const onchange = jest.fn();
        const options = getOptions();
        // @ts-ignore PHP encodes an empty array instead of object
        options.options[1].values = [];

        const renderedRecordType = renderType(options, new LocalizedSelect('simple_select_localized'), onchange, createLocales());

        const tr = renderedRecordType.find('tbody').find('tr');
        const input = tr.find('input');

        input.at(5).simulate('change', { target: { value: 'C' } });

        const expectedOptions = getOptions();
        expectedOptions.options[1] = { code: 'b', values: { en_US: 'C' } };
        expectedOptions.options.push({ code: '', values: {} });

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toStrictEqual(expectedOptions);
        expect(onchange.mock.calls[0][1]).toBe(0);
    });

    test('Change option code', function () {
        const onchange = jest.fn();
        const renderedRecordType = renderType(getOptions(), new LocalizedSelect('simple_select_localized'), onchange, createLocales());

        const tr = renderedRecordType.find('tbody').find('tr');
        const input = tr.find('input');

        input.at(0).simulate('change', { target: { value: 'c' } });

        const expectedOptions = getOptions();
        expectedOptions.options[0].code = 'c';
        expectedOptions.options.push({ code: '', values: {} });

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toStrictEqual(expectedOptions);
        expect(onchange.mock.calls[0][1]).toBe(0);
    });

    test('Open modal', function () {
        const onchange = jest.fn();

        const renderedRecordType = renderType(
            {} as SelectConfig,
            new LocalizedSelect('simple_select_localized'),
            onchange,
            createLocales()
        );

        const buttons = renderedRecordType.find('button');
        buttons.first().simulate('click');

        expect(onchange.mock.calls.length).toBe(2);
        expect(onchange.mock.calls[1][0]).toStrictEqual({ options: [{ code: '', values: {} }] });
        expect(onchange.mock.calls[1][1]).toBe(0);
    });

    test('Close modal', function () {
        const onchange = jest.fn();

        const renderedRecordType = renderType(
            {} as SelectConfig,
            new LocalizedSelect('simple_select_localized'),
            onchange,
            createLocales()
        );

        const buttons = renderedRecordType.find('button');
        buttons.first().simulate('click'); // open modal
        buttons.last().simulate('click'); // close modal

        expect(onchange.mock.calls.length).toBe(3);
        expect(onchange.mock.calls[2][0]).toStrictEqual({ options: [] });
        expect(onchange.mock.calls[2][1]).toBe(0);
    });

    test('Remove row', function () {
        const onchange = jest.fn();
        const renderedRecordType = renderType(getOptions(), new LocalizedSelect('simple_select_localized'), onchange, createLocales());

        const removeButton = renderedRecordType.find('.AknOptionEditor-remove');
        removeButton.at(0).simulate('click');

        const expectedOptions = getOptions();
        expectedOptions.options.shift();

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toStrictEqual(expectedOptions);
        expect(onchange.mock.calls[0][1]).toBe(0);
    });
});

function createLocales(): Locale[] {
    const localeDe: Locale = new ConcreteLocale('de_DE', 'de_DE', 'de', 'deutsch');

    const localeUs: Locale = new ConcreteLocale('en_US', 'en_US', 'en', 'english');

    return [localeDe, localeUs];
}

function getOptions(): SelectConfig {
    return {
        options: [
            {
                code: 'a',
                values: { de_DE: 'Ä', en_US: 'A' },
            },
            {
                code: 'b',
                values: { en_US: 'B' },
            },
        ],
    };
}

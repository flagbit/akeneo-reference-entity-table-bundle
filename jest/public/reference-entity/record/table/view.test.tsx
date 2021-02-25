import LocaleReference from 'akeneoreferenceentity/domain/model/locale-reference';
import Value from 'akeneoreferenceentity/domain/model/record/value';
import ChannelReference from 'akeneoreferenceentity/domain/model/channel-reference';
import { ConcreteTableAttribute, TableRow } from '../../../../../src/Resources/public/reference-entity/attribute/table/table';
import { TableData, TableDataRow } from '../../../../../src/Resources/public/reference-entity/record/table/table';
import { view } from '../../../../../src/Resources/public/reference-entity/record/table/view';
import * as React from 'react';
import { shallow } from 'enzyme';

describe('Record view', function () {
    test('Wrong attribute', function () {
        // @ts-ignore
        const ValueMock = jest.genMockFromModule('akeneoreferenceentity/domain/model/record/value').default;
        const value = new ValueMock();

        value.data = new (class {})();
        value.attribute = new (class {})();

        const ViewContent = () => view({ value: value, onChange: jest.fn(), locale: LocaleReference.create('de_DE') });

        const renderedView = shallow(<ViewContent />);

        expect(renderedView.exists('table')).toBeFalsy();
        expect(renderedView.exists('th')).toBeFalsy();
        expect(renderedView.exists('td')).toBeFalsy();
    });

    test('th labels', function () {
        const renderedView = renderView(jest.fn());

        const th = renderedView.find('th');

        expect(th.length).toBe(3);
        expect(th.at(0).text()).toBe('Wert');
        expect(th.at(1).text()).toBe('Zahl');
        expect(th.at(2).text()).toBe('[empty]');
    });

    test('td pre-set values from tabledata', function () {
        const renderedView = renderView(jest.fn());

        const td = renderedView.find('td');

        // form fields + delete row fields
        expect(td.length).toBe(12);

        const input = renderedView.find('input');

        // form fields with extra empty row for additional table data
        expect(input.length).toBe(9);

        expect(input.at(0).props().value).toBe('value1');
        expect(input.at(1).props().value).toBe('1');
        expect(input.at(2).props().value).toBe('');

        expect(input.at(3).props().value).toBe('value2');
        expect(input.at(4).props().value).toBe('2');
        expect(input.at(5).props().value).toBe('');

        expect(input.at(6).props().value).toBe('');
        expect(input.at(7).props().value).toBe('');
        expect(input.at(8).props().value).toBe('');
    });

    test('Renders delete-row buttons', function () {
        const renderedView = renderView(jest.fn());

        const closeButton = renderedView.find('td');

        expect(closeButton.at(3).children().html()).toMatch(/^<svg /);
        expect(closeButton.at(7).children().html()).toMatch(/^<svg /);
        // Empty row doesn't need a delete button
        expect(closeButton.at(11).html()).not.toContain('<svg ');
    });

    test('ValueUpdater binding for changing data works', function () {
        const onchange = jest.fn();
        const renderedView = renderView(onchange);

        const input = renderedView.find('input').at(2);

        input.simulate('change', { currentTarget: { value: 'foo' } });

        // Arguments of the call is tested in ValueUpdater
        expect(onchange.mock.calls.length).toBe(1);
    });

    test('ValueUpdater invokes delete-row on click', function () {
        const onchange = jest.fn();
        const renderedView = renderView(onchange);

        const removeButton = renderedView.find('td').at(3).children();

        global.confirm = () => true;

        removeButton.simulate('click');

        // Arguments of the call is tested in ValueUpdater
        expect(onchange.mock.calls.length).toBe(1);
    });
});

function renderView(onChange: (value: Value) => void) {
    const ViewContent = () => view({ value: createValue(), onChange: onChange, locale: LocaleReference.create('de_DE') });

    return shallow(<ViewContent />);
}

function createValue(): Value {
    const tableRows: TableRow[] = [
        {
            code: 'txt',
            labels: { de_DE: 'Wert', en_US: 'Value' },
            type: 'text',
            validations: [],
            config: {},
        },
        {
            code: 'int',
            labels: { de_DE: 'Zahl', en_US: 'Number' },
            type: 'text',
            validations: [],
            config: {},
        },
        {
            code: 'empty',
            labels: {},
            type: 'text',
            validations: [],
            config: {},
        },
    ];

    const tableData: TableDataRow[] = [
        {
            txt: 'value1',
            int: '1',
            empty: '',
        },
        {
            txt: 'value2',
            int: '2',
            empty: null,
        },
    ];

    const data = TableData.createFromNormalized(tableData);
    const attribute = ConcreteTableAttribute.createFromNormalized({
        identifier: 'id',
        reference_entity_identifier: 'refId',
        code: 'code',
        type: 'flagbit_table',
        labels: { de_DE: 'Tabelle', en_US: 'Table' },
        value_per_locale: false,
        value_per_channel: false,
        order: 1,
        is_required: false,
        table_property: tableRows,
    });

    // @ts-ignore
    const ValueMock = jest.genMockFromModule('akeneoreferenceentity/domain/model/record/value').default;
    const value = new ValueMock();

    value.data = data;
    value.attribute = attribute;

    return value;
}

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

        expect(th.length).toBe(4);
        expect(th.at(1).text()).toBe('Wert');
        expect(th.at(2).text()).toBe('Zahl');
        expect(th.at(3).text()).toBe('[empty]');
    });

    test('td pre-set values from tabledata', function () {
        const renderedView = renderView(jest.fn());

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

    test('Renders delete-row buttons at the end of rows', function () {
        const renderedView = renderView(jest.fn());

        const closeButton = renderedView.find('tr td:last-child');

        expect(closeButton.at(0).children().html()).toMatch(/^<svg /);
        expect(closeButton.at(1).children().html()).toMatch(/^<svg /);
        // Empty row doesn't need a delete button
        expect(closeButton.at(2).html()).not.toContain('<svg ');
    });

    test('Renders drag and drop symbol at the start of rows', function () {
        const renderedView = renderView(jest.fn());

        const dragAndDrop = renderedView.find('tr td:first-child i.icon-reorder');

        expect(dragAndDrop.length).toBe(2);

        const expectedHtml = '<i class="icon-reorder"></i>';

        expect(dragAndDrop.at(0).html()).toBe(expectedHtml);
        expect(dragAndDrop.at(1).html()).toBe(expectedHtml);
    });

    test('Drag and Drop of rows', function () {
        const onchange = jest.fn();
        const renderedView = renderView(onchange);

        const tr = renderedView.find('tbody tr');

        const preventDefaultOnDrop = jest.fn();
        const preventDefaultOnDragOver = jest.fn();

        tr.at(1).simulate('dragStart');
        tr.at(0).simulate('dragOver', { preventDefault: preventDefaultOnDragOver });
        tr.at(0).simulate('drop', { preventDefault: preventDefaultOnDrop });

        expect(preventDefaultOnDragOver.mock.calls.length).toBe(1);
        expect(preventDefaultOnDrop.mock.calls.length).toBe(1);

        const data = TableData.createFromNormalized([
            {
                txt: 'value2',
                int: '2',
                empty: null,
            },
            {
                txt: 'value1',
                int: '1',
                empty: '',
            },
        ]);
        const expected = Value.create(createAttribute(), ChannelReference.create(null), LocaleReference.create(null), data);

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toStrictEqual(expected);
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

        const removeButton = renderedView.find('tr td:last-child').at(0).children();

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

    return Value.create(createAttribute(), ChannelReference.create(null), LocaleReference.create(null), data);
}

function createAttribute(): ConcreteTableAttribute {
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

    return ConcreteTableAttribute.createFromNormalized({
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
}

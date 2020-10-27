import Value from 'akeneoreferenceentity/domain/model/record/value';
import ChannelReference from 'akeneoreferenceentity/domain/model/channel-reference';
import LocaleReference from 'akeneoreferenceentity/domain/model/locale-reference';
import {
    ConcreteTableAttribute,
    TableRow
} from '../../../../../../src/Resources/public/reference-entity/attribute/table/table';
import {TableDataRow, TableData} from "../../../../../../src/Resources/public/reference-entity/record/table/table";
import ValueUpdater from "../../../../../../src/Resources/public/reference-entity/record/table/value/value-updater";

describe('ValueUpdater', function () {
    test('Appends automatically empty row', function () {
        const tableRows: TableRow[] = [
            {
                code: 'my_code1',
                labels: {},
                type: 'text',
                validations: [],
                config: {},
            },
            {
                code: 'my_code2',
                labels: {},
                type: 'text',
                validations: [],
                config: {},
            }
        ];

        const emptyTableData: TableDataRow[] = [];

        const valueUpdater = new ValueUpdater(
            createValue(tableRows, emptyTableData),
            jest.fn()
        );

        const expected = [{
            my_code1: null,
            my_code2: null,
        }];

        expect(valueUpdater.tableDataRows).toStrictEqual(expected);
    });

    test('Filters automatically empty rows in between', function () {
        const tableRows: TableRow[] = [{
            code: 'my_code1',
            labels: {},
            type: 'text',
            validations: [],
            config: {},
        }, {
            code: 'my_code2',
            labels: {},
            type: 'text',
            validations: [],
            config: {},
        }];

        const dirtyTableData: TableDataRow[] = [
            {
                my_code1: 'value1',
                my_code2: 'value2',
            },
            {
                my_code1: null,
                my_code2: null,
            },
            {
                my_code1: null,
                my_code2: 'value2',
            },
            {
                my_code1: null,
                my_code2: null,
            },
            {
                my_code1: '',
                my_code2: '',
            },
            {
                my_code1: 'value1',
                my_code2: '',
            },
        ];

        const valueUpdater = new ValueUpdater(
            createValue(tableRows, dirtyTableData),
            jest.fn()
        );

        const expected = [
            {
                my_code1: 'value1',
                my_code2: 'value2',
            },
            {
                my_code1: null,
                my_code2: 'value2',
            },
            {
                my_code1: '',
                my_code2: '',
            },
            {
                my_code1: 'value1',
                my_code2: '',
            },
            {
                my_code1: null,
                my_code2: null,
            },
        ];

        expect(valueUpdater.tableDataRows).toStrictEqual(expected);
    });

    test('Removes a row and provides correct tableDataRows for further processing', function () {
        const tableRows: TableRow[] = [{
            code: 'my_code1',
            labels: {},
            type: 'text',
            validations: [],
            config: {},
        }];

        const tableData: TableDataRow[] = [
            {
                my_code1: 'value1',
            },
            {
                my_code1: 'remove me',
            },
            {
                my_code1: null,
            },
            {
                my_code1: 'value2',
            },
        ];

        const valueUpdater = new ValueUpdater(
            createValue(tableRows, tableData),
            jest.fn()
        );

        // User clicks ok on confirm window
        global.confirm = (message: string) => {
            expect(message).toBe('confirmation question');
            return true;
        };

        const expected = [
            {
                my_code1: 'value1',
            },
            {
                my_code1: 'value2',
            },
            {
                my_code1: null,
            },
        ];

        valueUpdater.removeDataRow(1, 'confirmation question');

        expect(valueUpdater.tableDataRows).toStrictEqual(expected);
    });

    test('Removes a row by its index and changes tableDataRows to the correct react state', function () {
        const tableRows: TableRow[] = [{
            code: 'my_code1',
            labels: {},
            type: 'text',
            validations: [],
            config: {},
        }];

        const tableData: TableDataRow[] = [
            {
                my_code1: 'value1',
            },
            {
                my_code1: 'remove me',
            },
            {
                my_code1: null,
            },
            {
                my_code1: 'value2',
            },
        ];

        const onchange = jest.fn();
        const valueUpdater = new ValueUpdater(
            createValue(tableRows, tableData),
            onchange
        );

        // User clicks ok on confirm window
        global.confirm = (message: string) => {
            expect(message).toBe('confirmation question');
            return true;
        };

        valueUpdater.removeDataRow(1, 'confirmation question');

        const expected = [
            {
                my_code1: 'value1',
            },
            {
                my_code1: 'value2',
            },
        ];

        // expect change of state in react
        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toStrictEqual(createValue(tableRows, expected));
    });

    test('Keeps a row and tableDataRows when user doesn\'t confirm', function () {
        const tableRows: TableRow[] = [{
            code: 'my_code1',
            labels: {},
            type: 'text',
            validations: [],
            config: {},
        }];

        const tableData: TableDataRow[] = [
            {
                my_code1: 'value1',
            },
            {
                my_code1: 'do not remove me',
            },
            {
                my_code1: 'value2',
            },
        ];

        const onchange = jest.fn();
        const valueUpdater = new ValueUpdater(
            createValue(tableRows, tableData),
            onchange
        );

        // User clicks abort on confirm window
        global.confirm = () => false;

        valueUpdater.removeDataRow(1, 'confirmation question');

        const expected = [
            {
                my_code1: 'value1',
            },
            {
                my_code1: 'do not remove me',
            },
            {
                my_code1: 'value2',
            },
            {
                my_code1: null,
            },
        ];

        // no change of state in react
        expect(onchange.mock.calls.length).toBe(0);
        expect(valueUpdater.tableDataRows).toStrictEqual(expected);
    });

    test('Updating a row will update tableDataRows', function () {
        const tableRows: TableRow[] = [{
            code: 'my_code1',
            labels: {},
            type: 'text',
            validations: [],
            config: {},
        }];

        const tableData: TableDataRow[] = [
            {
                my_code1: 'value1',
            },
            {
                my_code1: 'value2',
            },
        ];

        const valueUpdater = new ValueUpdater(
            createValue(tableRows, tableData),
            jest.fn()
        );

        valueUpdater.updateValue('my_code1', 'value2a', 1);

        const expected = [
            {
                my_code1: 'value1',
            },
            {
                my_code1: 'value2a',
            },
            {
                my_code1: null,
            },
        ];

        expect(valueUpdater.tableDataRows).toStrictEqual(expected);
    });

    test('Updating a row will update the react state', function () {
        const tableRows: TableRow[] = [{
            code: 'my_code1',
            labels: {},
            type: 'text',
            validations: [],
            config: {},
        }];

        const tableData: TableDataRow[] = [
            {
                my_code1: 'value1',
            },
            {
                my_code1: 'value2',
            },
        ];

        const onchange = jest.fn();
        const valueUpdater = new ValueUpdater(
            createValue(tableRows, tableData),
            onchange
        );

        valueUpdater.updateValue('my_code1', 'value2a', 1);

        const expected = [
            {
                my_code1: 'value1',
            },
            {
                my_code1: 'value2a',
            }
        ];

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toStrictEqual(createValue(tableRows, expected));
    });
});

function createValue(tableRows: TableRow[], tableData: TableDataRow[]): Value {
    const locale = LocaleReference.create(null);
    const channel = ChannelReference.create(null);
    const data = TableData.createFromNormalized(tableData);
    const attribute = ConcreteTableAttribute.createFromNormalized({
        identifier: 'id',
        reference_entity_identifier: 'refId',
        code: 'code',
        type: 'flagbit_table',
        labels: {},
        value_per_locale: false,
        value_per_channel: false,
        order: 1,
        is_required: false,
        table_property: tableRows
    });

    return Value.create(attribute, channel, locale, data);
}

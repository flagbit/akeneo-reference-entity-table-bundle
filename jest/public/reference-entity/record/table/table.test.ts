import { TableData, denormalize } from '../../../../../src/Resources/public/reference-entity/record/table/table';

describe('table data', function () {
    test('Create TableData with a nullable', function () {
        const tableData: TableData = TableData.createFromNormalized(null);

        expect(tableData.normalize()).toStrictEqual([]);
    });

    test('Normalize TableData', function () {
        const tableData: TableData = TableData.createFromNormalized([{ key: 'value' }, { key: 'value' }]);

        expect(tableData.normalize()).toStrictEqual([{ key: 'value' }, { key: 'value' }]);
    });

    test('denormalize()', function () {
        const denormalized: TableData = denormalize([{ key: 'value' }, { key: 'value' }]);
        const tableData: TableData = TableData.createFromNormalized([{ key: 'value' }, { key: 'value' }]);

        expect(tableData).toStrictEqual(denormalized);
    });

    test('TableData has entries in TableDataRow', function () {
        const tableData: TableData = TableData.createFromNormalized([{ key: 'value' }, { key: 'value' }]);

        expect(tableData.isEmpty()).toBeFalsy();
    });

    test('TableData has empty TableDataRow', function () {
        const tableData: TableData = TableData.createFromNormalized([]);

        expect(tableData.isEmpty()).toBeTruthy();
    });

    test('TableData has equal TableDataRow', function () {
        const tableData: TableData = TableData.createFromNormalized([{ key: 'value' }, { key: 'value' }]);
        const equalTableData: TableData = TableData.createFromNormalized([{ key: 'value' }, { key: 'value' }]);

        expect(tableData.equals(equalTableData)).toBeTruthy();
    });

    test('TableData has different TableDataRow', function () {
        const tableData: TableData = TableData.createFromNormalized([{ key: 'value' }, { key: 'value' }]);
        const differentTableData: TableData = TableData.createFromNormalized([{ key: 'value' }]);

        expect(tableData.equals(differentTableData)).toBeFalsy();
    });
});

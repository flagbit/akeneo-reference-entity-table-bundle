import { ConcreteTableAttribute, TableRow } from '../../../attribute/table/table';
import { denormalize, TableData, TableDataRow } from '../table';
import Value from 'akeneoreferenceentity/domain/model/record/value';

export default class ValueUpdater {
    private readonly internalDataRows: TableDataRow[];

    private readonly tableRows: TableRow[];

    constructor(private readonly value: Value, private readonly onChange: (value: Value) => void) {
        if (!(value.data instanceof TableData && value.attribute instanceof ConcreteTableAttribute)) {
            throw new Error('data and/or attribute does not belong to the ReferenceEntity TableAttribute.');
        }

        this.tableRows = value.attribute.table_property.normalize();
        this.internalDataRows = this.filterEmptyRows(value.data.normalize().slice());
        this.internalDataRows.push(this.createEmptyRow());
    }

    get tableDataRows(): TableDataRow[] {
        return this.internalDataRows;
    }

    public updateValue(code: string, fieldValue: any, index: number) {
        this.internalDataRows[index][code] = fieldValue;

        this.updateDataRows(this.internalDataRows);
    }

    public removeDataRow(index: number, message: string) {
        if (confirm(message)) {
            this.internalDataRows.splice(index, 1);
            this.updateDataRows(this.internalDataRows);
        }
    }

    // Remove all rows that became empty.
    private filterEmptyRows(tableDataRows: TableDataRow[]): TableDataRow[] {
        return tableDataRows.filter((tableDataRow: TableDataRow): boolean => {
            const rowValues: any[] = Object.values(tableDataRow);

            return !rowValues.every((fieldValue) => {
                return fieldValue === null;
            });
        });
    }

    private createEmptyRow(): TableDataRow {
        const emptyTableDataRow: TableDataRow = {};
        this.tableRows.forEach((tableRow: TableRow) => {
            emptyTableDataRow[tableRow.code] = null;
        });

        return emptyTableDataRow;
    }

    private updateDataRows(tableDataRow: TableDataRow[]) {
        const newTableData = denormalize(this.filterEmptyRows(tableDataRow));
        const newValue = this.value.setData(newTableData);

        this.onChange(newValue);
    }
}

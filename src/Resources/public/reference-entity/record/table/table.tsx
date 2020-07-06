import ValueData from 'akeneoreferenceentity/domain/model/record/data';

class InvalidTypeError extends Error {}

export type TableDataRow = {
    [key: string]: any;
}

export type NormalizedTableData = TableDataRow[] | null;
export class TableData extends ValueData {
    private constructor(private tableData: TableDataRow[]) {
        super();

        if ('object' !== typeof tableData) {
            throw new InvalidTypeError('TableData expects an array as parameter to be created');
        }

        Object.freeze(this);
    }

    public static createFromNormalized(tableData: NormalizedTableData): TableData {
        return new TableData(null === tableData ? [] : tableData);
    }

    public isEmpty(): boolean {
        return 0 === this.tableData.length;
    }

    public equals(data: ValueData): boolean {
        return data instanceof TableData && this.tableData === data.tableData;
    }

    public normalize(): any {
        return this.tableData;
    }
}

export const denormalize = TableData.createFromNormalized;

import ValueData from 'akeneoreferenceentity/domain/model/record/data';

class InvalidTypeError extends Error {}

export type TableDataRow = {
    [key: string]: any;
};

export class TableData extends ValueData {
    private constructor(private tableData: TableDataRow[]) {
        super();

        if ('object' !== typeof tableData) {
            throw new InvalidTypeError('TableData expects an array as parameter to be created');
        }

        Object.freeze(this);
    }

    public static createFromNormalized(tableData: TableDataRow[] | null): TableData {
        return new TableData(null === tableData ? [] : tableData);
    }

    public isEmpty(): boolean {
        return 0 === this.tableData.length;
    }

    public equals(data: ValueData): boolean {
        return data instanceof TableData && JSON.stringify(this.tableData) === JSON.stringify(data.tableData);
    }

    public normalize(): any {
        return this.tableData;
    }
}

// ts-unused-exports:disable-next-line
export const denormalize = TableData.createFromNormalized;

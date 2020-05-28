import ValueData from 'akeneoreferenceentity/domain/model/record/data';

class InvalidTypeError extends Error {}

/**
 * Record Value model.
 */
export type NormalizedTableData = string | null;
export class TableData extends ValueData {
    private constructor(private tableData: string) {
        super();

        if ('string' !== typeof tableData) {
            throw new InvalidTypeError('TableData expects a string as parameter to be created');
        }

        Object.freeze(this);
    }

    /**
     * Here, we denormalize our record value
     */
    public static createFromNormalized(tableData: NormalizedTableData): TableData {
        return new TableData(null === tableData ? '' : tableData);
    }

    /**
     * Check the emptiness
     */
    public isEmpty(): boolean {
        return '' === this.tableData;
    }

    /**
     * Check if the value is equal to the table data
     */
    public equals(data: ValueData): boolean {
        return data instanceof TableData && this.tableData === data.tableData;
    }

    /**
     * The only method to implement here: the normalize method. Here you need to provide a serializable object (see https://developer.mozilla.org/en-US/docs/Glossary/Serialization)
     */
    public normalize(): string {
        return this.tableData;
    }
}

/**
 * The only required part of the file: exporting a denormalize method returning a table Record Value.
 */
export const denormalize = TableData.createFromNormalized;

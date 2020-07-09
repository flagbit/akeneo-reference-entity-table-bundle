import {TableRow} from "../../../attribute/table/table";
import Text from "./text";
import Number from "./number";
import Select from "./select";
import { TableDataRow } from "../table";

// Export for custom implementations
export interface TypeFactory {
    typeCode: string;
    create(): Type;
}

// Export for custom implementations
export interface Type {
    typeCode: string;
    render(recordRowData: RecordChangeState): any;
}

class SimpleTypeFactory implements TypeFactory{
    constructor(readonly typeCode: string, readonly typeClass: { new(typeCode: string): Type }) {}

    create(): Type {
        return new this.typeClass(this.typeCode);
    }
}

export type RecordChangeState = {
    tableRow: TableRow;
    updateValue: (code: string, value: any, index: number) => void;
    index: number;
    rowData: TableDataRow;
}

class TypeRegistry {
    public constructor(readonly typeFactories: TypeFactory[]) {}

    public render(recordRowData: RecordChangeState): any {
        const filteredTypes: TypeFactory[] = this.typeFactories.filter(function (typeFactory: TypeFactory): boolean {
            return typeFactory.typeCode === recordRowData.tableRow.type;
        });

        if (filteredTypes.length !== 1) {
            throw Error('Unknown type code ' + recordRowData.tableRow.type);
        }

        const selectedFactory: TypeFactory|undefined = filteredTypes.pop();

        if (selectedFactory === undefined) {
            throw Error('"undefined" for type code ' + recordRowData.tableRow.type);
        }

        return selectedFactory.create().render(recordRowData);
    }

    public addFactory(typeFactory: TypeFactory): void {
        this.typeFactories.push(typeFactory);
    }
}

// Keep one instance across the project
export namespace FlagbitTableRecordTypes {
    export const typeRegistry: TypeRegistry = new TypeRegistry(
        [
            new SimpleTypeFactory('text', Text),
            new SimpleTypeFactory('number', Number),
            new SimpleTypeFactory('simple_select', Select),
        ]
    );
}
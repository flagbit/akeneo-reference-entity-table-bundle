import Text from "./text";
import Number from "./number";

export interface Type {
    typeCode(): string;
    render(renderArguments: ConfigChangeState): any;
}

type Option = {
    code: string;
}

type ConfigType = {
    code: string;
    classname: { new(): Type };
}

export type ConfigChangeState = {
    typeCode: string;
    updateConfig: (config: object, index: number) => void;
    index: number;
    config: object
}

class TypeRegistry {
    public constructor(readonly types: ConfigType[]) {}

    public getSelectValues(): Option[] {
        return this.types.map((configType: ConfigType) => {
            return { code: configType.code };
        })
    }

    public render(renderArguments: ConfigChangeState): any {
        const filteredTypes: ConfigType[] = this.types.filter(function (type: ConfigType): boolean {
            return type.code === renderArguments.typeCode;
        });

        if (filteredTypes.length !== 1) {
            throw Error('Unknown type code ' + renderArguments.typeCode);
        }

        const selectedType: ConfigType|undefined = filteredTypes.pop();

        if (selectedType === undefined) {
            throw Error('"undefined" for type code ' + renderArguments.typeCode);
        }

        return new selectedType.classname().render(renderArguments);
    }
}

// Keep one instance across the project
export namespace FlagbitTableTypes {
    export const typeRegistry: TypeRegistry = new TypeRegistry(
        [
            {code: 'text', classname: Text},
            {code: 'number', classname: Number},
        ]
    );
}

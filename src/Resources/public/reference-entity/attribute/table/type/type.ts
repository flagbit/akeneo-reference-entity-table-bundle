import Text from "./text";
import Number from "./number";

type Option = {
    code: string;
}

export type ConfigChangeState = {
    typeCode: string;
    updateConfig: (config: object, index: number) => void;
    index: number;
    config: object
}

export interface Type {
    typeCode(): string;
    render(renderArguments: ConfigChangeState): any;
}

class TypeRegistry {
    public constructor(readonly types: Type[]) {}

    public getSelectValues(): Option[] {
        return this.types.map((type: Type) => {
            return { code: type.typeCode() };
        })
    }

    public render(renderArguments: ConfigChangeState): string {
        const filteredTypes: Type[] = this.types.filter(function (type: Type): boolean {
            return type.typeCode() === renderArguments.typeCode;
        });

        if (filteredTypes.length !== 1) {
            throw Error('Unknown type code ' + renderArguments.typeCode);
        }

        const selectedType: Type|undefined = filteredTypes.pop();

        if (selectedType === undefined) {
            throw Error('"undefined" for type code ' + renderArguments.typeCode);
        }

        return selectedType.render(renderArguments);
    }
}

export namespace FlagbitTableTypes {
    export const typeRegistry: TypeRegistry = new TypeRegistry(
        [
            new Text(),
            new Number(),
        ]
    );
}

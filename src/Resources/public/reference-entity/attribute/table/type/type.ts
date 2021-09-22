import Text from './text';
import Number from './number';
import Select from './select';
import LocalizedSelect from './localized-select';
import SingleReferenceEntity from './single-reference-entity';
import Locale from 'akeneoreferenceentity/domain/model/locale';

// Export for custom implementations
// ts-unused-exports:disable-next-line
export interface TypeFactory {
    typeCode: string;
    create(): Type;
}

// Export for custom implementations
export interface Type {
    typeCode: string;
    render(renderArguments: ConfigChangeState): any;
}

class SimpleTypeFactory implements TypeFactory {
    constructor(readonly typeCode: string, readonly typeClass: new (typeCode: string) => Type) {}

    create(): Type {
        return new this.typeClass(this.typeCode);
    }
}

type Option = {
    code: string;
};

export type ConfigChangeState = {
    typeCode: string;
    updateConfig: (config: object, index: number) => void;
    index: number;
    config: object;
    supportedLocales: Locale[];
};

class TypeRegistry {
    public constructor(readonly typeFactories: TypeFactory[]) {}

    public getSelectValues(): Option[] {
        return this.typeFactories.map((typeFactory: TypeFactory) => {
            return { code: typeFactory.typeCode };
        });
    }

    public render(renderArguments: ConfigChangeState): any {
        const filteredTypes: TypeFactory[] = this.typeFactories.filter((typeFactory: TypeFactory): boolean => {
            return typeFactory.typeCode === renderArguments.typeCode;
        });

        if (filteredTypes.length !== 1) {
            throw Error('Unknown type code ' + renderArguments.typeCode);
        }

        const selectedFactory: TypeFactory = filteredTypes.pop();

        return selectedFactory.create().render(renderArguments);
    }

    public addFactory(typeFactory: TypeFactory): void {
        this.typeFactories.push(typeFactory);
    }
}

// Keep one instance across the project
export namespace FlagbitTableTypes {
    export const typeRegistry: TypeRegistry = new TypeRegistry([
        new SimpleTypeFactory('text', Text),
        new SimpleTypeFactory('number', Number),
        new SimpleTypeFactory('simple_select', Select),
        new SimpleTypeFactory('simple_select_localized', LocalizedSelect),
        new SimpleTypeFactory('single_reference_entity', SingleReferenceEntity),
    ]);
}

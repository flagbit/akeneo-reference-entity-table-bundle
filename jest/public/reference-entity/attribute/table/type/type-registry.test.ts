import {
    Type,
    ConfigChangeState,
    TypeFactory,
    FlagbitTableTypes
} from "../../../../../../src/Resources/public/reference-entity/attribute/table/type/type";

describe('TypeRegistry', function () {
    test('Error on unknown attribute type "test"', function () {
        expect(() => FlagbitTableTypes.typeRegistry.render(createConfigChangeState())).toThrow(Error);
    });

    test('Render type output determined by typeCode', function () {
        const testType = new class implements TypeFactory
        {
            typeCode: string = 'test';

            create(): Type {
                return {
                    typeCode: 'test',
                    render: jest.fn(() => 'render')
                };
            }
        };

        FlagbitTableTypes.typeRegistry.addFactory(testType);

        expect(FlagbitTableTypes.typeRegistry.render(createConfigChangeState())).toBe('render');
    });
});

function createConfigChangeState(): ConfigChangeState {
    return {
        typeCode: 'test',
        updateConfig: jest.fn(),
        index: 0,
        config: {},
        supportedLocales: [],
    };
}

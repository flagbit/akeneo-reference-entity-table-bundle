import {
    Type,
    RecordChangeState,
    TypeFactory,
    FlagbitTableRecordTypes
} from "../../../../../../src/Resources/public/reference-entity/record/table/type/type";
import LocaleReference from 'akeneoreferenceentity/domain/model/locale-reference';

describe('TypeRegistry', function () {
    test('Error on unknown table row type "test"', function () {
        expect(() => FlagbitTableRecordTypes.typeRegistry.render(createRecordChangeState())).toThrow(Error);
    });

    test('Render type output determined by tableRow type', function () {
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

        FlagbitTableRecordTypes.typeRegistry.addFactory(testType);

        expect(FlagbitTableRecordTypes.typeRegistry.render(createRecordChangeState())).toBe('render');
    });
});

function createRecordChangeState(): RecordChangeState {
    return {
        tableRow: {
            code: 'code',
            labels: {},
            type: 'test',
            validations: [],
            config: {},
        },
        updateValue: jest.fn(),
        index: 0,
        rowData: {},
        locale: LocaleReference.create(null),
    };
}

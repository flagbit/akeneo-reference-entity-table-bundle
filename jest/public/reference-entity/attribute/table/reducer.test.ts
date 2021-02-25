import {
    NormalizedTableAttribute,
    NormalizedTableAdditionalProperty,
} from '../../../../../src/Resources/public/reference-entity/attribute/table/table';
import { reducer } from '../../../../../src/Resources/public/reference-entity/attribute/table/reducer';

describe('TableAttribute reducer', function () {
    test('Ignore if code is not "table_property" and return unchanged normalized attribute', function () {
        const expected: NormalizedTableAttribute = createNormalizedTableAttribute();
        const propertyValue: NormalizedTableAdditionalProperty = [
            {
                code: 'my_code1',
                labels: {},
                type: 'text',
                validations: [],
                config: {},
            },
        ];

        const actual: NormalizedTableAttribute = reducer(expected, 'different_code', propertyValue);

        expect(expected).toStrictEqual(actual);
    });

    test('Set table rows in normalized attribute', function () {
        const normalizedTableAttribute: NormalizedTableAttribute = createNormalizedTableAttribute();
        normalizedTableAttribute.table_property = [
            {
                code: 'my_code2',
                labels: { en_US: 'test' },
                type: 'text',
                validations: [],
                config: {},
            },
            {
                code: 'my_code1',
                labels: { en_US: 'test' },
                type: 'text',
                validations: [],
                config: {},
            },
        ];

        const propertyValue: NormalizedTableAdditionalProperty = [
            {
                code: 'my_code1',
                labels: {},
                type: 'text',
                validations: [],
                config: {},
            },
        ];

        const actual: NormalizedTableAttribute = reducer(normalizedTableAttribute, 'table_property', propertyValue);

        const expected: NormalizedTableAttribute = createNormalizedTableAttribute();
        expected.table_property = [
            {
                code: 'my_code1',
                labels: {},
                type: 'text',
                validations: [],
                config: {},
            },
        ];

        expect(expected).toStrictEqual(actual);
    });
});

function createNormalizedTableAttribute(): NormalizedTableAttribute {
    return {
        identifier: 'id',
        reference_entity_identifier: 'refId',
        code: 'code',
        type: 'flagbit_table',
        labels: {},
        value_per_locale: false,
        value_per_channel: false,
        order: 1,
        is_required: false,
        table_property: [],
    };
}

import {
    ConcreteTableAttribute,
    NormalizedTableAttribute,
    TableProperty,
    denormalize,
} from '../../../../../src/Resources/public/reference-entity/attribute/table/table';
import AttributeIdentifier from 'akeneoreferenceentity/domain/model/attribute/identifier';
import AttributeCode from 'akeneoreferenceentity/domain/model/attribute/code';
import Identifier from 'akeneoreferenceentity/domain/model/identifier';
import LabelCollection from 'akeneoreferenceentity/domain/model/label-collection';

describe('TableAttribute', function () {
    test('Basic accessors', function () {
        const attribute = ConcreteTableAttribute.createFromNormalized({
            identifier: 'id',
            reference_entity_identifier: 'refId',
            code: 'code',
            type: 'flagbit_table',
            labels: { en_US: 'US', de_DE: 'DE' },
            value_per_locale: false,
            value_per_channel: false,
            order: 1,
            is_required: true,
            table_property: [],
        });

        expect(attribute.getIdentifier()).toStrictEqual(AttributeIdentifier.create('id'));
        expect(attribute.getCode()).toStrictEqual(AttributeCode.create('code'));
        expect(attribute.getReferenceEntityIdentifier()).toStrictEqual(Identifier.create('refId'));
        expect(attribute.getType()).toBe('flagbit_table');
        expect(attribute.getLabel('de_DE')).toBe('DE');
        expect(attribute.getLabel('es_ES')).toBe('[code]');
        expect(attribute.getLabelCollection()).toStrictEqual(LabelCollection.create({ en_US: 'US', de_DE: 'DE' }));
        expect(attribute.isRequired).toBeTruthy();
        expect(attribute.order).toBe(1);
        expect(attribute.valuePerChannel).toBeFalsy();
        expect(attribute.valuePerLocale).toBeFalsy();
    });

    test('TableProperty accessors', function () {
        const attribute = ConcreteTableAttribute.createFromNormalized({
            identifier: 'id',
            reference_entity_identifier: 'refId',
            code: 'code',
            type: 'flagbit_table',
            labels: {},
            value_per_locale: false,
            value_per_channel: false,
            order: 1,
            is_required: true,
            table_property: [],
        });

        expect(attribute.table_property).toStrictEqual(new TableProperty([]));
    });

    test('normalize()', function () {
        const normalizedAttribute: NormalizedTableAttribute = {
            identifier: 'id',
            reference_entity_identifier: 'refId',
            code: 'code',
            type: 'flagbit_table',
            labels: {},
            value_per_locale: false,
            value_per_channel: false,
            order: 1,
            is_required: true,
            table_property: [],
        };
        const attribute = ConcreteTableAttribute.createFromNormalized(normalizedAttribute);

        expect(attribute.normalize()).toStrictEqual(normalizedAttribute);
    });

    test('Denormalize export for Akeneo', function () {
        const normalizedAttribute: NormalizedTableAttribute = {
            identifier: 'id',
            reference_entity_identifier: 'refId',
            code: 'code',
            type: 'flagbit_table',
            labels: {},
            value_per_locale: false,
            value_per_channel: false,
            order: 1,
            is_required: true,
            table_property: [],
        };

        expect(denormalize(normalizedAttribute)).toStrictEqual(ConcreteTableAttribute.createFromNormalized(normalizedAttribute));
    });
});

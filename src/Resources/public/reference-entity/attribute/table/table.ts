import Identifier, { createIdentifier } from 'akeneoreferenceentity/domain/model/attribute/identifier';
import ReferenceEntityIdentifier, {
    createIdentifier as createReferenceEntityIdentifier,
} from 'akeneoreferenceentity/domain/model/reference-entity/identifier';
import LabelCollection, { createLabelCollection } from 'akeneoreferenceentity/domain/model/label-collection';
import AttributeCode, { createCode } from 'akeneoreferenceentity/domain/model/attribute/code';
import Locale from 'akeneoreferenceentity/domain/model/locale';
import { NormalizedAttribute, Attribute, ConcreteAttribute } from 'akeneoreferenceentity/domain/model/attribute/attribute';

export type TableRow = {
    code: string;
    labels: { [index: string]: string };
    type: string;
    validations: any;
    config: object;
};

type LocalizedLabels = { [index: string]: string };

export type NormalizedTableProperty = TableRow[];
export class TableProperty {
    public constructor(readonly tableProperty: TableRow[]) {}

    public normalize(): TableRow[] {
        return this.tableProperty;
    }

    public static createEmptyRow(locales: Locale[]): TableRow {
        const emptyLocales: LocalizedLabels = {};
        locales.map((currentLocale: Locale) => {
            emptyLocales[currentLocale.code] = '';
        });

        return {
            code: '',
            labels: emptyLocales,
            type: 'text',
            validations: [],
            config: {},
        };
    }
}

export type NormalizedTableAdditionalProperty = TableRow[];

export interface NormalizedTableAttribute extends NormalizedAttribute {
    type: 'flagbit_table';
    table_property: TableRow[];
}

export interface TableAttribute extends Attribute {
    table_property: TableProperty;
    normalize(): NormalizedTableAttribute;
}

export class ConcreteTableAttribute extends ConcreteAttribute implements TableAttribute {
    private constructor(
        identifier: Identifier,
        referenceEntityIdentifier: ReferenceEntityIdentifier,
        code: AttributeCode,
        labelCollection: LabelCollection,
        valuePerLocale: boolean,
        valuePerChannel: boolean,
        order: number,
        is_required: boolean,
        readonly table_property: TableProperty
    ) {
        super(
            identifier,
            referenceEntityIdentifier,
            code,
            labelCollection,
            'flagbit_table',
            valuePerLocale,
            valuePerChannel,
            order,
            is_required
        );

        Object.freeze(this);
    }

    public static createFromNormalized(normalizedTableAttribute: NormalizedTableAttribute) {
        return new ConcreteTableAttribute(
            createIdentifier(normalizedTableAttribute.identifier),
            createReferenceEntityIdentifier(normalizedTableAttribute.reference_entity_identifier),
            createCode(normalizedTableAttribute.code),
            createLabelCollection(normalizedTableAttribute.labels),
            normalizedTableAttribute.value_per_locale,
            normalizedTableAttribute.value_per_channel,
            normalizedTableAttribute.order,
            normalizedTableAttribute.is_required,
            new TableProperty(normalizedTableAttribute.table_property)
        );
    }

    public normalize(): NormalizedTableAttribute {
        return {
            ...super.normalize(),
            type: 'flagbit_table',
            table_property: this.table_property.normalize(),
        };
    }
}

/**
 * The only required part of the file: exporting a denormalize method returning a custom attribute implementing Attribute interface
 */
// ts-unused-exports:disable-next-line
export const denormalize = ConcreteTableAttribute.createFromNormalized;

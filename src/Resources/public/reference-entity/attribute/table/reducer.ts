import { NormalizedTableAttribute, NormalizedTableAdditionalProperty, NormalizedTableProperty } from './table';

const tableAttributeReducer = (
    normalizedAttribute: NormalizedTableAttribute,
    propertyCode: string,
    propertyValue: NormalizedTableAdditionalProperty
): NormalizedTableAttribute => {
    switch (propertyCode) {
        case 'table_property':
            return { ...normalizedAttribute, table_property: propertyValue as NormalizedTableProperty };

        default:
            break;
    }

    return normalizedAttribute;
};

/**
 * The only required part of the file: exporting the custom attribute reducer.
 * Be aware that the export has to be named ``reducer``
 */
// ts-unused-exports:disable-next-line
export const reducer = tableAttributeReducer;

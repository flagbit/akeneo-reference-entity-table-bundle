import {
    NormalizedTableAttribute,
    NormalizedTableAdditionalProperty,
    NormalizedTableProperty,
} from './table';

const tableAttributeReducer = (
    normalizedAttribute: NormalizedTableAttribute,
    propertyCode: string,
    propertyValue: NormalizedTableAdditionalProperty
): NormalizedTableAttribute => {
    switch (propertyCode) {
        case 'table_property':
            const tableProperty = propertyValue as NormalizedTableProperty;
            return {...normalizedAttribute, table_property: tableProperty};

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

import {
    NormalizedTableAttribute,
    NormalizedTableAdditionalProperty,
    NormalizedTableProperty
} from './table';

/**
 * Our custom attribute reducer needs to receive the normalized custom attribute as input, the code of the additional property and the value of the additional property.
 * It returns the normalized custom attribute.
 */
const tableAttributeReducer = (
    normalizedAttribute: NormalizedTableAttribute,
    propertyCode: string,
    propertyValue: NormalizedTableAdditionalProperty
): NormalizedTableAttribute => {
    switch (propertyCode) {
        case 'table_property':
            const table_property = propertyValue as NormalizedTableProperty;
            return {...normalizedAttribute, table_property};

        default:
            break;
    }

    return normalizedAttribute;
};

/**
 * The only required part of the file: exporting the custom attribute reducer.
 * Be aware that the export has to be named ``reducer``
 */
export const reducer = tableAttributeReducer;

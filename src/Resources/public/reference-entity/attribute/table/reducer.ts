import {
    NormalizedTableAttribute,
    NormalizedTableAdditionalProperty,
    NormalizedTableProperty
} from './table';

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




export interface EditTableState {
    isActive: boolean;
    isDirty: boolean;
    table_property: [];
    errors: [];
}

const initEditTableState = (): EditTableState => ({
    isDirty: false,
    isActive: false,
    table_property: [],
    errors: [],
});

type Action = {
    type: string;
    table_property: [];
    errors: [];
};

export const editTableReducer = (state: EditTableState = initEditTableState(), action: Action) => {
    // @ts-ignore
    const {type, table_property} = action;

    switch (type) {
        case 'FLAGBIT_TABLE_EDITION_START':
            console.log('FLAGBIT_TABLE_EDITION_START', state);
            return {
                ...state,
                test: true,
                // table: {
                //     isActive: true,
                //     tableValues: JSON.stringify(table_property),
                //     errors: [],
                // }
            };
        case 'FLAGBIT_TABLE_EDITION_CLOSE':
            console.log('FLAGBIT_TABLE_EDITION_CLOSE', state);

        default:
            break;
    }

    return {};
};

import createStore from 'akeneoreferenceentity/infrastructure/store';

createStore(true)({editTableReducer});

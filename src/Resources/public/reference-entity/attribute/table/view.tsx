import * as React from 'react';
import __ from 'akeneoreferenceentity/tools/translator';
import {getErrorsView} from 'akeneoreferenceentity/application/component/app/validation-error';
import ValidationError from "akeneoreferenceentity/domain/model/validation-error";
import {
    TableAttribute,
} from "./table";
import TableAttributeModal from './modal';
import {connect} from 'react-redux';
// import $ from 'jquery';

/**
 * Here we define the React Component as a function with the following props :
 *    - the custom attribute
 *    - the callback function to update the additional property
 *    - the callback for the submit
 *    - the validation errors
 *    - the attribute rights
 *
 * It returns the JSX View to display the additional properties of your custom attribute.
 */
const TableAttributeView = ({
                                onTableEditionStart,
                                attribute,
                                // onAdditionalPropertyUpdated,
                                // onSubmit,
                                errors,
                                rights
                            }: {
    onTableEditionStart: () => void
    attribute: TableAttribute;
    // onAdditionalPropertyUpdated: (property: string, value: TableAdditionalProperty) => void;
    // onSubmit: () => void;
    errors: ValidationError[];
    rights: {
        locale: {
            edit: boolean
        }
        attribute: {
            create: boolean;
            edit: boolean;
            delete: boolean;
        };
    }
}) => {
    return (
        <React.Fragment>
            <div className="AknFieldContainer" data-code="table_property">
                <div className="AknFieldContainer-header">
                    <button onClick={onTableEditionStart} className="AknButton" data-code="table_property">
                        {__('flagbit_reference_entity_table.attribute.edit_button.manage_columns.label')}
                    </button>
                </div>
            </div>
            {getErrorsView(errors, 'table_property')}

            <TableAttributeModal attribute={attribute} rights={rights} />
        </React.Fragment>
    );
};

export const view = connect(
    () => ({}),
    () => ({
        onTableEditionStart: () => {
            $('#table').css({'display': 'block'});
            $('#table').detach().prependTo('body .app:first');
        }
    })
)(TableAttributeView);

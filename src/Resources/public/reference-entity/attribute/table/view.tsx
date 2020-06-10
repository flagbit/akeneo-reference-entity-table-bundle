import * as React from 'react';
import __ from 'akeneoreferenceentity/tools/translator';
import {getErrorsView} from 'akeneoreferenceentity/application/component/app/validation-error';
import ValidationError from "akeneoreferenceentity/domain/model/validation-error";
import Key from "akeneoreferenceentity/tools/key";
import {TableAdditionalProperty, TableAttribute, TableProperty} from "./table";
import {connect} from 'react-redux';
import $ from 'jquery';

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
                                onAdditionalPropertyUpdated,
                                onSubmit,
                                errors,
                                rights
                            }: {
    onTableEditionStart: () => void
    attribute: TableAttribute;
    onAdditionalPropertyUpdated: (property: string, value: TableAdditionalProperty) => void;
    onSubmit: () => void;
    errors: ValidationError[];
    rights: {
        attribute: {
            create: boolean;
            edit: boolean;
            delete: boolean;
        };
    }
}) => {
    const inputTextClassName = `AknTextField AknTextField--light ${
        !rights.attribute.edit ? 'AknTextField--disabled' : ''
    }`;

    return (
        <React.Fragment>
            <div className="AknFieldContainer" data-code="table_property">
                <div className="AknFieldContainer-header">
                    <button onClick={onTableEditionStart} className="AknButton" data-code="table_property">
                        {__('pim_reference_entity.attribute.edit.input.manage_options.quick_edit.label')}
                    </button>
                </div>
            </div>
            <div className="AknFieldContainer-header AknFieldContainer-header--light">
                <label className="AknFieldContainer-label" htmlFor="pim_reference_entity.attribute.edit.input.table_property">
                    {__('pim_reference_entity.attribute.edit.input.table_property')}
                </label>
            </div>
            <div className="AknFieldContainer-inputContainer">
                <input
                    type="text"
                    autoComplete="off"
                    className={inputTextClassName}
                    id="pim_reference_entity.attribute.edit.input.table_property"
                    name="table_property"
                    readOnly={!rights.attribute.edit}
                    value={attribute.table_property.normalize().toString()}
                    onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                        if (Key.Enter === event.key) onSubmit();
                    }}
                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        onAdditionalPropertyUpdated('table_property', new TableProperty([event.currentTarget.value]));
                    }}
                />
            </div>
            {getErrorsView(errors, 'table_property')}

            <TableAttributeModal />
        </React.Fragment>
    );
};

interface TableProp {
}

export class TableAttributeModal extends React.Component<TableProp> {
    render() {
        return (
            <React.Fragment>
                <div className="modal in flagbitTableAttribute" id="table" aria-hidden="false" style={{zIndex: 1042, display: 'none'}}>
                    <div>
                        <div className="AknFullPage AknFullPage--full">
                            <div className="AknFullPage-content">
                                <h1>My MODAL!!!!</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export const view = connect(
    () => ({}),
    () => ({
        onTableEditionStart: () => {
            // dispatch({type: 'FLAGBIT_TABLE_EDITION_START', table_property: []});

            $('#table').css({'display': 'block'});
            $('#table').detach().prependTo('body .app:first');
        },
    })
)(TableAttributeView);

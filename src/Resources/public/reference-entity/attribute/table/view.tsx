import * as React from 'react';
import __ from 'akeneoreferenceentity/tools/translator';
import {getErrorsView} from 'akeneoreferenceentity/application/component/app/validation-error';
import ValidationError from "akeneoreferenceentity/domain/model/validation-error";
import {
    TableAttribute,
    TableProperty,
    TableRow,
} from "./table";
import TableAttributeModal from './modal';
import {connect} from 'react-redux';
import $ from 'jquery';

const TableAttributeView = ({
                                onTableEditionStart,
                                attribute,
                                onAdditionalPropertyUpdated,
                                // onSubmit,
                                errors,
                                rights
                            }: {
    onTableEditionStart: (attribute: TableAttribute) => void
    attribute: TableAttribute;
    onAdditionalPropertyUpdated: (property: string, value: TableProperty) => void;
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
    const save = (tableRows: TableRow[]) => {
        onAdditionalPropertyUpdated('table_property', new TableProperty(tableRows));
    }

    return (
        <React.Fragment>
            <div className="AknFieldContainer" data-code="table_property">
                <div className="AknFieldContainer-header">
                    <button onClick={() => onTableEditionStart(attribute)} className="AknButton" data-code="table_property">
                        {__('flagbit_reference_entity_table.attribute.edit_button.manage_columns.label')}
                    </button>
                </div>
            </div>
            {getErrorsView(errors, 'table_property')}

            <TableAttributeModal attribute={attribute} rights={rights} saveTable={save} />
        </React.Fragment>
    );
};

export const view = connect(
    () => ({}),
    () => ({
        onTableEditionStart: (attribute: TableAttribute) => {
            const id = '#table_' + attribute.getCode().stringValue();
            $(id).css({'display': 'block'});
            $(id).detach().prependTo('body .app:first');
        }
    })
)(TableAttributeView);

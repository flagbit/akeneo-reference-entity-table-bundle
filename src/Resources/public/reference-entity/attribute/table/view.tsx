import * as React from 'react';
import __ from 'akeneoreferenceentity/tools/translator';
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
                                errors,
                                rights
                            }: {
    onTableEditionStart: (selector: string) => void
    attribute: TableAttribute;
    onAdditionalPropertyUpdated: (property: string, value: TableProperty) => void;
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

    const modalSelector = '#flagbit_table_' + attribute.getCode().stringValue();
    const modalContainer = 'flagbit_container_' + attribute.getCode().stringValue();

    return (
        <React.Fragment>
            <div className="AknFieldContainer" data-code="table_property">
                <div className="AknFieldContainer-header">
                    <button onClick={() => onTableEditionStart(modalSelector)} className="AknButton" data-code="table_property">
                        {__('flagbit_reference_entity_table.attribute.edit_button.manage_columns.label')}
                    </button>
                </div>
            </div>

            {errors.length !== 0 ? (
                <div className="AknFieldContainer-footer AknFieldContainer-validationErrors">
                    <span className="AknFieldContainer-validationError">{__('flagbit_reference_entity_table.attribute.error')}</span>
                </div>
            ) : null}

            <div id={modalContainer}>
                <TableAttributeModal key={`key_${attribute.getCode().stringValue()}`} attribute={attribute} rights={rights} saveTable={save} />
            </div>
        </React.Fragment>
    );
};

export const view = connect(
    () => ({}),
    () => ({
        onTableEditionStart: (selector: string) => {
            $(selector).css({'display': 'block'});
            $(selector).detach().prependTo('body .app:first');
        }
    })
)(TableAttributeView);

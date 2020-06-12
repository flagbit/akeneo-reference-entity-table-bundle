import * as React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import __ from 'akeneoreferenceentity/tools/translator';
import ValidationError from "akeneoreferenceentity/domain/model/validation-error";
import Key from "akeneoreferenceentity/tools/key";
import Locale from 'akeneoreferenceentity/domain/model/locale';
import createStore from 'akeneoreferenceentity/infrastructure/store';
import {getErrorsView} from 'akeneoreferenceentity/application/component/app/validation-error';
const securityContext = require('pim/security-context');

import {
    TableAttribute,
    NormalizedTableAttribute,
    TableRow,
    TableProperty,
    ConcreteTableAttribute
} from "./table";
import {tableRow} from './row'

import {editTableReducer} from "./reducer";

const store = createStore(true)({editTableReducer});


type OwnProps = {
    rights: {
        locale: {
            edit: boolean;
        };
        attribute: {
            create: boolean;
            edit: boolean;
            delete: boolean;
        };
    };
};

interface TableProp {
    isDirty: boolean;
    errors: ValidationError[];
    events: any;
    attribute: TableAttribute;
    test: any;
    store: any;
    locale: string;
    structure: {
        locales: Locale[];
    };
    rights: {
        locale: {
            edit: boolean;
        };
        attribute: {
            create: boolean;
            edit: boolean;
            delete: boolean;
        };
    };
}

class TableAttributeModal extends React.Component<TableProp> {
    /**
     * We keep track of the references of the input in order to put the user in the
     * right input whenever he presses enter.
     *
     * Ex: The user has the focus on the code red, when he presses enter the focus will go in the next code input.
     * (It works the same for the labels)
     */
    private labelInputReferences: React.RefObject<HTMLInputElement>[] = [];
    private codeInputReferences: React.RefObject<HTMLInputElement>[] = [];

    updateRefs(tableAttribute: NormalizedTableAttribute) {
        this.labelInputReferences = [
            ...tableAttribute.table_property.map(() => React.createRef<HTMLInputElement>()),
            React.createRef<HTMLInputElement>(),
        ];
        this.codeInputReferences = [
            ...tableAttribute.table_property.map(() => React.createRef<HTMLInputElement>()),
            React.createRef<HTMLInputElement>(),
        ];
    }

    cancelManageTableAttribute() {
        const message = __('pim_enrich.confirmation.discard_changes', {entity: 'table_property'});
        if (this.props.isDirty) {
            if (confirm(message)) {
                this.props.events.onTableEditionCancel();
            }
        } else {
            this.props.events.onTableEditionCancel();
        }
    }

    render() {
        const emptyRow: TableRow = TableProperty.createEmptyRow(this.props.structure.locales);

        const tableRows: TableRow[] = [...this.props.attribute.table_property.normalize(), emptyRow];

        const normalizedAttribute = this.props.attribute.normalize();
        normalizedAttribute.table_property = new TableProperty(tableRows).normalize();
        const tableAttribute = ConcreteTableAttribute.createFromNormalized(normalizedAttribute);
        this.updateRefs(tableAttribute.normalize());

        return (
            <React.Fragment>
                <div className="modal in flagbitTableAttribute" id="table" aria-hidden="false" style={{zIndex: 1042, display: 'none'}}>
                    <div>
                        <div className="AknFullPage AknFullPage--full">
                            <div className="AknFullPage-content">
                                <div className="AknFullPage-titleContainer">
                                    <div className="AknFullPage-subTitle">
                                        {__('pim_reference_entity.attribute.options.sub_title')} / {this.props.attribute.code.stringValue()}
                                    </div>
                                    <div className="AknFullPage-title">
                                        {__('flagbit_reference_entity_table.attribute.table.config.title')}
                                    </div>
                                </div>
                                <div className="AknOptionEditor">
                                    <div className="AknSubsection AknOptionEditor-translator">
                                        <div className="AknSubsection-title AknSubsection-title--sticky AknSubsection-title--light">
                                            <span className="AknSubsection-titleLabel">
                                                {this.props.attribute.getLabelCollection().getLabel(this.props.locale)}
                                            </span>
                                        </div>
                                        <table className="AknOptionEditor-table">
                                            <thead>
                                            <tr>
                                                <th className="AknOptionEditor-headCell">
                                                    <label className="AknOptionEditor-headCellLabel">
                                                        {__('flagbit_reference_entity_table.attribute.edit.input.code')}
                                                    </label>
                                                </th>
                                                {this.props.structure.locales.map((locale: Locale) => {
                                                    return (
                                                        <th className="AknOptionEditor-headCell" key={locale.code}>
                                                            <label className="AknOptionEditor-headCellLabel">{__('flagbit_reference_entity_table.attribute.edit.input.label')} {locale.code}</label>
                                                        </th>
                                                    );
                                                })}
                                                <th className="AknOptionEditor-headCell">
                                                    <label className="AknOptionEditor-headCellLabel">{__('flagbit_reference_entity_table.attribute.edit.input.type')}</label>
                                                </th>
                                                <th className="AknOptionEditor-headCell">
                                                    <label className="AknOptionEditor-headCellLabel">{__('flagbit_reference_entity_table.attribute.edit.input.configuration')}</label>
                                                </th>
                                                <th className="AknOptionEditor-headCell">
                                                    <label className="AknOptionEditor-headCellLabel" />
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {tableRows.map((row, index: number) => {
                                                return tableRow({
                                                    code: row.code,
                                                    labels: row.labels,
                                                    index: index,
                                                    isLastRow: index >= tableRows.length - 1,
                                                    numberOfLockedRows: tableRows.length,
                                                    locale: this.props.locale,
                                                    locales: this.props.structure.locales,
                                                    errors: this.props.errors,
                                                    rights: this.props.rights,
                                                    labelInputReference: this.labelInputReferences[index],
                                                    codeInputReference: this.codeInputReferences[index],
                                                    onTableEditionCodeUpdated: this.props.events.onTableEditionCodeUpdated,
                                                    onTableEditionSelected: this.props.events.onTableEditionSelected,
                                                    onTableEditionLabelUpdated: this.props.events.onTableEditionLabelUpdated,
                                                    onTableEditionDelete: this.props.events.onTableEditionDelete,
                                                });
                                            })}
                                            <tr>
                                                <td>{getErrorsView(this.props.errors, 'table_property')}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="AknButtonList AknButtonList--right modal-footer">
                        {this.props.rights.attribute.edit ? (
                            <button
                                className="AknButton AknButton--apply AknFullPage-ok ok confirm"
                                onClick={this.props.events.onTableEditionSubmission}
                            >
                                {__('pim_reference_entity.attribute.create.confirm')}
                            </button>
                        ) : null}
                        <div
                            title={__('pim_reference_entity.attribute.create.cancel')}
                            className="AknFullPage-cancel cancel"
                            onClick={this.cancelManageTableAttribute.bind(this)}
                            tabIndex={0}
                            onKeyPress={event => {
                                if (Key.Space === event.key) this.cancelManageTableAttribute();
                            }}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(
    (state: any, ownProps: OwnProps) => {
        return {
            test: false,
            store: store,
            locale: state.user.catalogLocale,
            structure: {
                locales: state.structure.locales,
            },
            errors: [],
            isDirty: false,
            rights: {
                locale: {
                    edit: ownProps.rights.locale.edit,
                },
                attribute: {
                    create: ownProps.rights.attribute.create && securityContext.isGranted('akeneo_referenceentity_option_create'),
                    edit: ownProps.rights.attribute.edit && securityContext.isGranted('akeneo_referenceentity_option_edit'),
                    delete:
                        ownProps.rights.attribute.edit &&
                        securityContext.isGranted('akeneo_referenceentity_option_delete') &&
                        securityContext.isGranted('akeneo_referenceentity_option_edit'),
                },
            },
        };
    },
    (dispatch: any) => {
        return {
            events: {
                onTableEditionCancel: () => {
                    $('#table').css({'display': 'none'});
                    dispatch({type: 'FLAGBIT_TABLE_EDITION_CLOSE'});
                },
                onTableSubmission: () => {
                    // dispatch({});
                },
                onTableEditionCodeUpdated: () => {
                    // dispatch({});
                },
                onTableEditionSelected: () => {
                    // dispatch({});
                },
                onTableEditionLabelUpdated: () => {
                    // dispatch({});
                },
                onLocaleChanged: () => {
                    // dispatch({});
                },
                onTableEditionSubmission: () => {
                    // dispatch({});
                },
                onTableEditionDelete: () => {
                    // dispatch({});
                },
            },
        }
    }
)(TableAttributeModal);

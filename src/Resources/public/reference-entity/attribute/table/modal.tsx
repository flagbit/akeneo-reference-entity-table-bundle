import * as React from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import __ from 'akeneoreferenceentity/tools/translator';
import ValidationError from 'akeneoreferenceentity/domain/model/validation-error';
import Locale from 'akeneoreferenceentity/domain/model/locale';
import lodash from 'lodash';
import { RightsType } from './view';

import { TableAttribute, TableRow, TableProperty } from './table';
import { tableRow } from './row';

type OwnProps = {
    rights: RightsType;
};

interface TableProp extends OwnProps {
    isDirty: boolean;
    errors: ValidationError[];
    saveTable: (tableRows: TableRow[]) => void;
    attribute: TableAttribute;
    locale: string;
    structure: {
        locales: Locale[];
    };
}

class TableAttributeModal extends React.Component<TableProp> {
    private readonly modalSelector = 'body .app:first > #flagbit_table_' + this.props.attribute.getCode().stringValue();
    private readonly modalContainerSelector = '#flagbit_container_' + this.props.attribute.getCode().stringValue();
    private initialState: TableRow[];

    cancelManageTableAttribute() {
        const message = __('pim_enrich.confirmation.discard_changes', {
            entity: 'table_property',
        });
        // todo implement isDirty check. This one doesn't work yet.
        if (this.props.isDirty) {
            if (confirm(message)) {
                this.closeModal();
            }
        } else {
            this.closeModal();
        }
    }

    getInitialTableRows(): TableRow[] {
        if (this.initialState !== undefined) {
            return lodash.cloneDeep(this.initialState);
        }

        const emptyRow: TableRow = TableProperty.createEmptyRow(this.props.structure.locales);
        this.initialState = [...this.props.attribute.table_property.normalize(), emptyRow];

        return lodash.cloneDeep(this.initialState);
    }

    filterEmpty(tableRows: TableRow[]): TableRow[] {
        return tableRows.filter((row: TableRow): boolean => {
            const val =
                Object.keys(row.config).length === 0 &&
                row.type === 'text' &&
                row.code === '' &&
                Object.values(row.labels).filter((value: string): boolean => '' !== value).length === 0;

            return !val;
        });
    }

    updateTableRowsState(tableRows: TableRow[]): void {
        tableRows = this.filterEmpty(tableRows);

        const emptyRow = TableProperty.createEmptyRow(this.props.structure.locales);
        tableRows.push(emptyRow);

        this.setState({ tableRows: tableRows });
    }

    closeModal(): void {
        $(this.modalSelector).css({ display: 'none' });
        $(this.modalSelector).detach().prependTo(this.modalContainerSelector);

        this.updateTableRowsState(this.getInitialTableRows());
    }

    getTableRows(): TableRow[] {
        // Initialize rows when state isn't set yet
        if (null === this.state) {
            return this.getInitialTableRows();
        }

        // @ts-ignore
        return this.state.tableRows;
    }

    updateColumnType(value: string, index: number): void {
        const tableRows: TableRow[] = this.getTableRows();
        tableRows[index].type = value;

        this.updateTableRowsState(tableRows);
    }

    updateColumnConfig(config: object, index: number): void {
        const tableRows: TableRow[] = this.getTableRows();
        tableRows[index].config = config;

        this.updateTableRowsState(tableRows);
    }

    updateColumnCode(code: string, index: any): void {
        const tableRows: TableRow[] = this.getTableRows();
        tableRows[index].code = code;

        this.updateTableRowsState(tableRows);
    }

    updateColumnLabel(label: string, locale: string, index: any): void {
        const tableRows: TableRow[] = this.getTableRows();
        tableRows[index].labels[locale] = label;

        this.updateTableRowsState(tableRows);
    }

    onTableEditionSubmission(): void {
        const newState = this.filterEmpty(this.getTableRows());
        this.props.saveTable(newState);
        this.initialState = lodash.cloneDeep(newState);

        $(this.modalSelector).css({ display: 'none' });
        $(this.modalSelector).detach().prependTo(this.modalContainerSelector);
    }

    onTableEditionDelete(index: number): void {
        const message = __('pim_enrich.confirmation.discard_changes', {
            entity: 'Column',
        });
        if (confirm(message)) {
            const tableRows: TableRow[] = this.getTableRows();
            tableRows.splice(index, 1);

            this.updateTableRowsState(tableRows);
        }
    }

    renderLabel(): string {
        try {
            return this.props.attribute.getLabelCollection().getLabel(this.props.locale);
        } catch (e) {
            // No Label available for language
            return this.props.attribute.getCode().stringValue();
        }
    }

    render() {
        return (
            <React.Fragment>
                <div
                    className="modal in flagbitTableAttribute"
                    id={`flagbit_table_${this.props.attribute.getCode().stringValue()}`}
                    aria-hidden="false"
                    style={{ zIndex: 1042, display: 'none' }}
                >
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
                                            <span className="AknSubsection-titleLabel">{this.renderLabel()}</span>
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
                                                                <label className="AknOptionEditor-headCellLabel">
                                                                    {__('flagbit_reference_entity_table.attribute.edit.input.label')}{' '}
                                                                    {locale.code}
                                                                </label>
                                                            </th>
                                                        );
                                                    })}
                                                    <th className="AknOptionEditor-headCell">
                                                        <label className="AknOptionEditor-headCellLabel">
                                                            {__('flagbit_reference_entity_table.attribute.edit.input.type')}
                                                        </label>
                                                    </th>
                                                    <th className="AknOptionEditor-headCell">
                                                        <label className="AknOptionEditor-headCellLabel">
                                                            {__('flagbit_reference_entity_table.attribute.edit.input.configuration')}
                                                        </label>
                                                    </th>
                                                    <th className="AknOptionEditor-headCell">
                                                        <label className="AknOptionEditor-headCellLabel" />
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.getTableRows().map((row, index: number) => {
                                                    return tableRow({
                                                        row: row,
                                                        index: index,
                                                        isLastRow: index >= this.getTableRows().length - 1,
                                                        numberOfLockedRows: this.getTableRows().length,
                                                        locales: this.props.structure.locales,
                                                        errors: this.props.errors,
                                                        rights: this.props.rights,
                                                        onTableEditionCodeUpdated: this.updateColumnCode.bind(this),
                                                        onTableEditionLabelUpdated: this.updateColumnLabel.bind(this),
                                                        onTableEditionTypeUpdated: this.updateColumnType.bind(this),
                                                        onTableEditionConfigUpdated: this.updateColumnConfig.bind(this),
                                                        onTableEditionDelete: this.onTableEditionDelete.bind(this),
                                                    });
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id={'table_attribute_modal_buttons'} className="AknButtonList AknButtonList--right modal-footer">
                        {this.props.rights.attribute.edit ? (
                            <button
                                className="AknButton AknButton--apply AknFullPage-ok ok confirm"
                                onClick={this.onTableEditionSubmission.bind(this)}
                            >
                                {__('flagbit_reference_entity_table.attribute.confirm')}
                            </button>
                        ) : null}
                        <div
                            role="button"
                            title={__('pim_reference_entity.attribute.create.cancel')}
                            className="AknFullPage-cancel cancel"
                            onClick={this.cancelManageTableAttribute.bind(this)}
                            tabIndex={0}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect((state: any, ownProps: OwnProps) => {
    const securityContext = require('pim/security-context');
    return {
        locale: state.user.catalogLocale,
        structure: {
            locales: state.structure.locales,
        },
        errors: state.attribute.errors,
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
})(TableAttributeModal);

import * as React from 'react';
import Value from 'akeneoreferenceentity/domain/model/record/value';
import LocaleReference from 'akeneoreferenceentity/domain/model/locale-reference';
import Close from 'akeneoreferenceentity/application/component/app/icon/close';
import __ from 'akeneoreferenceentity/tools/translator';
import { ConcreteTableAttribute, TableRow } from '../../attribute/table/table';
import { TableData, TableDataRow } from './table';
import { RecordChangeState, FlagbitTableRecordTypes } from './type/type';
import ValueUpdater from './value/value-updater';

const recordView = ({ value, onChange, locale }: { value: Value; onChange: (value: Value) => void; locale: LocaleReference }) => {
    if (!(value.data instanceof TableData && value.attribute instanceof ConcreteTableAttribute)) {
        return null;
    }

    const attributeCode: string = value.attribute.getCode().normalize();
    const tableRows: TableRow[] = value.attribute.table_property.normalize();

    const valueUpdater = new ValueUpdater(value, onChange);

    return (
        <React.Fragment>
            <table className="AknOptionEditor-table" style={{ marginTop: '20px' }}>
                <thead>
                    <tr>
                        {tableRows.map((tableRow: TableRow) => {
                            return (
                                <th className="AknOptionEditor-headCell" key={`title_${attributeCode}_${tableRow.code}`}>
                                    <label className="AknOptionEditor-headCellLabel">
                                        {tableRow.labels[locale.stringValue()] || `[${tableRow.code}]`}
                                    </label>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {valueUpdater.tableDataRows.map((rowData: TableDataRow, index: number) => {
                        return (
                            <tr className="AknOptionEditor-row" key={`row_${attributeCode}_${index}`}>
                                {tableRows.map((tableRow: TableRow) => {
                                    const recordChangeState: RecordChangeState = {
                                        index: index,
                                        rowData: rowData,
                                        tableRow: tableRow,
                                        updateValue: valueUpdater.updateValue.bind(valueUpdater),
                                        locale: locale,
                                    };

                                    return (
                                        <td key={`column_${attributeCode}_${tableRow.code}_${index}`}>
                                            {FlagbitTableRecordTypes.typeRegistry.render(recordChangeState)}
                                        </td>
                                    );
                                })}
                                <td>
                                    {valueUpdater.tableDataRows.length - 1 !== index ? (
                                        <Close
                                            onClick={() =>
                                                valueUpdater.removeDataRow(
                                                    index,
                                                    __('flagbit_reference_entity_table.record.table_row.confirm')
                                                )
                                            }
                                            color="#67768A"
                                            className="AknOptionEditor-remove"
                                            tabIndex={0}
                                        />
                                    ) : null}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </React.Fragment>
    );
};

// ts-unused-exports:disable-next-line
export const view = recordView;

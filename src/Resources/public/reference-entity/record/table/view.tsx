import * as React from 'react';
import Value from 'akeneoreferenceentity/domain/model/record/value';
import LocaleReference from 'akeneoreferenceentity/domain/model/locale-reference';
import Close from 'akeneoreferenceentity/application/component/app/icon/close';
import __ from 'akeneoreferenceentity/tools/translator';
import { ConcreteTableAttribute, TableRow } from '../../attribute/table/table';
import { denormalize, TableData, TableDataRow } from './table';
import { RecordChangeState, FlagbitTableRecordTypes } from './type/type';

const recordView = ({ value, onChange, locale }: { value: Value; onChange: (value: Value) => void; locale: LocaleReference }) => {
    if (!(value.data instanceof TableData && value.attribute instanceof ConcreteTableAttribute)) {
        return null;
    }

    // Remove all rows that became empty.
    const filterEmptyRows = (tableDataRows: TableDataRow[]): TableDataRow[] => {
        return tableDataRows.filter((tableDataRow: TableDataRow): boolean => {
            const rowValues: any[] = Object.values(tableDataRow);

            return !rowValues.every((fieldValue) => {
                return fieldValue === null;
            });
        });
    };

    const attributeCode: string = value.attribute.getCode().normalize();
    const tableRows: TableRow[] = value.attribute.table_property.normalize();
    const normalizedTableData: TableDataRow[] = filterEmptyRows(value.data.normalize());

    const createEmptyRow = (): TableDataRow => {
        const emptyTableDataRow: TableDataRow = {};
        tableRows.forEach((tableRow: TableRow) => {
            emptyTableDataRow[tableRow.code] = null;
        });

        return emptyTableDataRow;
    };

    normalizedTableData.push(createEmptyRow());

    const updateDataRows = (tableDataRow: TableDataRow[]) => {
        const newTableData = denormalize(filterEmptyRows(tableDataRow));
        if (newTableData.equals(value.data)) {
            return;
        }

        const newValue = value.setData(newTableData);

        onChange(newValue);
    };

    const updateValue = (code: string, fieldValue: any, index: number) => {
        normalizedTableData[index][code] = fieldValue;

        updateDataRows(normalizedTableData);
    };

    const removeDataRow = (index: number) => {
        const message = __('flagbit_reference_entity_table.record.table_row.confirm');
        if (confirm(message)) {
            normalizedTableData.splice(index, 1);
            updateDataRows(normalizedTableData);
        }
    };

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
                    {normalizedTableData.map((rowData: TableDataRow, index: number) => {
                        return (
                            <tr className="AknOptionEditor-row" key={`row_${attributeCode}_${index}`}>
                                {tableRows.map((tableRow: TableRow) => {
                                    const recordChangeState: RecordChangeState = {
                                        index: index,
                                        rowData: rowData,
                                        tableRow: tableRow,
                                        updateValue: updateValue,
                                        locale: locale,
                                    };

                                    return (
                                        <td key={`column_${attributeCode}_${tableRow.code}_${index}`}>
                                            {FlagbitTableRecordTypes.typeRegistry.render(recordChangeState)}
                                        </td>
                                    );
                                })}
                                <td>
                                    {normalizedTableData.length - 1 !== index ? (
                                        <Close
                                            onClick={() => removeDataRow(index)}
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

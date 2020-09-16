import { Type, RecordChangeState } from './type';
import React from 'react';
import { SelectConfig } from '../../../attribute/table/type/select';

export default class Select implements Type {
    constructor(readonly typeCode: string) {}

    render(recordRowData: RecordChangeState) {
        const config: SelectConfig = recordRowData.tableRow.config as SelectConfig;

        return (
            <React.Fragment key={this.typeCode + recordRowData.index}>
                <select
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                        recordRowData.updateValue(recordRowData.tableRow.code, event.currentTarget.value, recordRowData.index);
                    }}
                    value={recordRowData.rowData[recordRowData.tableRow.code] || ''}
                >
                    {config.options.map((option, index: number) => {
                        return (
                            <option key={`select${recordRowData.index}_${index}`} value={option.code}>
                                {option.value}
                            </option>
                        );
                    })}
                </select>
            </React.Fragment>
        );
    }
}

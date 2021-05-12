import { Type, RecordChangeState } from './type';
import React from 'react';
import { SelectConfig } from '../../../attribute/table/type/localized-select';

export default class LocalizedSelect implements Type {
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
                    {config.options.length !== 0 ? (<option>{''}</option>) : ''}
                    {config.options.map((option, index: number) => {
                        let value: string = option.code.length === 0 ? '' : '[' + option.code + ']';
                        const locale: string = recordRowData.locale.stringValue();
                        if (locale in option.values && option.values[locale] !== '') {
                            value = option.values[locale];
                        }

                        return (
                            <option key={`select_localized${recordRowData.index}_${index}`} value={option.code}>
                                {value}
                            </option>
                        );
                    })}
                </select>
            </React.Fragment>
        );
    }
}

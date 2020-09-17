import { Type, RecordChangeState } from './type';
import React from 'react';
import { NumberConfig } from '../../../attribute/table/type/number';

export default class Number implements Type {
    constructor(readonly typeCode: string) {}

    render(recordRowData: RecordChangeState) {
        const config: NumberConfig = recordRowData.tableRow.config as NumberConfig;
        const isDecimal: boolean = config.decimal === 'true';

        return (
            <React.Fragment key={this.typeCode + recordRowData.index}>
                <input
                    type="number"
                    step={isDecimal ? '0.1' : '1.0'}
                    autoComplete="off"
                    className={`AknTextField AknTextField--narrow AknTextField--light`}
                    value={recordRowData.rowData[recordRowData.tableRow.code] || ''}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        recordRowData.updateValue(recordRowData.tableRow.code, event.currentTarget.value, recordRowData.index);
                    }}
                />
            </React.Fragment>
        );
    }
}

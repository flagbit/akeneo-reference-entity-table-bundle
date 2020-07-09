import {Type, RecordChangeState} from "./type";
import React from "react";

export default class Text implements Type {
    constructor(readonly typeCode: string) {}

    render(recordRowData: RecordChangeState) {
        return (<React.Fragment key={this.typeCode+recordRowData.index}>
            <input
                id={`pim_reference_entity.record.enrich.${this.typeCode}.${recordRowData.index}`}
                type="text"
                autoComplete="off"
                className={`AknTextField AknTextField--narrow AknTextField--light`}
                value={recordRowData.rowData[recordRowData.tableRow.code] || ''}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    recordRowData.updateValue(recordRowData.tableRow.code, event.currentTarget.value, recordRowData.index);
                }}
            />
        </React.Fragment>);
    }
}

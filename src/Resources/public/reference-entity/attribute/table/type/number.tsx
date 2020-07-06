import {Type, ConfigChangeState} from "./type";
import __ from 'akeneoreferenceentity/tools/translator';
import React from "react";

type NumberConfig = {
    decimal: 'true' | 'false'
}

export default class Number implements Type {
    private readonly default = {
        decimal: 'false'
    };

    constructor(readonly typeCode: string) {}

    render(changeState: ConfigChangeState) {
        const key = this.typeCode+changeState.index;
        // TODO This needs a better type/content check
        const config = Object.keys(changeState.config).length === 0 ? this.default : changeState.config as NumberConfig;

        return (<React.Fragment key={key}>
            <label>{__('flagbit_reference_entity_table.attribute.column_type.number.label.decimal')}</label>
            <select
                name="is_decimal"
                onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
                    config.decimal = event.target.value;
                    changeState.updateConfig(config, changeState.index);
                }}
                value={config.decimal}
            >
                <option value="true">Yes</option>
                <option value="false">No</option>
            </select>
        </React.Fragment>)
    }
}

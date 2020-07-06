import {Type, ConfigChangeState} from "./type";
import __ from 'akeneoreferenceentity/tools/translator';
import React from "react";

export default class Text implements Type {
    constructor(readonly typeCode: string) {}

    render(changeState: ConfigChangeState) {
        return (<React.Fragment key={this.typeCode+changeState.index}>{__('flagbit_reference_entity_table.attribute.column_type.text.no_config')}</React.Fragment>);
    }
}

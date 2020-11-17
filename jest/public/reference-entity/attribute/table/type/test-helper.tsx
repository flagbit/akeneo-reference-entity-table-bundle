import {
    ConfigChangeState,
    FlagbitTableTypes
} from "../../../../../../src/Resources/public/reference-entity/attribute/table/type/type";
import {shallow} from "enzyme";
import * as React from "react";


function renderType(config, type: string, onchange: (config: object, index: number) => void) {
    const configChangeState: ConfigChangeState = {
        typeCode: type,
        updateConfig: onchange,
        index: 0,
        config: config,
        supportedLocales: [],
    };

    const AttributeType = () => FlagbitTableTypes.typeRegistry.render(configChangeState);

    return shallow(<AttributeType />);
}

export default renderType;

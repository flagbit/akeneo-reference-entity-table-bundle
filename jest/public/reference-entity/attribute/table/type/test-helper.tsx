import { ConfigChangeState, FlagbitTableTypes } from '../../../../../../src/Resources/public/reference-entity/attribute/table/type/type';
import Locale from 'akeneoreferenceentity//domain/model/locale';
import { shallow } from 'enzyme';
import * as React from 'react';
import { render } from '@testing-library/react';
import { Type } from '../../../../../../src/Resources/public/reference-entity/attribute/table/type/type';

function renderType(config, type: Type, onchange: (config: object, index: number) => void, supportedLocales: Locale[] = []) {
    const configChangeState: ConfigChangeState = {
        typeCode: type.typeCode,
        updateConfig: onchange,
        index: 0,
        config: config,
        supportedLocales: supportedLocales,
    };

    const AttributeType = () => type.render(configChangeState);

    return shallow(<AttributeType />);
}

function asyncRenderType(config, type: Type, onchange: (config: object, index: number) => void, supportedLocales: Locale[] = []) {
    const configChangeState: ConfigChangeState = {
        typeCode: type.typeCode,
        updateConfig: onchange,
        index: 0,
        config: config,
        supportedLocales: supportedLocales,
    };

    const AttributeType = () => type.render(configChangeState);

    return render(<AttributeType />);
}

export default renderType;
export const renderTypeForAsync = asyncRenderType;

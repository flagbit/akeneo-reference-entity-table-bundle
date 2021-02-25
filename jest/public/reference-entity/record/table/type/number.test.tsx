import { RecordChangeState, FlagbitTableRecordTypes } from '../../../../../../src/Resources/public/reference-entity/record/table/type/type';
import { NumberConfig } from '../../../../../../src/Resources/public/reference-entity/attribute/table/type/number';
import LocaleReference from 'akeneoreferenceentity/domain/model/locale-reference';
import * as React from 'react';
import { shallow } from 'enzyme';

describe('Number type', function () {
    test('Default rendering', function () {
        const renderedRecordType = renderType({}, jest.fn());

        const input = renderedRecordType.find('input');

        expect(input.length).toBe(1);
        expect(input.props().value).toBe('');
        expect(input.props().type).toBe('number');
        expect(input.props().step).toBe('1.0');
    });

    test('Rendering with saved value', function () {
        const renderedRecordType = renderType({ int: 5.4 }, jest.fn());

        const input = renderedRecordType.find('input');

        expect(input.props().value).toBe(5.4);
    });

    test('Configuration of decimal values', function () {
        const renderedRecordType = renderType({}, jest.fn(), { decimal: 'true' });

        const input = renderedRecordType.find('input');

        expect(input.props().step).toBe('0.1');
    });

    test('onChange event', function () {
        const onchange = jest.fn();
        const renderedRecordType = renderType({ code: 'test' }, onchange);

        const input = renderedRecordType.find('input');

        input.simulate('change', { currentTarget: { value: 42 } });

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toBe('int');
        expect(onchange.mock.calls[0][1]).toBe(42);
        expect(onchange.mock.calls[0][2]).toBe(2);
    });
});

function renderType(rowData, onchange: (code: string, value: any, index: number) => void, config = {}) {
    const RecordType = () =>
        FlagbitTableRecordTypes.typeRegistry.render(createRecordChangeState(rowData, onchange, config as NumberConfig));

    return shallow(<RecordType />);
}

function createRecordChangeState(
    rowData,
    onchange: (code: string, value: any, index: number) => void,
    config: NumberConfig
): RecordChangeState {
    return {
        tableRow: {
            code: 'int',
            labels: { de_DE: 'DE' },
            type: 'number',
            validations: [],
            config: config,
        },
        updateValue: onchange,
        index: 2,
        rowData: rowData,
        locale: LocaleReference.create('de_DE'),
    };
}

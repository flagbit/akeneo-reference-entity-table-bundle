import TextType from '../../../../../../src/Resources/public/reference-entity/record/table/type/text';
import { RecordChangeState } from '../../../../../../src/Resources/public/reference-entity/record/table/type/type';
import LocaleReference from 'akeneoreferenceentity/domain/model/locale-reference';
import * as React from 'react';
import { shallow } from 'enzyme';

describe('Text type', function () {
    test('Default rendering', function () {
        const renderedRecordType = renderType({}, jest.fn());

        const input = renderedRecordType.find('input');

        expect(input.length).toBe(1);
        expect(input.props().value).toBe('');
        expect(input.props().type).toBe('text');
    });

    test('Rendering with saved value', function () {
        const renderedRecordType = renderType({ code: 'test' }, jest.fn());

        const input = renderedRecordType.find('input');

        expect(input.props().value).toBe('test');
    });

    test('onChange event', function () {
        const onchange = jest.fn();
        const renderedRecordType = renderType({ code: 'test' }, onchange);

        const input = renderedRecordType.find('input');

        input.simulate('change', { currentTarget: { value: 'foo' } });

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toBe('code');
        expect(onchange.mock.calls[0][1]).toBe('foo');
        expect(onchange.mock.calls[0][2]).toBe(0);
    });
});

function renderType(rowData, onchange: (code: string, value: any, index: number) => void) {
    const RecordType = () => new TextType('text').render(createRecordChangeState(rowData, onchange));

    return shallow(<RecordType />);
}

function createRecordChangeState(rowData, onchange: (code: string, value: any, index: number) => void): RecordChangeState {
    return {
        tableRow: {
            code: 'code',
            labels: { de_DE: 'DE' },
            type: 'text',
            validations: [],
            config: {},
        },
        updateValue: onchange,
        index: 0,
        rowData: rowData,
        locale: LocaleReference.create('de_DE'),
    };
}

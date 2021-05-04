import SelectType from '../../../../../../src/Resources/public/reference-entity/record/table/type/select';
import { RecordChangeState } from '../../../../../../src/Resources/public/reference-entity/record/table/type/type';
import { SelectConfig } from '../../../../../../src/Resources/public/reference-entity/attribute/table/type/select';
import LocaleReference from 'akeneoreferenceentity/domain/model/locale-reference';
import * as React from 'react';
import { shallow } from 'enzyme';

describe('Simple Select type', function () {
    test('Default rendering', function () {
        const renderedRecordType = renderType({}, jest.fn());

        const select = renderedRecordType.find('select');

        expect(select.length).toBe(1);
        expect(select.find('option').length).toBe(0);
        expect(select.props().value).toBe('');
    });

    test('Rendering with options', function () {
        const options = {
            options: [
                { code: 'foo', value: 'A' },
                { code: 'bar', value: 'B' },
                { code: 'baz', value: 'C' },
            ],
        };
        const renderedRecordType = renderType({ selection: 'foo' }, jest.fn(), options);

        const optionList = renderedRecordType.find('select').find('option');

        expect(optionList.length).toBe(3);

        expect(optionList.at(0).props().value).toBe('foo');
        expect(optionList.at(0).text()).toBe('A');

        expect(optionList.at(1).props().value).toBe('bar');
        expect(optionList.at(1).text()).toBe('B');

        expect(optionList.at(2).props().value).toBe('baz');
        expect(optionList.at(2).text()).toBe('C');
    });

    test('Rendering with saved value', function () {
        const renderedRecordType = renderType({ selection: 'foo' }, jest.fn());

        const select = renderedRecordType.find('select');

        expect(select.props().value).toBe('foo');
    });

    test('onChange event', function () {
        const onchange = jest.fn();
        const renderedRecordType = renderType({ code: 'test' }, onchange);

        const select = renderedRecordType.find('select');

        select.simulate('change', { currentTarget: { value: 'foo' } });

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toBe('selection');
        expect(onchange.mock.calls[0][1]).toBe('foo');
        expect(onchange.mock.calls[0][2]).toBe(1);
    });
});

function renderType(rowData, onchange: (code: string, value: any, index: number) => void, config = { options: [] }) {
    const RecordType = () => new SelectType('selection').render(createRecordChangeState(rowData, onchange, config as SelectConfig));

    return shallow(<RecordType />);
}

function createRecordChangeState(
    rowData,
    onchange: (code: string, value: any, index: number) => void,
    config: SelectConfig
): RecordChangeState {
    return {
        tableRow: {
            code: 'selection',
            labels: { de_DE: 'DE' },
            type: 'simple_select',
            validations: [],
            config: config,
        },
        updateValue: onchange,
        index: 1,
        rowData: rowData,
        locale: LocaleReference.create('de_DE'),
    };
}

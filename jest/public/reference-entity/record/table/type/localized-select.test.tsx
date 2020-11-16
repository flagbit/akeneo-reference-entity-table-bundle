import {
    RecordChangeState,
    FlagbitTableRecordTypes
} from "../../../../../../src/Resources/public/reference-entity/record/table/type/type";
import { SelectConfig } from '../../../../../../src/Resources/public/reference-entity/attribute/table/type/localized-select';
import LocaleReference from 'akeneoreferenceentity/domain/model/locale-reference';
import * as React from 'react';
import { shallow } from 'enzyme';

describe('Localized Simple Select type', function () {
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
                {code: 'foo', values: {de_DE: 'Das A', en_US: 'The A'}},
                {code: 'bar', values: {de_DE: 'Das B', en_US: 'The B'}},
                {code: 'baz', values: {de_DE: 'Das C', en_US: 'The C'}},
            ]
        }
        const renderedRecordType = renderType({selection: 'foo'}, jest.fn(), options);

        const optionList = renderedRecordType.find('select').find('option');

        expect(optionList.length).toBe(3);

        expect(optionList.at(0).props().value).toBe('foo');
        expect(optionList.at(0).text()).toBe('Das A');

        expect(optionList.at(1).props().value).toBe('bar');
        expect(optionList.at(1).text()).toBe('Das B');

        expect(optionList.at(2).props().value).toBe('baz');
        expect(optionList.at(2).text()).toBe('Das C');
    });

    test('Show code in option if no value is given', function () {
        const options = {
            options: [
                {code: 'foo', values: {de_DE: '', en_US: 'The A'}},
            ]
        }
        const renderedRecordType = renderType({selection: 'foo'}, jest.fn(), options);

        const optionList = renderedRecordType.find('select').find('option');

        expect(optionList.length).toBe(1);

        expect(optionList.at(0).props().value).toBe('foo');
        expect(optionList.at(0).text()).toBe('[foo]');
    });

    test('Rendering with saved value', function () {
        const renderedRecordType = renderType({selection: 'foo'}, jest.fn());

        const select = renderedRecordType.find('select');

        expect(select.props().value).toBe('foo');
    });

    test('onChange event', function () {
        const onchange = jest.fn();
        const renderedRecordType = renderType({code: 'test'}, onchange);

        const select = renderedRecordType.find('select');

        select.simulate('change', { currentTarget: { value: 'foo' }});

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toBe('selection');
        expect(onchange.mock.calls[0][1]).toBe('foo');
        expect(onchange.mock.calls[0][2]).toBe(1);
    });
});

function renderType(rowData, onchange: (code: string, value: any, index: number) => void, config = {options: []}) {
    const RecordType = () => FlagbitTableRecordTypes.typeRegistry.render(createRecordChangeState(rowData, onchange, config as SelectConfig));

    return shallow(<RecordType />);
}

function createRecordChangeState(rowData, onchange: (code: string, value: any, index: number) => void, config: SelectConfig): RecordChangeState {
    return {
        tableRow: {
            code: 'selection',
            labels: {de_DE: 'DE'},
            type: 'simple_select_localized',
            validations: [],
            config: config,
        },
        updateValue: onchange,
        index: 1,
        rowData: rowData,
        locale: LocaleReference.create('de_DE'),
    };
}

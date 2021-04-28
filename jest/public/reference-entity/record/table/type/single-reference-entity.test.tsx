import SingleReferenceEntityType from '../../../../../../src/Resources/public/reference-entity/record/table/type/single-reference-entity';
import { RecordChangeState } from '../../../../../../src/Resources/public/reference-entity/record/table/type/type';
import { RefEntityConfig } from '../../../../../../src/Resources/public/reference-entity/attribute/table/type/single-reference-entity';
import LocaleReference from 'akeneoreferenceentity/domain/model/locale-reference';
import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

const userContent = { catalogLocale: 'de_DE', catalogScope: 'ecommerce' };
jest.mock(
    'pim/user-context',
    () => ({
        get: jest.fn().mockImplementation((key: string) => userContent[key]),
    }),
    { virtual: true }
);

describe('Single Reference Entity type', function () {
    test('Default rendering', function () {
        const { container } = renderType({}, jest.fn());

        const select = container.getElementsByTagName('select');
        const options = container.getElementsByTagName('option');

        expect(select.length).toBe(1);
        expect(options.length).toBe(0);
        expect(select.item(0).value).toBe('');
    });

    test('Rendering with options', async function () {
        const { container } = renderType({ selection: 'foo' }, jest.fn());

        const optionList = await waitFor(() => container.getElementsByTagName('option'));

        expect(optionList.length).toBe(3);

        expect(optionList[0].value).toBe('foo');
        expect(optionList[0].textContent).toBe('A');

        expect(optionList[1].value).toBe('bar');
        expect(optionList[1].textContent).toBe('B');

        expect(optionList[2].value).toBe('baz');
        expect(optionList[2].textContent).toBe('C');
    });

    test('Rendering with saved value', async function () {
        const { container } = renderType({ selection: 'foo' }, jest.fn());

        const select = await waitFor(() => container.getElementsByTagName('select'));

        expect(select[0].value).toBe('foo');
    });

    test('onChange event', async function () {
        const onchange = jest.fn();
        const { container } = renderType({ code: 'test' }, onchange);

        const select = await waitFor(() => container.getElementsByTagName('select'));

        fireEvent.change(select[0], { target: { value: 'foo' } });

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toBe('selection');
        expect(onchange.mock.calls[0][1]).toBe('foo');
        expect(onchange.mock.calls[0][2]).toBe(1);
    });
});

function renderType(
    rowData,
    onchange: (code: string, value: any, index: number) => void,
    config: RefEntityConfig = { ref_entity_code: '' }
) {
    const RecordType = () =>
        new SingleReferenceEntityType('single_reference_entity').render(
            createRecordChangeState(rowData, onchange, config as RefEntityConfig)
        );

    return render(<RecordType />);
}

function createRecordChangeState(
    rowData,
    onchange: (code: string, value: any, index: number) => void,
    config: RefEntityConfig
): RecordChangeState {
    return {
        tableRow: {
            code: 'selection',
            labels: { de_DE: 'DE' },
            type: 'single_reference_entity',
            validations: [],
            config: config,
        },
        updateValue: onchange,
        index: 1,
        rowData: rowData,
        locale: LocaleReference.create('de_DE'),
    };
}

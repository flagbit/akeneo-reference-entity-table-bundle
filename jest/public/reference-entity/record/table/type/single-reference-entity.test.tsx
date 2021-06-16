import SingleReferenceEntityType from '../../../../../../src/Resources/public/reference-entity/record/table/type/single-reference-entity';
import { RecordChangeState } from '../../../../../../src/Resources/public/reference-entity/record/table/type/type';
import { RefEntityConfig } from '../../../../../../src/Resources/public/reference-entity/attribute/table/type/single-reference-entity';
import LocaleReference from 'akeneoreferenceentity/domain/model/locale-reference';
import * as React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

const userContent = { catalogLocale: 'de_DE', catalogScope: 'ecommerce' };
jest.mock(
    'pim/user-context',
    () => ({
        get: jest.fn().mockImplementation((key: string) => userContent[key]),
    }),
    { virtual: true }
);

describe('Single Reference Entity type', function () {
    test('Default HTML rendering', async function () {
        const { container } = renderType({ selection: 'foo' }, jest.fn());

        const input = container.querySelector('#mycode_1_select');

        expect(input.getAttribute('value')).toBe('foo');
    });

    test('Rendering with options', async function () {
        const { container } = renderType({ selection: 'foo' }, jest.fn());

        const asyncContainer = await waitFor(() => container);
        const a = await waitFor(() => asyncContainer.getElementsByTagName('a').item(0));

        fireEvent.mouseDown(a);

        const optionList = window.document.querySelectorAll('.select2-results li');

        expect(optionList.length).toBe(3);
        expect(optionList[0].textContent).toBe('A');
        expect(optionList[1].textContent).toBe('B');
        expect(optionList[2].textContent).toBe('C');
    });

    test('onChange event', async function () {
        const onchange = jest.fn();
        const { container } = renderType({ code: 'test' }, onchange);

        const input = await waitFor(() => container.querySelector('#mycode_1_select'));

        fireEvent.change(input, { target: { value: 'foo' } });

        expect(onchange.mock.calls.length).toBeGreaterThanOrEqual(1);
        expect(onchange.mock.calls[0][0]).toBe('selection');
        expect(onchange.mock.calls[0][1]).toBe('foo');
        expect(onchange.mock.calls[0][2]).toBe(1);
    });
});

function renderType(
    rowData,
    onchange: (code: string, value: any, index: number) => void,
    config: RefEntityConfig = { ref_entity_code: 'mycode' }
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

import {
    ConcreteTableAttribute,
    TableAttribute,
    TableRow
} from "../../../../../src/Resources/public/reference-entity/attribute/table/table";
import TableAttributeModal from "../../../../../src/Resources/public/reference-entity/attribute/table/modal";
import { RightsType } from "../../../../../src/Resources/public/reference-entity/attribute/table/view";
import { createLocales, accessRightsTrue, accessRightsFalse } from "../../test-helper";
import * as React from "react";
import { Provider } from 'react-redux';
import { createStore }  from 'redux';
import { render, fireEvent } from '@testing-library/react';

jest.mock('pim/security-context', () => ({
    isGranted: jest.fn().mockImplementation(() => true)
}), {virtual: true});

describe('Modal view', function () {
    test('Default rendering', function () {
        const { container } = renderView();

        // Table header content and order
        const th = container.getElementsByTagName('th');
        expect(th.length).toBe(6);
        expect(th[0].textContent).toBe('flagbit_reference_entity_table.attribute.edit.input.code');
        expect(th[1].textContent).toBe('flagbit_reference_entity_table.attribute.edit.input.label de_DE');
        expect(th[2].textContent).toBe('flagbit_reference_entity_table.attribute.edit.input.label en_US');
        expect(th[3].textContent).toBe('flagbit_reference_entity_table.attribute.edit.input.type');
        expect(th[4].textContent).toBe('flagbit_reference_entity_table.attribute.edit.input.configuration');
        expect(th[5].textContent).toBe('');

        expectEmptyRow(container);

        expect(container.firstElementChild.id).toBe('flagbit_table_attribute_code');
    });

    test('Confirm button does not appear without having edit rights', function () {
        const { container } = renderView({rights: accessRightsFalse});

        expect(container.getElementsByTagName('button').length).toBe(0);
    });

    test('Add new empty row on edit of last row\'s code', function () {
        const { container } = renderView();

        // 1 row with th + 1 row with td
        expect(container.getElementsByTagName('tr').length).toBe(2);

        const input = container.getElementsByTagName('input')[0];
        changeInputField(input, 'foo');

        expect(input.value).toBe('foo');

        expect(container.getElementsByTagName('tr').length).toBe(3);
        expectEmptyRow(container.getElementsByTagName('tr').item(2));
    });

    test('Add new empty row on edit of last row\'s label', function () {
        const { container } = renderView();

        // 1 row with th + 1 row with td
        expect(container.getElementsByTagName('tr').length).toBe(2);

        const input = container.getElementsByTagName('input')[1];
        changeInputField(input, 'foo');

        expect(input.value).toBe('foo');

        expect(container.getElementsByTagName('tr').length).toBe(3);
        expectEmptyRow(container.getElementsByTagName('tr').item(2));
    });

    test('Add new empty row on edit of last row\'s type', function () {
        const { container } = renderView();

        // 1 row with th + 1 row with td
        expect(container.getElementsByTagName('tr').length).toBe(2);

        fireEvent.change(container.getElementsByTagName('select')[0], { target: { value: 'number' } });

        expect(container.getElementsByTagName('tr').length).toBe(3);
        expectEmptyRow(container.getElementsByTagName('tr').item(2));
    });

    test('Changing type will change the type config appearance', function () {
        const { container } = renderView();

        fireEvent.change(container.getElementsByTagName('select')[0], { target: { value: 'number' } });

        expect(container.querySelector('option:checked').textContent).toBe('flagbit_reference_entity_table.attribute.column_type.number');
        expect(container.getElementsByTagName('td')[4].textContent).not.toBe('flagbit_reference_entity_table.attribute.column_type.text.no_config');
    });

    test('Click on confirm button will apply changes for attribute', function () {
        const saveTable = jest.fn();
        const { container } = renderView({saveTable: saveTable});

        const inputFields = container.getElementsByTagName('input');

        fireEvent.change(container.getElementsByTagName('select')[0], { target: { value: 'number' } });
        changeInputField(inputFields[0], 'my_code');
        changeInputField(inputFields[1], 'de label');
        changeInputField(inputFields[2], 'us label');
        fireEvent.change(container.getElementsByTagName('select')[1], { target: { value: 'true' } });

        const expectedRow = {
            code: 'my_code',
            labels: {de_DE: 'de label', en_US: 'us label'},
            type: 'number',
            validations: [],
            config: {
                decimal: 'true'
            }
        };

        fireEvent.click(container.querySelector('button.confirm'));

        expect(saveTable.mock.calls.length).toBe(1);
        expect(saveTable.mock.calls[0][0]).toStrictEqual([expectedRow]);
    });

    test('Removing rows', function () {
        const attribute = createPopulatedAttribute();
        const saveTable = jest.fn();
        const { container } = renderView({saveTable: saveTable, attribute: attribute});

        // check if given row exists
        expect(container.querySelector('tr[data-code="my_code"]')).not.toBeNull();

        const confirm = jest.fn().mockImplementation(() => true);
        global.confirm = confirm;
        fireEvent.click(container.querySelector('.AknOptionEditor-remove'));
        expect(confirm.mock.calls.length).toBe(1);

        // Row was removed
        expect(container.querySelector('tr[data-code="my_code"]')).toBeNull();

        fireEvent.click(container.querySelector('button.confirm'));

        expect(saveTable.mock.calls.length).toBe(1);
        expect(saveTable.mock.calls[0][0]).toStrictEqual([]);
    });

    test('Abort row removal will keep changes', function () {
        const attribute = createPopulatedAttribute();
        const { container } = renderView({attribute: attribute});

        // check if given row exists
        expect(container.querySelector('tr[data-code="my_code"]')).not.toBeNull();

        const confirm = jest.fn().mockImplementation(() => false);
        global.confirm = confirm;
        fireEvent.click(container.querySelector('.AknOptionEditor-remove'));
        expect(confirm.mock.calls.length).toBe(1);

        // row still exists
        expect(container.querySelector('tr[data-code="my_code"]')).not.toBeNull();
    });

    test('Canceling modal after editing data will not apply changes', function () {
        const attribute = createPopulatedAttribute();
        const { container } = renderView({attribute: attribute});

        // check if given row exists
        expect(container.querySelector('tr[data-code="my_code"]')).not.toBeNull();

        const confirm = jest.fn().mockImplementation(() => true);
        global.confirm = confirm;
        fireEvent.click(container.querySelector('.AknOptionEditor-remove'));
        expect(confirm.mock.calls.length).toBe(1);

        // Row was removed
        expect(container.querySelector('tr[data-code="my_code"]')).toBeNull();

        fireEvent.click(container.querySelector('div.cancel'));

        // removed row exists again
        expect(container.querySelector('tr[data-code="my_code"]')).not.toBeNull();
    });
});

function renderView(options: {
    saveTable?: (tableRows: TableRow[]) => void;
    attribute?: TableAttribute;
    rights?: RightsType;
} = {}) {

    options = {
        attribute: createDefaultAttribute(),
        saveTable: jest.fn(),
        rights: accessRightsTrue,
        ...options
    }

    const store = {
        reloadPreview: false,
        user: {
            catalogLocale: null
        },
        structure: {
            locales: createLocales()
        },
        attribute: {
            errors: []
        }
    };

    return render(<Provider store={createStore(() => (store))}>
        <TableAttributeModal
            key={`key_my_code`}
            attribute={options.attribute}
            rights={options.rights}
            saveTable={options.saveTable}
        /></Provider>, {});
}

function createDefaultAttribute(): TableAttribute {
    return ConcreteTableAttribute.createFromNormalized({
        identifier: 'id',
        reference_entity_identifier: 'refId',
        code: 'attribute_code',
        type: 'flagbit_table',
        labels: {de_DE: 'Tabelle', en_US: 'Table'},
        value_per_locale: false,
        value_per_channel: false,
        order: 1,
        is_required: false,
        table_property: []
    });
}

function createPopulatedAttribute(): TableAttribute {
    return ConcreteTableAttribute.createFromNormalized({
        identifier: 'id',
        reference_entity_identifier: 'refId',
        code: 'attribute_code',
        type: 'flagbit_table',
        labels: {de_DE: 'Tabelle', en_US: 'Table'},
        value_per_locale: false,
        value_per_channel: false,
        order: 1,
        is_required: false,
        table_property: [{
            code: 'my_code',
            labels: {de_DE: 'de label', en_US: 'us label'},
            type: 'number',
            validations: [],
            config: {
                decimal: 'true'
            }
        }]
    });
}

function expectEmptyRow(htmlElement: HTMLElement): void {
    const emptyInput = htmlElement.getElementsByTagName('input');

    expect(emptyInput.length).toBe(3);
    expect(emptyInput[0].value).toBe('');
    expect(emptyInput[1].value).toBe('');
    expect(emptyInput[2].value).toBe('');
    expect(htmlElement.getElementsByTagName('select')[0].value).toBe('text');
    expect(htmlElement.getElementsByTagName('td')[4].textContent).toBe('flagbit_reference_entity_table.attribute.column_type.text.no_config');
}

function changeInputField(input: HTMLInputElement, value: string): void {
    fireEvent.change(input, { target: { value: value } });
}

import * as React from 'react';
import { shallow } from 'enzyme';
import { tableRow } from '../../../../../src/Resources/public/reference-entity/attribute/table/row';
import { createLocales, accessRightsTrue, accessRightsFalse } from '../../test-helper';
import { createValidationError } from 'akeneoreferenceentity/domain/model/validation-error';

describe('Attribute modal row', function () {
    test('Default rendering', function () {
        const row = createRow();

        expect(row.find('tr').length).toBe(1);
        expect(row.find('td').length).toBe(6);

        expect(row.exists('input[name="code"]')).toBeTruthy();
        expect(row.exists('input[id="pim_reference_entity.attribute.edit.input.my_code_1.code"]')).toBeTruthy();
        expect(row.find('input[name="code"]').props().value).toBe('my_code');

        expect(row.exists('input[name="labels[de_DE]"]')).toBeTruthy();
        expect(row.exists('input[id="pim_reference_entity.attribute.edit.input.de_DE_1.label"]')).toBeTruthy();
        expect(row.find('input[name="labels[de_DE]"]').props().value).toBe('DE');

        expect(row.exists('input[name="labels[en_US]"]')).toBeTruthy();
        expect(row.exists('input[id="pim_reference_entity.attribute.edit.input.en_US_1.label"]')).toBeTruthy();
        expect(row.find('input[name="labels[en_US]"]').props().value).toBe('US');

        expect(row.exists('select[name="type"]')).toBeTruthy();
        expect(row.exists('select[id="pim_reference_entity.attribute.edit.type.my_code_1.code"]')).toBeTruthy();
        expect(row.find('select[name="type"] option').length).toBeGreaterThanOrEqual(3);

        // rendered type config
        expect(row.find('td').contains('flagbit_reference_entity_table.attribute.column_type.text.no_config')).toBeTruthy();

        expect(row.exists('.AknOptionEditor-remove')).toBeTruthy();
    });

    test('Cannot delete additional last row', function () {
        const row = createRow({
            isLastRow: true,
        });

        expect(row.exists('.AknOptionEditor-remove')).toBeFalsy();
    });

    test('No right to edit attribute', function () {
        const row = createRow({
            rights: accessRightsFalse,
        });

        expect(row.find('input[name="code"]').props().readOnly).toBeTruthy();
        expect(row.find('input[name="labels[de_DE]"]').props().readOnly).toBeTruthy();
        expect(row.find('input[name="labels[en_US]"]').props().readOnly).toBeTruthy();
        expect(row.find('select[name="type"]').props().disabled).toBeTruthy();
        expect(row.exists('.AknOptionEditor-remove')).toBeFalsy();
    });

    test('Default form field values when row is empty', function () {
        const row = createRow({
            row: {
                code: undefined,
                labels: {},
                type: 'text',
                validations: [],
                config: {},
            },
        });

        expect(row.find('input[name="code"]').props().value).toBe('');

        expect(row.find('input[name="labels[de_DE]"]').props().value).toBe('');

        expect(row.find('input[name="labels[en_US]"]').props().value).toBe('');

        expect(row.find('select[name="type"]').props().value).toBe('text');
    });

    test('Show code validation errors', function () {
        createValidationTest('input[name="code"]', 'tableProperty[1][code]');
    });

    test('Show label validation errors', function () {
        // TODO Improve validation error display. The current code handles the delivered property path
        //  tableProperty[1][labels] of Akeneo only.
        createValidationTest('input[name="labels[de_DE]"]', 'tableProperty[1][labels]');
    });

    test('Show type validation errors', function () {
        createValidationTest('select[name="type"]', 'tableProperty[1][type]');
    });

    test('Edit code value', function () {
        const onChange = jest.fn();
        const row = createRow({
            onTableEditionCodeUpdated: onChange,
        });

        row.find('input[name="code"]').simulate('change', { currentTarget: { value: 'foo' } });

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('foo');
        expect(onChange.mock.calls[0][1]).toBe(1);
    });

    test('Edit labels value', function () {
        const onChange = jest.fn();
        const row = createRow({
            onTableEditionLabelUpdated: onChange,
        });

        row.find('input[name="labels[de_DE]"]').simulate('change', { currentTarget: { value: 'foo' } });

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('foo');
        expect(onChange.mock.calls[0][1]).toBe('de_DE');
        expect(onChange.mock.calls[0][2]).toBe(1);
    });

    test('Edit type value', function () {
        const onChange = jest.fn();
        const row = createRow({
            onTableEditionTypeUpdated: onChange,
        });

        row.find('select[name="type"]').simulate('change', { target: { value: 'foo' } });

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe('foo');
        expect(onChange.mock.calls[0][1]).toBe(1);
    });

    test('Remove row with click', function () {
        const onChange = jest.fn();
        const row = createRow({
            onTableEditionDelete: onChange,
        });

        row.find('.AknOptionEditor-remove').simulate('click');

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe(1);
    });

    test('Remove row with Enter key', function () {
        const onChange = jest.fn();
        const row = createRow({
            onTableEditionDelete: onChange,
        });

        row.find('.AknOptionEditor-remove').simulate('keypress', { key: 'Enter' });
        row.find('.AknOptionEditor-remove').simulate('keypress', { key: ' ' });

        expect(onChange.mock.calls.length).toBe(1);
        expect(onChange.mock.calls[0][0]).toBe(1);
    });
});

function createValidationTest(fieldSelector: string, propertyPath: string) {
    const error = createValidationError(
        // @ts-ignore A ts invalid type is given by validation API
        {
            messageTemplate: 'error message.',
            parameters: { '{{ value }}': '"foo"' },
            message: 'error message.',
            propertyPath: propertyPath,
            invalidValue: 'foo',
        }
    );

    const row = createRow({ errors: [error] });

    expect(row.find(fieldSelector).parents('td').find('.error-message').text()).toBe('error message.');
}

function createRow(options = {}) {
    const Row = () =>
        tableRow({
            row: {
                code: 'my_code',
                labels: { de_DE: 'DE', en_US: 'US' },
                type: 'text',
                validations: [],
                config: {},
            },
            index: 1,
            isLastRow: false,
            numberOfLockedRows: 3,
            locales: createLocales(),
            errors: [],
            rights: accessRightsTrue,
            onTableEditionCodeUpdated: jest.fn(),
            onTableEditionLabelUpdated: jest.fn(),
            onTableEditionTypeUpdated: jest.fn(),
            onTableEditionConfigUpdated: jest.fn(),
            onTableEditionDelete: jest.fn(),
            ...options,
        });

    return shallow(<Row />);
}

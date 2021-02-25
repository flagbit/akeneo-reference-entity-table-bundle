import ValidationError from 'akeneoreferenceentity/domain/model/validation-error';
import {
    ConcreteTableAttribute,
    TableAttribute,
    TableProperty,
} from '../../../../../src/Resources/public/reference-entity/attribute/table/table';
import { view } from '../../../../../src/Resources/public/reference-entity/attribute/table/view';
import { accessRightsTrue } from '../../test-helper';
import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { screen, render } from '@testing-library/react';

jest.mock(
    'pim/security-context',
    () => ({
        isGranted: jest.fn().mockImplementation(() => true),
    }),
    { virtual: true }
);

describe('Attribute view', function () {
    test('Default rendering', function () {
        const renderResult = renderView(jest.fn());

        expect(screen.getByRole('button').parentElement.parentElement.dataset.code).toBe('table_property');
        expect(screen.getByRole('button').dataset.code).toBe('table_property');
        expect(screen.queryByText('flagbit_reference_entity_table.attribute.error')).toBeNull();
        expect(renderResult.container.querySelector('#flagbit_container_my_code')).not.toBeNull();
    });

    test('Show validation error', function () {
        // @ts-ignore A ts invalid type is given by validation API for validation error result
        renderView(jest.fn(), [{}]);

        expect(screen.queryByText('flagbit_reference_entity_table.attribute.error')).not.toBeNull();
    });

    test('Confirm modal', function () {
        const confirmModal = jest.fn();

        const { container } = renderView(confirmModal);

        const modalFooter = container.querySelector('.modal-footer');
        modalFooter.getElementsByTagName('button')[0].click();

        expect(confirmModal.mock.calls.length).toBe(1);
        expect(confirmModal.mock.calls[0][0]).toBe('table_property');
        expect(confirmModal.mock.calls[0][1]).toBeInstanceOf(TableProperty);
        expect(confirmModal.mock.calls[0][1]).toStrictEqual(new TableProperty([]));
    });

    /**
     * @todo The modal open code needs a rewrite to be better testable
     */
    test('Open modal', function () {
        const { container } = renderView(jest.fn());

        const openModal = jest.fn();
        container.getElementsByTagName('button')[0].onclick = () => openModal();
        container.getElementsByTagName('button')[0].click();

        expect(openModal.mock.calls.length).toBe(1);
    });
});

function renderView(onAdditionalPropertyUpdated: (property: string, value: TableProperty) => void, errors: ValidationError[] = []) {
    const ViewContent = view;
    const store = {
        reloadPreview: false,
        user: {
            catalogLocale: null,
        },
        structure: {
            locales: [],
        },
        attribute: {
            errors: [],
        },
    };

    return render(
        <Provider store={createStore(() => store)}>
            <ViewContent
                attribute={createAttribute()}
                onAdditionalPropertyUpdated={onAdditionalPropertyUpdated}
                errors={errors}
                rights={accessRightsTrue}
            />
        </Provider>,
        {}
    );
}

function createAttribute(): TableAttribute {
    return ConcreteTableAttribute.createFromNormalized({
        identifier: 'id',
        reference_entity_identifier: 'refId',
        code: 'my_code',
        type: 'flagbit_table',
        labels: { de_DE: 'Tabelle', en_US: 'Table' },
        value_per_locale: false,
        value_per_channel: false,
        order: 1,
        is_required: false,
        table_property: [],
    });
}

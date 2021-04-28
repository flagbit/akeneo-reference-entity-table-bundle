import renderType, { renderTypeForAsync } from './test-helper';
import SingleReferenceEntityType, {
    RefEntityConfig,
} from '../../../../../../src/Resources/public/reference-entity/attribute/table/type/single-reference-entity';
import * as React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';

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
        const renderedAttributeType = renderType({}, new SingleReferenceEntityType('single_reference_entity'), jest.fn());

        const select = renderedAttributeType.find('RefEntitySelect').dive().find('select');
        const options = renderedAttributeType.find('RefEntitySelect').dive().find('options');

        expect(renderedAttributeType.key()).toBe('single_reference_entity0');

        expect(select.length).toBe(1);
        expect(options.length).toBe(0);
    });

    test('Rendering with options', async function () {
        const { container } = renderTypeForAsync({}, new SingleReferenceEntityType('single_reference_entity'), jest.fn());

        const options = await waitFor(() => container.getElementsByTagName('option'));

        expect(options.length).toBe(2);

        expect(options[0].value).toBe('code1');
        expect(options[0].textContent).toBe('label1');

        expect(options[1].value).toBe('code2');
        expect(options[1].textContent).toBe('label2');
    });

    test('Rendering with saved value', async function () {
        const { container } = renderTypeForAsync(
            { ref_entity_code: 'code2' },
            new SingleReferenceEntityType('single_reference_entity'),
            jest.fn()
        );

        const select = await waitFor(() => container.getElementsByTagName('select'));

        expect(select[0].value).toBe('code2');
    });

    test('Change reference entity', async function () {
        const onchange = jest.fn();
        const config: RefEntityConfig = { ref_entity_code: 'code2' };
        const { container } = renderTypeForAsync(config, new SingleReferenceEntityType('single_reference_entity'), onchange);

        const select = await waitFor(() => container.getElementsByTagName('select'));
        fireEvent.change(select[0], { target: { value: 'code1' } });

        const expectedConfig: RefEntityConfig = { ref_entity_code: 'code1' };

        expect(onchange.mock.calls.length).toBe(1);
        expect(onchange.mock.calls[0][0]).toStrictEqual(expectedConfig);
        expect(onchange.mock.calls[0][1]).toBe(0);
    });
});

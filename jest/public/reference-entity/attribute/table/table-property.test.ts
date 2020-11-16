import { TableProperty, TableRow } from "../../../../../src/Resources/public/reference-entity/attribute/table/table";
import Locale, { ConcreteLocale } from '../../../../../vendor/akeneo/pim-enterprise-dev/src/Akeneo/ReferenceEntity/front/domain/model/locale';

describe('TableProperty', function () {
    test('normalize()', function () {
        const tableRows: TableRow[] = [{
            code: 'my_code1',
            labels: {},
            type: 'text',
            validations: [],
            config: {},
        }];
        const tableProperty: TableProperty = new TableProperty(tableRows);

        expect(tableProperty.normalize()).toStrictEqual(tableRows);
    });

    test('createEmptyRow()', function () {
        const tableRow: TableRow = {
            code: '',
            labels: {'de_DE': '', 'en_US': ''},
            type: 'text',
            validations: [],
            config: {},
        };

        const locales: Locale[] = [
            new ConcreteLocale('de_DE', 'de label', 'region1', 'de'),
            new ConcreteLocale('en_US', 'us label', 'region2', 'en'),
        ];

        expect(TableProperty.createEmptyRow(locales)).toStrictEqual(tableRow);
    });
});

import Value from 'akeneoreferenceentity/domain/model/record/value';
import NumberData from 'akeneoreferenceentity/domain/model/record/data/number';
import ChannelReference from 'akeneoreferenceentity/domain/model/channel-reference';
import LocaleReference from 'akeneoreferenceentity/domain/model/locale-reference';
import {
    ConcreteTableAttribute,
    TableRow
} from '../../../../../../src/Resources/public/reference-entity/attribute/table/table';
import {TableDataRow, TableData} from "../../../../../../src/Resources/public/reference-entity/record/table/table";

describe('ValueUpdater', function () {
    test('Value test', function () {
        const value = createValue([], []);

        expect(value.isEmpty()).toBeTruthy();
    });
});

function createValue(tableRows: TableRow[], tableData: TableDataRow[]): Value {
    const locale = LocaleReference.create(null);
    const channel = ChannelReference.create(null);
    const data = TableData.createFromNormalized(tableData);
    const attribute = ConcreteTableAttribute.createFromNormalized({
        identifier: 'id',
        reference_entity_identifier: 'refId',
        code: 'code',
        type: 'flagbit_table',
        labels: {},
        value_per_locale: false,
        value_per_channel: false,
        order: 1,
        is_required: false,
        table_property: tableRows
    });

    return Value.create(attribute, channel, locale, data);
}

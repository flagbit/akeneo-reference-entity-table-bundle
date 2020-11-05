import { cell } from '../../../../../src/Resources/public/reference-entity/record/table/cell';
import { ConcreteTableAttribute } from "../../../../../src/Resources/public/reference-entity/attribute/table/table";
import {denormalize, TableData} from "../../../../../src/Resources/public/reference-entity/record/table/table";
import LocaleReference from 'akeneoreferenceentity/domain/model/locale-reference';
import ChannelReference from 'akeneoreferenceentity/domain/model/channel-reference';
import Value, {NormalizedValue} from 'akeneoreferenceentity/domain/model/record/value';
import { Column } from 'akeneoreferenceentity/application/reducer/grid';
import { CellView } from 'akeneoreferenceentity/application/configuration/value';
import * as React from 'react';
import { shallow } from 'enzyme';

describe('cell', function () {
    test('Cell contains table data content from table_property', function () {
        const column: Column = { key: 'key',
            labels: {},
            type: 'type',
            channel: 'channel',
            locale: 'locale',
            code: 'code',
            attribute: createValue().attribute.normalize()
        }
        const value: NormalizedValue = createValue().normalize();

        const CellView: CellView = cell;

        const cellView = shallow(<CellView column={column} value={value} />);

        expect(cellView.find('div').text()).toStrictEqual('[]');
    });
});

function createValue(): Value {
    const locale = LocaleReference.create(null);
    const channel = ChannelReference.create(null);
    const data = TableData.createFromNormalized([]);
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
        table_property: []
    });

    return Value.create(attribute, channel, locale, data);
}

import * as React from 'react';
import Value from 'akeneoreferenceentity/domain/model/record/value';
import {ConcreteTableAttribute} from 'flagbitreferenceentitytable/reference-entity/attribute/table/table';
import {TableData} from 'flagbitreferenceentitytable/reference-entity/record/table/table';
import {denormalize} from 'flagbitreferenceentitytable/reference-entity/record/table/table';
import Key from 'akeneoreferenceentity/tools/key';

/**
 * Here we define the React Component as a function with the following props :
 *    - the Table Record Value
 *    - the callback function to update the Record Value
 *    - the callback for the submit
 *    - the right to edit the Record Value
 *
 * It returns the JSX View to display the field of the Table Record Value.
 */
const View = ({
                  value,
                  onChange,
                  onSubmit,
                  canEditData,
              }: {
    value: Value;
    onChange: (value: Value) => void;
    onSubmit: () => void;
    canEditData: boolean;
}) => {
    if (!(value.data instanceof TableData && value.attribute instanceof ConcreteTableAttribute)) {
        return null;
    }

    const onValueChange = (text: string) => {
        const newData = denormalize(text);
        if (newData.equals(value.data)) {
            return;
        }

        const newValue = value.setData(newData);

        onChange(newValue);
    };

    return (
        <React.Fragment>
            <input
                id={`pim_reference_entity.record.enrich.${value.attribute.getCode().stringValue()}`}
                autoComplete="off"
                className={`AknTextField AknTextField--narrow AknTextField--light
          ${value.attribute.valuePerLocale ? 'AknTextField--localizable' : ''}
          ${!canEditData ? 'AknTextField--disabled' : ''}`}
                value={value.data.normalize()}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    onValueChange(event.currentTarget.value);
                }}
                onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (Key.Enter === event.key) onSubmit();
                }}
                disabled={!canEditData}
                readOnly={!canEditData}
            />
            <span>{value.attribute.table_property.normalize()}</span>
        </React.Fragment>
    );
};

export const view = View;

import * as React from 'react';
import ValidationError from 'akeneoreferenceentity/domain/model/validation-error';
import Key from 'akeneoreferenceentity/tools/key';
import __ from 'akeneoreferenceentity/tools/translator';
import { getErrorsView } from 'akeneoreferenceentity/application/component/app/validation-error';
import Close from 'akeneoreferenceentity/application/component/app/icon/close';
import Locale from 'akeneoreferenceentity/domain/model/locale';
import { FlagbitTableTypes } from './type/type';
import { TableRow } from './table';

export const tableRow = ({
    row,
    index,
    isLastRow,
    numberOfLockedRows,
    locales,
    errors,
    rights,
    onTableEditionCodeUpdated,
    onTableEditionLabelUpdated,
    onTableEditionTypeUpdated,
    onTableEditionConfigUpdated,
    onTableEditionDelete,
}: {
    row: TableRow;
    index: number;
    isLastRow: boolean;
    numberOfLockedRows: number;
    locales: Locale[];
    errors: ValidationError[];
    rights: {
        locale: {
            edit: boolean;
        };
        attribute: {
            create: boolean;
            edit: boolean;
            delete: boolean;
        };
    };
    onTableEditionCodeUpdated: (code: string, id: any) => void;
    onTableEditionLabelUpdated: (label: string, locale: string, id: any) => void;
    onTableEditionTypeUpdated: (value: string, id: number) => void;
    onTableEditionConfigUpdated: (config: object, id: number) => void;
    onTableEditionDelete: (id: any) => void;
}) => {
    const code: string = row.code;
    const labels: { [index: string]: string } = row.labels;
    const type: string = row.type;

    const displayDeleteRowButton: boolean = !isLastRow && rights.attribute.delete;
    const canEditLabel = rights.attribute.edit && rights.locale.edit;
    const labelClassName = `AknTextField AknTextField--light ${!canEditLabel ? 'AknTextField--disabled' : ''}`;

    return (
        <React.Fragment key={index}>
            {!isLastRow || rights.attribute.edit ? (
                <tr data-code={code} className="AknOptionEditor-row">
                    <td>
                        <div className="AknFieldContainer">
                            <div className="AknFieldContainer-inputContainer">
                                <input
                                    autoComplete="off"
                                    type="text"
                                    className={
                                        'AknTextField AknTextField--light' +
                                        (index <= numberOfLockedRows - 1 && !rights.attribute.edit ? ' AknTextField--disabled' : '')
                                    }
                                    tabIndex={index <= numberOfLockedRows - 1 ? -1 : 0}
                                    id={`pim_reference_entity.attribute.edit.input.${code}_${index}.code`}
                                    name="code"
                                    value={undefined === code ? '' : code}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        onTableEditionCodeUpdated(event.currentTarget.value, index);
                                    }}
                                    readOnly={!rights.attribute.edit}
                                />
                            </div>
                        </div>
                        {getErrorsView(errors, `tableProperty[${index}][code]`)}
                    </td>
                    {locales.map((currentLocale: Locale) => {
                        return (
                            <td key={`${currentLocale.code}_${index}`}>
                                <div className="AknFieldContainer">
                                    <div className="AknFieldContainer-inputContainer">
                                        <input
                                            autoComplete="off"
                                            placeholder={isLastRow && canEditLabel ? '' : ''}
                                            type="text"
                                            className={labelClassName}
                                            id={`pim_reference_entity.attribute.edit.input.${currentLocale.code}_${index}.label`}
                                            name={`labels[${currentLocale.code}]`}
                                            value={currentLocale.code in labels ? labels[currentLocale.code] : ''}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                onTableEditionLabelUpdated(event.currentTarget.value, currentLocale.code, index);
                                            }}
                                            readOnly={!canEditLabel}
                                        />
                                    </div>
                                    {!isLastRow ? getErrorsView(errors, `table_property.${index}`) : null}
                                </div>
                                {getErrorsView(errors, `tableProperty[${index}][${currentLocale.code}]`)}
                            </td>
                        );
                    })}
                    <td>
                        <div className="AknFieldContainer">
                            <div className="AknFieldContainer-inputContainer">
                                <div className="AknDropdown">
                                    <select
                                        className={
                                            'AknSelectField AknSelectField--light' +
                                            (index <= numberOfLockedRows - 1 && !rights.attribute.edit ? ' AknSelectField--disabled' : '')
                                        }
                                        tabIndex={index <= numberOfLockedRows - 1 ? -1 : 0}
                                        id={`pim_reference_entity.attribute.edit.input.${code}_${index}.code`}
                                        name="type"
                                        value={undefined === type ? '' : type}
                                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                            onTableEditionTypeUpdated(event.target.value, index);
                                        }}
                                        disabled={!rights.attribute.edit}
                                    >
                                        {FlagbitTableTypes.typeRegistry.getSelectValues().map((option: any) => {
                                            return (
                                                <option key={`${option.code}_${index}`} value={option.code}>
                                                    {__('flagbit_reference_entity_table.attribute.column_type.' + option.code)}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                        </div>
                        {getErrorsView(errors, `tableProperty[${index}][type]`)}
                    </td>
                    <td>
                        {FlagbitTableTypes.typeRegistry.render({
                            typeCode: type,
                            updateConfig: onTableEditionConfigUpdated,
                            index: index,
                            config: row.config,
                            supportedLocales: locales,
                        })}
                        {getErrorsView(errors, `tableProperty[${index}][config]`)}
                    </td>
                    <td>
                        {displayDeleteRowButton ? (
                            <Close
                                onClick={() => onTableEditionDelete(index)}
                                onKeyPress={(event: React.KeyboardEvent<SVGElement>) => {
                                    if (Key.Space === event.key) onTableEditionDelete(index);
                                }}
                                color="#67768A"
                                className="AknOptionEditor-remove"
                                tabIndex={0}
                            />
                        ) : null}
                    </td>
                </tr>
            ) : null}
        </React.Fragment>
    );
};

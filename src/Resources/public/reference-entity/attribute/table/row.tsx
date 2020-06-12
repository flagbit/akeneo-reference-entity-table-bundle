import * as React from "react";
import ValidationError from "akeneoreferenceentity/domain/model/validation-error";
import Key from "akeneoreferenceentity/tools/key";
import __ from 'akeneoreferenceentity/tools/translator';
import {getErrorsView} from 'akeneoreferenceentity/application/component/app/validation-error';
import Close from 'akeneoreferenceentity/application/component/app/icon/close';
import Locale from 'akeneoreferenceentity/domain/model/locale';

export const tableRow = ({
                             code,
                             labels,
                             index,
                             isLastRow,
                             numberOfLockedRows,
                             locale,
                             locales,
                             errors,
                             rights,
                             labelInputReference,
                             codeInputReference,
                             onTableEditionCodeUpdated,
                             onTableEditionSelected,
                             onTableEditionLabelUpdated,
                             onTableEditionDelete,
                         }: {
    code: string;
    labels: {[index:string]: string};
    index: number;
    isLastRow: boolean;
    numberOfLockedRows: number;
    locale: string;
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
    labelInputReference: React.RefObject<HTMLInputElement>;
    codeInputReference: React.RefObject<HTMLInputElement>;
    onTableEditionCodeUpdated: (code: string, id: any) => void;
    onTableEditionSelected: (id: any) => void;
    onTableEditionLabelUpdated: (label: string, locale: string, id: any) => void;
    onTableEditionDelete: (id: any) => void;
}) => {
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
                                    ref={codeInputReference}
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
                                    onFocus={() => {
                                        onTableEditionSelected(index);
                                    }}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        onTableEditionCodeUpdated(event.currentTarget.value, index);
                                    }}
                                    readOnly={!rights.attribute.edit}
                                />
                            </div>
                        </div>
                    </td>
                    {locales.map((currentLocale: Locale) => {
                        return (
                            <td key={currentLocale.code}>
                                <div className="AknFieldContainer">
                                    <div className="AknFieldContainer-inputContainer">
                                        <input
                                            autoComplete="off"
                                            ref={labelInputReference}
                                            placeholder={
                                                isLastRow && canEditLabel
                                                    ? 'label'
                                                    : ''
                                            }
                                            type="text"
                                            className={labelClassName}
                                            id={`pim_reference_entity.attribute.edit.input.${currentLocale.code}_${index}.label`}
                                            name={`labels[${currentLocale.code}]`}
                                            value={currentLocale.code in labels ? labels[currentLocale.code] : ''}
                                            onFocus={() => {
                                                onTableEditionSelected(index);
                                            }}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                onTableEditionLabelUpdated(event.currentTarget.value, locale, index);
                                            }}
                                            readOnly={!canEditLabel}
                                        />
                                    </div>
                                    {!isLastRow ? getErrorsView(errors, `table_property.${index}`) : null}
                                </div>
                            </td>
                        );
                    })}
                    <td>
                        <div className="AknFieldContainer">
                            <div className="AknFieldContainer-inputContainer">
                                <div className="AknSelectField">
                                    <select
                                        className={
                                            'AknSelectField AknSelectField--light' +
                                            (index <= numberOfLockedRows - 1 && !rights.attribute.edit ? ' AknSelectField--disabled' : '')
                                        }
                                        tabIndex={index <= numberOfLockedRows - 1 ? -1 : 0}
                                        id={`pim_reference_entity.attribute.edit.input.${code}_${index}.code`}
                                        name="type"
                                        // onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        //     onTableEditionCodeUpdated(event.currentTarget.value, index);
                                        // }}
                                        disabled={!rights.attribute.edit}
                                    >
                                        <option value="text">Text</option>
                                        <option value="number">Number</option>
                                        <option value="select">Simple select</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        There is no configuration options.
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

import {Type, ConfigChangeState} from "./type";
import __ from 'akeneoreferenceentity/tools/translator';
import Close from 'akeneoreferenceentity/application/component/app/icon/close';
import React from "react";
import $ from 'jquery';

type Option = {
    code: string;
    values: {
        [key: string]: string;
    };
}

export type SelectConfig = {
    options: Option[]
}

export default class LocalizedSelect implements Type {
    private readonly default = {
        options: []
    };

    constructor(readonly typeCode: string) {}

    render(changeState: ConfigChangeState) {
        const selector = `flagbit_table_${changeState.typeCode}_${changeState.index}`;

        const removeDataRow = (config: SelectConfig, index: number): void => {
            let options: Option[] = config.options
            options.splice(index, 1);
            config.options = options;
            changeState.updateConfig(config, changeState.index);
        };

        const cleanOptions = (options: Option[]): Option[] => {
            options =  options.filter((option: Option): boolean => {
                if (typeof option.values !== 'object') {
                    return false;
                }

                const optionValues: any[] = Object.values(option.values);

                return ! (optionValues.every((fieldValue) => {return fieldValue === ''}) && option.code === '');
            });
            options.push(this.createEmptyOption());

            return options;
        }

        const openOptions = (): void => {
            $('#table_attribute_modal_buttons').css({'display': 'none'});
            $('#'+selector).css({'display': 'block'});
        }

        const closeOptions = (): void => {
            $('#table_attribute_modal_buttons').css({'display': 'block'});
            $('#'+selector).css({'display': 'none'});
        }

        const key = this.typeCode+changeState.index;
        // TODO This needs a better type/content check
        const config = Object.keys(changeState.config).length === 0 ? this.default : changeState.config as SelectConfig;

        config.options = cleanOptions(config.options);

        return (<React.Fragment key={key}>
            <button
                onClick={openOptions}
                className="AknButton AknButton--apply"
            >{__('flagbit_reference_entity_table.attribute.column_type.select_localized.button.options')}</button>
            <div className="modal in flagbitTableAttributeSelectType" id={selector} aria-hidden="false" style={{zIndex: 1060, display: 'none', overflow: 'auto'}}>
                <div>
                    <table style={{margin: '70px auto'}}>
                        <caption style={{textAlign: 'left'}}>{__('flagbit_reference_entity_table.attribute.column_type.select.label.options')}</caption>
                        <thead>
                        <tr>
                            <th>{__('flagbit_reference_entity_table.attribute.column_type.select.label.code')}</th>
                            {changeState.supportedLocales.map((locale, index: number) => {
                                return (<th key={`th_${locale.code}_${index}`}>{locale.code}</th>)
                            })}
                        </tr>
                        </thead>
                        <tbody>
                        {config.options.map((option: Option, index: number) => {
                            return (
                                <tr key={`row_index${changeState.index}_option${index}`}>
                                    <td>
                                        <input
                                            key={`row_index${changeState.index}_code${index}`}
                                            type="text"
                                            value={option.code}
                                            className={'AknTextField AknTextField--light'}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                                                config.options[index] = { code: event.target.value, values: option.values };
                                                config.options = cleanOptions(config.options);
                                                changeState.updateConfig(config, changeState.index);
                                            }}
                                        />
                                    </td>
                                    {changeState.supportedLocales.map((locale, locale_index: number) => {
                                        return (<td key={`th_${locale.code}_${locale_index}_${index}`}>
                                            <input
                                                key={`row_index${changeState.index}_locale${locale_index}_value${index}`}
                                                type="text"
                                                value={option.values[locale.code] || ''}
                                                className={'AknTextField AknTextField--light'}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                                                    const localeCode: string = locale.code;
                                                    let optionValues = option.values;
                                                    optionValues[localeCode] = event.target.value;
                                                    config.options[index] = { code: option.code, values: optionValues };
                                                    config.options = cleanOptions(config.options);
                                                    changeState.updateConfig(config, changeState.index);
                                                }}
                                            />
                                        </td>)
                                    })}
                                    <td>
                                        {config.options.length - 1 !== index ? (
                                            <Close
                                                onClick={() => removeDataRow(config, index)}
                                                color="#67768A"
                                                className="AknOptionEditor-remove"
                                            />
                                        ) : null}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
                <div className="AknButtonList AknButtonList--right modal-footer">
                    <button
                        className="AknButton AknButton--apply AknFullPage-ok ok confirm"
                        onClick={closeOptions}
                    >
                        {__('flagbit_reference_entity_table.attribute.column_type.select_localized.config.buttom.confirm_options')}
                    </button>
                </div>
            </div>
        </React.Fragment>)
    }

    private createEmptyOption(): Option {
        return {
            code: '',
            values: {},
        };
    }
}

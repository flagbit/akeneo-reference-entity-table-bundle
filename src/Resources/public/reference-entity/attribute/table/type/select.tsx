import {Type, ConfigChangeState} from "./type";
import __ from 'akeneoreferenceentity/tools/translator';
import Close from 'akeneoreferenceentity/application/component/app/icon/close';
import React from "react";
import $ from 'jquery';

type Option = {
    code: string;
    value: string;
}

export type SelectConfig = {
    options: Option[]
}

export default class Select implements Type {
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

        const cleanOptions = (options: Option[], appendRow: boolean = true): Option[] => {
            options =  options.filter((option: Option): boolean => {
                const rowValues: any[] = Object.values(option);

                return ! rowValues.every((fieldValue) => {return fieldValue === ''});
            });

            if (appendRow) {
                options.push(this.createEmptyOption());
            }

            return options;
        }

        const openOptions = (config: SelectConfig): void => {
            $('#table_attribute_modal_buttons').css({'display': 'none'});
            $('#'+selector).css({'display': 'block'});

            config.options = cleanOptions(config.options);
            changeState.updateConfig(config, changeState.index);
        }

        const closeOptions = (config: SelectConfig): void => {
            $('#table_attribute_modal_buttons').css({'display': 'block'});
            $('#'+selector).css({'display': 'none'});

            config.options = cleanOptions(config.options, false);
            changeState.updateConfig(config, changeState.index);
        }

        const key = this.typeCode+changeState.index;
        // TODO This needs a better type/content check
        const config = Object.keys(changeState.config).length === 0 ? this.default : changeState.config as SelectConfig;

        return (<React.Fragment key={key}>
            <button
                onClick={() => openOptions(config)}
                className="AknButton AknButton--apply"
            >{__('flagbit_reference_entity_table.attribute.column_type.select_localized.button.options')}</button>
            <div className="modal in flagbitTableAttributeSelectType" id={selector} aria-hidden="false" style={{zIndex: 1060, display: 'none', overflow: 'auto'}}>
                <div>
                    <table style={{margin: '70px auto'}}>
                        <caption style={{textAlign: 'left'}}>{__('flagbit_reference_entity_table.attribute.column_type.select.label.options')}</caption>
                        <thead>
                        <tr>
                            <th>{__('flagbit_reference_entity_table.attribute.column_type.select.label.code')}</th>
                            <th>{__('flagbit_reference_entity_table.attribute.column_type.select.label.value')}</th>
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
                                                config.options[index] = { code: event.target.value, value: option.value };
                                                config.options = cleanOptions(config.options);
                                                changeState.updateConfig(config, changeState.index);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            key={`row_index${changeState.index}_value${index}`}
                                            type="text"
                                            value={option.value}
                                            className={'AknTextField AknTextField--light'}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                                                config.options[index] = { code: option.code, value: event.target.value };
                                                config.options = cleanOptions(config.options);
                                                changeState.updateConfig(config, changeState.index);
                                            }}
                                        />
                                    </td>
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
                        onClick={() => closeOptions(config)}
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
            value: '',
        };
    }
}

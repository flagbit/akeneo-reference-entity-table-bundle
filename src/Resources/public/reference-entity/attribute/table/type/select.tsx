import {Type, ConfigChangeState} from "./type";
import __ from 'akeneoreferenceentity/tools/translator';
import Close from 'akeneoreferenceentity/application/component/app/icon/close';
import React from "react";

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
        const removeDataRow = (config: SelectConfig, index: number): void => {
            let options: Option[] = config.options
            options.splice(index, 1);
            config.options = options;
            changeState.updateConfig(config, changeState.index);
        };

        const cleanOptions = (options: Option[]): Option[] => {
            options =  options.filter((option: Option): boolean => {
                const rowValues: any[] = Object.values(option);

                return ! rowValues.every((fieldValue) => {return fieldValue === ''});
            });
            options.push(this.createEmptyOption());

            return options;
        }

        const key = this.typeCode+changeState.index;
        // TODO This needs a better type/content check
        if (Object.keys(changeState.config).length === 0) {
            changeState.config = this.default;
            changeState.updateConfig(this.default, changeState.index);
        }
        const config = changeState.config as SelectConfig;

        config.options = cleanOptions(config.options);

        return (<React.Fragment key={key}>
            <label>{__('flagbit_reference_entity_table.attribute.column_type.select.label.options')}</label>
            <table>
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
        </React.Fragment>)
    }

    private createEmptyOption(): Option {
        return {
            code: '',
            value: '',
        };
    }
}

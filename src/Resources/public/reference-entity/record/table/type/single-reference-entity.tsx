import { Type, RecordChangeState } from './type';
import React from 'react';
import { RefEntityConfig } from '../../../attribute/table/type/single-reference-entity';
import recordFetcher from 'akeneoreferenceentity/infrastructure/fetcher/record';
import { Query } from "akeneoreferenceentity/domain/fetcher/fetcher";


interface RefEntitySelectProp {
    ref_entity_code: string;
    update_state: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    record: string;
}

class RefEntitySelect extends React.Component<RefEntitySelectProp> {
    state = {
        options: [],
    };

    componentDidMount() {
        const filter = [
            {
                field: 'reference_entity',
                operator: '=',
                value: this.props.ref_entity_code,
            }
        ];
        const query: Query = {channel: 'ecommerce', filters: filter, locale: 'en_US', page: 0, size: 1000};
        recordFetcher.search(query).then((refEntities) => {
            const options: { code: string; name: string }[] = [];
            refEntities.items.map((option) => {
                options.push({
                    code: option.code,
                    name: option.code,
                });
            });

            this.setState({
                options: options,
            });
        });
    }

    render() {
        return (
            <select value={this.props.record} onChange={this.props.update_state}>
                {this.state.options.map((refEntity: { code: string; name: string }, index: number) => {
                    return (
                        <option key={`test_${refEntity.code}_${index}`} value={refEntity.code}>
                            {refEntity.name}
                        </option>
                    );
                })}
            </select>
        );
    }
}

export default class SingleReferenceEntity implements Type {
    constructor(readonly typeCode: string) {}

    render(recordRowData: RecordChangeState) {
        const config: RefEntityConfig = recordRowData.tableRow.config as RefEntityConfig;

        const update = (event: React.ChangeEvent<HTMLSelectElement>): void => {
            recordRowData.updateValue(recordRowData.tableRow.code, event.currentTarget.value, recordRowData.index);
        };

        return (
            <React.Fragment key={this.typeCode + recordRowData.index}>
                <RefEntitySelect ref_entity_code={config.ref_entity_code}
                                 update_state={update}
                                 record={recordRowData.rowData[recordRowData.tableRow.code] || ''}
                />
            </React.Fragment>
        );
    }
}

import $ from 'jquery';
import { Type, RecordChangeState } from './type';
import React from 'react';
import { RefEntityConfig } from '../../../attribute/table/type/single-reference-entity';
import recordFetcher from 'akeneoreferenceentity/infrastructure/fetcher/record';
import { Query, SearchResult } from "akeneoreferenceentity/domain/fetcher/fetcher";
import { NormalizedItemRecord } from 'akeneoreferenceentity/domain/model/record/record';

interface RefEntitySelectProp {
    ref_entity_code: string;
    update_state: (event: React.ChangeEvent<HTMLInputElement>) => void;
    record: string;
    id: string;
}

class RefEntitySelect extends React.Component<RefEntitySelectProp> {
    rendered = false;

    componentDidMount() {
        const userContext = require('pim/user-context');

        const filter = [
            {
                field: 'reference_entity',
                operator: '=',
                value: this.props.ref_entity_code,
            }
        ];
        const query: Query = {
            channel: userContext.get('catalogScope'),
            filters: filter,
            locale: userContext.get('catalogLocale'),
            page: 0,
            size: 1000
        };

        recordFetcher.search(query).then((refEntities: SearchResult<NormalizedItemRecord>) => {
            const options: { id: string; text: string }[] = [];
            refEntities.items.map((option: NormalizedItemRecord) => {
                options.push({
                    id: option.code,
                    text: option.labels[userContext.get('catalogLocale')] || `[${option.code}]`,
                });
            });

            const select2Instance = $(`#${this.props.id}`);
            // @ts-ignore select2 doesn't exist in JQuery<HTMLElement> by default
            select2Instance.select2({
                placeholder: 'Select an option',
                data: options,
            });
            // @ts-ignore
            select2Instance.on('change', this.props.update_state);
            this.rendered = true;
            if (this.props.record !== '' && this.props.record !== undefined) {
                select2Instance.val(this.props.record);
                select2Instance.trigger('change');
            }
        });
    }

    render() {
        return (<input id={this.props.id} value={this.props.record} onChange={this.props.update_state} />);
    }
}

export default class SingleReferenceEntity implements Type {
    constructor(readonly typeCode: string) {}

    render(recordRowData: RecordChangeState) {
        const config: RefEntityConfig = recordRowData.tableRow.config as RefEntityConfig;

        const update = (event: React.ChangeEvent<HTMLInputElement>): void => {
            recordRowData.updateValue(recordRowData.tableRow.code, event.currentTarget.value, recordRowData.index);
        };

        return (
            <React.Fragment key={this.typeCode + recordRowData.index}>
                <RefEntitySelect ref_entity_code={config.ref_entity_code}
                                 update_state={update}
                                 record={recordRowData.rowData[recordRowData.tableRow.code] || ''}
                                 id={`${config.ref_entity_code}_${recordRowData.index}_select`}
                />
            </React.Fragment>
        );
    }
}

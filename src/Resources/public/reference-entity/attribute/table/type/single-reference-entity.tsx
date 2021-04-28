import { Type, ConfigChangeState } from './type';
import referenceEntityFetcher from 'akeneoreferenceentity/infrastructure/fetcher/reference-entity';
import ReferenceEntityListItem from 'akeneoreferenceentity/domain/model/reference-entity/list';
import React from 'react';

interface RefEntitySelectProp {
    ref_entity_code: string;
    update_state: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

class RefEntitySelect extends React.Component<RefEntitySelectProp> {
    state = {
        options: [],
    };

    componentDidMount() {
        const userContext = require('pim/user-context');

        referenceEntityFetcher.fetchAll().then((refEntities: ReferenceEntityListItem[]) => {
            const options: { code: string; name: string }[] = [];
            refEntities.map((option) => {
                options.push({
                    code: option.getIdentifier().stringValue(),
                    name: option.getLabel(userContext.get('catalogLocale')),
                });
            });

            this.setState({
                options: options,
            });
        });
    }

    render() {
        return (
            <select value={this.props.ref_entity_code} onChange={this.props.update_state}>
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

export type RefEntityConfig = {
    ref_entity_code: string;
};

export default class SingleReferenceEntity implements Type {
    private readonly default: RefEntityConfig = {
        ref_entity_code: '',
    };

    constructor(readonly typeCode: string) {}

    render(changeState: ConfigChangeState) {
        const key = this.typeCode + changeState.index;
        // TODO This needs a better type/content check
        if (Object.keys(changeState.config).length === 0) {
            changeState.config = this.default;
            changeState.updateConfig(this.default, changeState.index);
        }
        const config = changeState.config as RefEntityConfig;

        const update = (event: React.ChangeEvent<HTMLSelectElement>): void => {
            config.ref_entity_code = event.target.value;
            changeState.updateConfig(config, changeState.index);
        };

        return <React.Fragment key={key}>
            <RefEntitySelect ref_entity_code={config.ref_entity_code} update_state={update} />
        </React.Fragment>;
    }
}

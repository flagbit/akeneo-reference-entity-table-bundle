import ReferenceEntityListItem from 'akeneoreferenceentity/domain/model/reference-entity/list';
import Identifier from 'akeneoreferenceentity/domain/model/reference-entity/identifier';

class ReferenceEntityListItemImpl {
    constructor(readonly code: string, readonly labels: object) {}

    getIdentifier(): Identifier {
        return Identifier.create(this.code);
    }

    getLabel(locale: string, fallbackOnCode?: boolean): string {
        return this.labels[locale];
    }

    getImage(): any {}

    equals(referenceEntityListItem: ReferenceEntityListItem): boolean {
        return true;
    }

    normalize(): any {}
}

class referenceEntityFetcher {
    async fetchAll(): Promise<ReferenceEntityListItem[]> {
        return [
            new ReferenceEntityListItemImpl('code1', { de_DE: 'label1', en_US: 'label11' }),
            new ReferenceEntityListItemImpl('code2', { de_DE: 'label2', en_US: 'label22' }),
        ];
    }
}

export default new referenceEntityFetcher();

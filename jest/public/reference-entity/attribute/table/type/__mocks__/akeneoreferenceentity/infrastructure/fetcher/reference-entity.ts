import ReferenceEntityListItem from 'akeneoreferenceentity/domain/model/reference-entity/list';
// import ReferenceEntityListItem, {
//     denormalizeReferenceEntityListItem,
//     NormalizedReferenceEntityListItem
// } from "akeneoreferenceentity/domain/model/reference-entity/list";
// import Identifier
//     from "akeneoreferenceentity/domain/model/identifier";
// import File
//     from "akeneoreferenceentity/domain/model/file";

class ReferenceEntityListItemImpl {
    // Identifier
    getIdentifier(): any {}

    getLabel(locale: string, fallbackOnCode?: boolean): string {
        return 'label';
    }

    // File
    getImage(): any {}

    equals(referenceEntityListItem: ReferenceEntityListItem): boolean {
        return true;
    }

    // NormalizedReferenceEntityListItem
    normalize(): any {}
}

class Foo {
    async fetchAll(): Promise<ReferenceEntityListItem[]> {
        return [new ReferenceEntityListItemImpl(), new ReferenceEntityListItemImpl()];
    }
}

export default new Foo();

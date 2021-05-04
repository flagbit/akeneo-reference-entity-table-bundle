import { Query, SearchResult } from 'akeneoreferenceentity/domain/fetcher/fetcher';
import { NormalizedItemRecord } from 'akeneoreferenceentity/domain/model/record/record';

const completeness = { complete: 0, required: 0 };

const items: NormalizedItemRecord[] = [
    {
        code: 'foo',
        completeness: completeness,
        identifier: 'foo2',
        image: null,
        reference_entity_identifier: '',
        values: [],
        labels: { de_DE: 'A', en_US: 'A1' },
    },
    {
        code: 'bar',
        completeness: completeness,
        identifier: 'bar2',
        image: null,
        reference_entity_identifier: '',
        values: [],
        labels: { de_DE: 'B', en_US: 'B1' },
    },
    {
        code: 'baz',
        completeness: completeness,
        identifier: 'baz2',
        image: null,
        reference_entity_identifier: '',
        values: [],
        labels: { de_DE: 'C', en_US: 'C1' },
    },
];

class Fetcher {
    async search(query: Query): Promise<SearchResult<NormalizedItemRecord>> {
        return {
            items: items,
            matchesCount: items.length,
            totalCount: items.length,
        };
    }
}

export default new Fetcher();

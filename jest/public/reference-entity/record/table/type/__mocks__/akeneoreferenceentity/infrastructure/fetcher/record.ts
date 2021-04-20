import { Query, SearchResult } from 'akeneoreferenceentity/domain/fetcher/fetcher';
import { NormalizedItemRecord } from 'akeneoreferenceentity/domain/model/record/record';

class Foo {
    async search(query: Query): Promise<SearchResult<NormalizedItemRecord>> {
        return {
            items: [],
            matchesCount: 0,
            totalCount: 0,
        };
    }
}

export default new Foo();

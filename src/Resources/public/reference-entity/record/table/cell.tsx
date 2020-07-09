import * as React from 'react';
import {NormalizedValue} from 'akeneoreferenceentity/domain/model/record/value';
import {CellView} from 'akeneoreferenceentity/application/configuration/value';
import {denormalize} from 'flagbitreferenceentitytable/reference-entity/record/table/table';

const memo = (React as any).memo;

const tableCellView: CellView = memo(({value}: {value: NormalizedValue}) => {
    const tableData = denormalize(value.data);

    return (
        <div className="AknGrid-bodyCellContainer">
            {JSON.stringify(tableData.normalize())}
        </div>
    );
});

export const cell = tableCellView;

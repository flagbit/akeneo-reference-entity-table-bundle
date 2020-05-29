import * as React from 'react';
import {NormalizedValue} from 'akeneoreferenceentity/domain/model/record/value';
import {CellView} from 'akeneoreferenceentity/application/configuration/value';
import {denormalize as denormalizeAttribute} from 'flagbitreferenceentitytable/reference-entity/attribute/table/table';
import {NormalizedTableAttribute} from 'flagbitreferenceentitytable/reference-entity/attribute/table/table';
import {denormalize} from 'flagbitreferenceentitytable/reference-entity/record/table/table';
import {Column} from 'akeneoreferenceentity/application/reducer/grid';

const memo = (React as any).memo;

const tableCellView: CellView = memo(({column, value}: {column: Column, value: NormalizedValue}) => {
    const tableData = denormalize(value.data);
    const tableAttribute = denormalizeAttribute(column.attribute as NormalizedTableAttribute);

    return (
        <div className="AknGrid-bodyCellContainer" title={tableData.normalize()}>
            {tableData.normalize()}
            <span>{tableAttribute.normalize()}</span>
        </div>
    );
});

export const cell = tableCellView;

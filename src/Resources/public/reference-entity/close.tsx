// This file only exists because this bundle doesn't use the akeneo-design-system yet
import * as React from 'react';

/* tslint:disable:variable-name */
const Close = ({ color, ...props }: { color: string } & any = { color: '#67768A' }) => (
    <svg viewBox="0 0 24 24" width="24" height="24" {...props}>
        <g fillRule="nonzero" stroke={color} fill="none" strokeLinecap="round">
            <path d="M4 4l16 16M20 4L4 20" />
        </g>
    </svg>
);

export default Close;

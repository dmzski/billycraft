import React from 'react';
declare type RowRenderFn = (renderProps: {
    row: any;
}) => React.ReactNode;
export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
    children: React.ReactNode | RowRenderFn;
}
declare const _default: React.ForwardRefExoticComponent<TableBodyProps & React.RefAttributes<HTMLTableSectionElement>>;
export default _default;

import React from 'react';
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    hoverable?: boolean;
    children?: React.ReactNode;
}
declare const _default: React.ForwardRefExoticComponent<TableRowProps & React.RefAttributes<HTMLTableRowElement>>;
export default _default;

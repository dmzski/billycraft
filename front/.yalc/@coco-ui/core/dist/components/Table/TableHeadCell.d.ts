import React from 'react';
declare type TableHeadCellProps = React.ThHTMLAttributes<HTMLTableHeaderCellElement> & {
    sortable?: string;
    onSort?: (field: string, order: 'asc' | 'desc') => any;
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
};
declare const TableHeadCell: ({ children, className, sortable, sort, onSort, onClick, onMouseEnter, onMouseLeave, ...props }: TableHeadCellProps) => JSX.Element;
export default TableHeadCell;

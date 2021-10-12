import React from 'react';
import './index.css';
export interface TableProps {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
    data?: any[];
}
declare const Table: {
    ({ children, className, hoverable, data, ...props }: TableProps): JSX.Element;
    Head: ({ columns, children, ...props }: {
        columns?: {
            name: string;
            className?: string | undefined;
        }[] | undefined;
        children?: React.ReactNode;
    }) => JSX.Element;
    HeadCell: ({ children, className, sortable, sort, onSort, onClick, onMouseEnter, onMouseLeave, ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement> & {
        sortable?: string | undefined;
        onSort?: ((field: string, order: "desc" | "asc") => any) | undefined;
        sort?: {
            field: string;
            order: "desc" | "asc";
        } | undefined;
    }) => JSX.Element;
    Body: React.ForwardRefExoticComponent<import("./TableBody").TableBodyProps & React.RefAttributes<HTMLTableSectionElement>>;
    Row: React.ForwardRefExoticComponent<import("./TableRow").TableRowProps & React.RefAttributes<HTMLTableRowElement>>;
    Cell: React.ForwardRefExoticComponent<TableCellProps & React.RefAttributes<HTMLTableCellElement>>;
};
interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
    children: React.ReactNode;
}
export default Table;

import React from 'react';
declare type TableHeadProps = {
    columns?: {
        name: string;
        className?: string;
    }[];
    children?: React.ReactNode;
};
declare const TableHead: ({ columns, children, ...props }: TableHeadProps) => JSX.Element;
export default TableHead;

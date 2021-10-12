import React from 'react';
export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
    colSpan?: number | string;
    rowSpan?: number | string;
    colStart?: number | string;
    rowStart?: number | string;
    colEnd?: number | string;
    rowEnd?: number | string;
    children?: React.ReactNode;
}
declare const GridItem: ({ children, colSpan, rowSpan, colStart, rowStart, colEnd, rowEnd, className, ...props }: GridItemProps) => JSX.Element;
export default GridItem;

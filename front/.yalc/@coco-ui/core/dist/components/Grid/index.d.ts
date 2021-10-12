import React from 'react';
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    autoCols?: string;
    autoRows?: string;
    cols?: number | 'none';
    rows?: number | 'none';
    flow?: string;
    gap?: string | number;
    children?: React.ReactNode;
}
declare const Grid: {
    ({ cols, rows, gap, flow, autoCols, autoRows, children, className, ...props }: GridProps): JSX.Element;
    Item: ({ children, colSpan, rowSpan, colStart, rowStart, colEnd, rowEnd, className, ...props }: import("./GridItem").GridItemProps) => JSX.Element;
};
export default Grid;

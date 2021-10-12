import React from 'react';
import './index.css';
declare const variants: {
    readonly card: ({ gap }: {
        gap: string | number;
    }) => string;
};
export declare type ListVariant = keyof typeof variants;
export declare type ListColumn<T = unknown> = {
    name: string;
    className?: string;
    sort?: (itemA: T, itemB: T) => number;
};
declare type ListContextType = {
    variant?: ListVariant;
    columns?: ListColumn[];
};
export declare const ListContext: React.Context<ListContextType>;
export declare const useListContext: () => ListContextType;
declare type ListChildrenRender<T = unknown> = ({ data }: {
    data: T[];
}) => JSX.Element;
export interface ListProps<T = unknown> {
    columns?: ListColumn[];
    data?: T[];
    children: ListChildrenRender<T>;
    className?: string;
    variant?: ListVariant;
    gap?: string | number;
}
declare const List: {
    ({ columns, data, children, className, variant, gap, }: ListProps): JSX.Element;
    Cell: ({ className, ...props }: React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>) => JSX.Element;
    Row: React.ForwardRefExoticComponent<Pick<React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>, "key" | keyof React.HTMLAttributes<HTMLDivElement>> & React.RefAttributes<HTMLDivElement>>;
};
export default List;

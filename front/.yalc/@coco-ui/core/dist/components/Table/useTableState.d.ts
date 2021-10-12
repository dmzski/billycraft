export declare type useTableStateProps = {
    data: any[];
    initialSort?: {
        field: string;
        order: 'asc' | 'desc';
    };
};
export declare type useTableStateResult = {
    data: any[];
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
    onSort: (field: string, order: 'asc' | 'desc') => any;
};
export declare const useTableState: ({ data, initialSort, }: useTableStateProps) => useTableStateResult;
export default useTableState;

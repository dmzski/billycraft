import React from 'react';
export declare type SelectOptionType = {
    value: string | number;
    label: string;
};
export declare type ValueType = string | number | Array<string | number> | undefined;
export interface SelectProps {
    className?: string;
    containerClassName?: string;
    filterOptions?: (args: {
        options: SelectOptionType[];
        search: string;
    }) => SelectOptionType[];
    id?: string;
    name?: string;
    options: SelectOptionType[];
    placeholder?: string;
    label?: string;
    labelVariant?: 'outside' | 'inside';
    onChange?: (result: ValueType) => unknown;
    onSearchChange?: (string: string) => any;
    value: ValueType;
    parentRef?: React.RefObject<HTMLDivElement>;
    disabled?: boolean;
    readOnly?: boolean;
    tabIndex?: number;
    isLoading?: boolean;
    isSearchable?: boolean;
    isMulti?: boolean;
    isMultiLine?: boolean;
    inputProps?: any;
    searchValue?: string;
}
declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLInputElement>>;
export default Select;

import React from 'react';
import { RenderSelectOptionProps } from './Option';
export declare type SelectOptionType = any;
export interface SelectProps {
    className?: string;
    containerClassName?: string;
    filterOptions?: (args: {
        options: SelectOptionType[];
        textKey: string;
        search: string;
    }) => SelectOptionType[];
    id?: string;
    name?: string;
    options: SelectOptionType[];
    placeholder?: string;
    label?: string;
    labelVariant?: 'outside' | 'inside';
    onChange?: (result: SelectOptionType | SelectOptionType[]) => unknown;
    onSearchChange?: (string: string) => any;
    value?: SelectOptionType | SelectOptionType[];
    parentRef?: React.RefObject<HTMLDivElement>;
    disabled?: boolean;
    readOnly?: boolean;
    tabIndex?: number;
    isLoading?: boolean;
    isSearchable?: boolean;
    isMulti?: boolean;
    isMultiLine?: boolean;
    textKey?: string;
    valueKey?: string;
    inputProps?: any;
    renderSelected?: (values: SelectOptionType[] | SelectOptionType) => React.ReactNode;
    renderOption?: (option: RenderSelectOptionProps) => React.ReactNode;
    searchValue?: string;
}
declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLInputElement>>;
export default Select;

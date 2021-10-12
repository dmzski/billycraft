import React from 'react';
import { SelectOptionType } from '.';
export interface RenderSelectOptionProps {
    option: SelectOptionType;
    isSelected?: boolean;
}
interface OptionProps {
    isMulti?: boolean;
    value: SelectOptionType | SelectOptionType[];
    valueKey: string;
    textKey: string;
    option: SelectOptionType;
    focused: number;
    index: number;
    renderOption?: (option: RenderSelectOptionProps) => React.ReactNode;
    onOptionClick: (option: SelectOptionType, event: React.MouseEvent) => void;
}
declare const Option: ({ isMulti, value, valueKey, textKey, option, focused, renderOption, onOptionClick, }: OptionProps) => JSX.Element;
export default Option;

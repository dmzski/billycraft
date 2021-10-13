import React from 'react';
import { SelectOptionType, ValueType } from '.';
export interface RenderSelectOptionProps {
    option: SelectOptionType;
    isSelected?: boolean;
}
interface OptionProps {
    isMulti?: boolean;
    value?: ValueType;
    option: SelectOptionType;
    focused: number | string;
    index: number;
    onOptionClick: (option: SelectOptionType, event: React.MouseEvent) => void;
}
declare const Option: ({ isMulti, value, option, focused, onOptionClick, }: OptionProps) => JSX.Element;
export default Option;

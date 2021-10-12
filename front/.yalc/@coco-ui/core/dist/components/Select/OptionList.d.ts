import React from 'react';
import { SelectOptionType } from '.';
import { RenderSelectOptionProps } from './Option';
interface OptionListProps {
    focused: number;
    isOpen?: boolean;
    name: string;
    options: SelectOptionType[];
    onOptionClick: (option: SelectOptionType, event: React.MouseEvent) => void;
    valueKey: string;
    textKey: string;
    value: SelectOptionType | SelectOptionType[];
    isMulti?: boolean;
    renderOption?: (optionProps: RenderSelectOptionProps) => React.ReactNode;
}
declare const OptionList: React.ForwardRefExoticComponent<OptionListProps & React.RefAttributes<HTMLDivElement>>;
export default OptionList;

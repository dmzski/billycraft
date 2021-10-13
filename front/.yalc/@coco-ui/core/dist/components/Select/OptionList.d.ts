import React from 'react';
import { SelectOptionType, ValueType } from '.';
interface OptionListProps {
    focused: string | number;
    isOpen?: boolean;
    name: string;
    options: SelectOptionType[];
    onOptionClick: (option: SelectOptionType, event: React.MouseEvent) => void;
    value?: ValueType;
    isMulti?: boolean;
}
declare const OptionList: React.ForwardRefExoticComponent<OptionListProps & React.RefAttributes<HTMLDivElement>>;
export default OptionList;

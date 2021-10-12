import React from 'react';
declare const variants: {
    basic: {
        label: (checked: boolean) => string;
        check: (checked: boolean) => string;
    };
};
declare type Variant = keyof typeof variants;
declare type LabelPosition = 'top' | 'right' | 'bottom' | 'left';
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    labelPosition?: LabelPosition;
    variant?: Variant;
    checked: boolean;
}
declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;
export default Checkbox;

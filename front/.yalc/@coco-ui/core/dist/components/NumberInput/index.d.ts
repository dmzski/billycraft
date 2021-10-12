import React from 'react';
declare const sizes: {
    xs: {
        container: string;
        icon: string;
    };
    sm: {
        container: string;
        icon: string;
    };
    md: {
        container: string;
        icon: string;
    };
    lg: {
        container: string;
        icon: string;
    };
    xl: {
        container: string;
        icon: string;
    };
    '2xl': {
        container: string;
        icon: string;
    };
};
export interface NumberInputProps {
    label?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    className?: string;
    id?: string;
    name?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => any;
    tabIndex?: number;
    step?: number;
    size?: keyof typeof sizes;
    value: string;
    width?: number | string;
}
declare const NumberInput: ({ name, id, "aria-labelledby": ariaLabelledBy, "aria-label": ariaLabel, value: defaultValue, onChange, label, className, step, tabIndex, size, width, }: NumberInputProps) => JSX.Element;
export default NumberInput;

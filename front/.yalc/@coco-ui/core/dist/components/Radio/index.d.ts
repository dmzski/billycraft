import React from 'react';
export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    labelPosition?: 'left' | 'right';
    className?: string;
}
declare const Radio: ({ name, id, "aria-labelledby": ariaLabelledBy, "aria-label": ariaLabel, value, onChange, checked, defaultChecked, label, labelPosition, className, }: RadioProps) => JSX.Element;
export default Radio;

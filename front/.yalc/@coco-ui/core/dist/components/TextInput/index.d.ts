import React from 'react';
declare type TextInputType = React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export interface TextInputProps extends TextInputType {
    className?: string;
    multiline?: boolean;
    label?: string | React.ReactNode;
    labelVariant?: 'inside' | 'outside';
    containerClassName?: string;
    autoResizeHeight?: boolean;
}
declare const TextInput: React.ForwardRefExoticComponent<TextInputProps & React.RefAttributes<unknown>>;
export default TextInput;

import React, { AriaAttributes } from 'react';
declare type RenderSelectedProps = {
    array: string[];
    onDelete: (index: number) => any;
};
export declare type TextArrayInputProps = AriaAttributes & {
    onInputChange?: (event: React.ChangeEvent<any>) => any;
    onChange?: (strings: string[]) => any;
    onFocus?: React.FocusEventHandler;
    onBlur?: React.FocusEventHandler;
    onKeyDown?: React.KeyboardEventHandler;
    onKeyPress?: React.KeyboardEventHandler;
    onKeyUp?: React.KeyboardEventHandler;
    value?: string[];
    className?: string;
    placeholder?: string;
    ref?: React.Ref<HTMLInputElement>;
    renderSelected?: (props: RenderSelectedProps) => React.ReactNode;
    disabled?: boolean;
};
declare const TextArrayInput: ({ disabled, onInputChange, onKeyDown, onChange, value, placeholder, ref, renderSelected, ...props }: TextArrayInputProps) => JSX.Element;
export default TextArrayInput;

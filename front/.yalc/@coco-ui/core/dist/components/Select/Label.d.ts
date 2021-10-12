import React from 'react';
declare type LabelProps = {
    variant: 'inside' | 'outside';
    id?: string;
    children: React.ReactNode;
};
declare const Label: ({ variant, id, children }: LabelProps) => JSX.Element;
export default Label;

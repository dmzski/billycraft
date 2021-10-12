import React from 'react';
declare const variants: {
    basic: string;
    outline: string;
    'no-border': string;
};
export interface BadgeProps {
    variant: keyof typeof variants;
    className?: string;
    children?: React.ReactNode;
}
declare const Badge: {
    ({ variant, children, className, ...props }: BadgeProps): JSX.Element;
    defaultProps: {
        className: string;
        color: string;
        variant: string;
    };
};
export default Badge;

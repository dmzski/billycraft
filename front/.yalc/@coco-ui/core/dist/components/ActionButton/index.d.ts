import React from 'react';
declare const sizes: {
    xs: string;
    sm: string;
    md: string;
    xl: string;
    '2xl': string;
};
declare const variants: {
    primary: string;
    outline: string;
    'no-border': string;
};
export interface ActionButtonProps {
    children: React.ReactNode;
    className?: string;
    variant: keyof typeof variants;
    size?: keyof typeof sizes;
}
declare const ActionButton: {
    ({ children, className, variant, size, ...props }: ActionButtonProps): JSX.Element;
    defaultProps: {
        variant: string;
    };
    Content: {
        (props: IContentProps): JSX.Element;
        displayName: string;
    };
    Action: {
        (props: IActionProps): JSX.Element;
        displayName: string;
    };
};
interface IActionProps {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}
interface IContentProps {
    children: React.ReactNode;
}
export default ActionButton;

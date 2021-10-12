import { IconName } from 'components/Icon';
import React from 'react';
import './index.css';
declare const variants: {
    primary: string;
    default: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    transparent: string;
    link: string;
    'inverted-primary': string;
    'inverted-default': string;
    'inverted-success': string;
    'inverted-error': string;
    'inverted-warning': string;
    'inverted-info': string;
};
declare type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    tabIndex: number;
    className?: string;
    variant: keyof typeof variants;
    onClick?: (event: React.MouseEvent) => any;
    type?: 'button' | 'submit' | 'reset' | undefined;
    children?: React.ReactNode;
    size?: ButtonSize;
    icon?: IconName;
    iconSize?: number;
    iconPosition: 'left' | 'right';
}
declare const Button: {
    ({ children, tabIndex, className, variant, size, icon, iconPosition, iconSize, ...props }: ButtonProps): JSX.Element;
    defaultProps: Partial<ButtonProps>;
};
export default Button;

import React from 'react';
export interface TopBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    children: React.ReactNode;
}
declare const TopBar: ({ children, ...props }: TopBarProps) => JSX.Element;
export default TopBar;

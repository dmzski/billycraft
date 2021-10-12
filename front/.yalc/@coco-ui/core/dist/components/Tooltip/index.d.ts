import React from 'react';
declare type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';
export interface TooltipProps extends React.InputHTMLAttributes<HTMLInputElement> {
    text?: string;
    render?: React.ReactNode;
    children?: React.ReactNode;
    toolptipId?: string;
    position?: TooltipPosition;
}
declare const Tooltip: ({ render, children, toolptipId, position, }: TooltipProps) => JSX.Element;
export default Tooltip;

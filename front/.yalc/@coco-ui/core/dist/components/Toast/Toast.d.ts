import React from 'react';
declare const variants: {
    default: {
        toast: string;
        progressBar: string;
    };
    success: {
        toast: string;
        progressBar: string;
    };
    error: {
        toast: string;
        progressBar: string;
    };
    warning: {
        toast: string;
        progressBar: string;
    };
    info: {
        toast: string;
        progressBar: string;
    };
};
export declare type ToastVariant = keyof typeof variants;
export declare type ToastProps = {
    onClose: (index: number) => any;
    duration: number;
    render?: React.ReactNode;
    variant: ToastVariant;
    id: number;
};
declare const Toast: ({ onClose, duration, render, variant, id, }: ToastProps) => JSX.Element;
export default Toast;

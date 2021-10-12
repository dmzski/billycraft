import React from 'react';
export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    children?: React.ReactNode;
}
declare const Box: {
    ({ children, className, ...props }: BoxProps): JSX.Element;
    defaultProps: {
        className: string;
    };
};
export default Box;

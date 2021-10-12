import React from 'react';
export interface LinkProps {
    as?: string;
    className: string;
    children: React.ReactNode;
    to: string;
}
declare const Link: {
    ({ className, children, ...props }: LinkProps): JSX.Element;
    defaultProps: Partial<LinkProps>;
};
export default Link;

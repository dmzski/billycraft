import React from 'react';
export declare const getStringFromAlt: (altStr: string) => string;
export interface AvatarProps extends React.HTMLAttributes<HTMLImageElement | HTMLDivElement> {
    size: number;
    src?: string;
    className?: string;
    alt: string;
}
declare const Avatar: {
    ({ size, src, alt, className, ...props }: AvatarProps): JSX.Element;
    defaultProps: {
        size: number;
    };
};
export default Avatar;

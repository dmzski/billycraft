import React from 'react';
declare const positions: {
    top: {
        container: string;
        closeButton: string;
    };
    right: {
        container: string;
        closeButton: string;
    };
    bottom: {
        container: string;
        closeButton: string;
    };
    left: {
        container: string;
        closeButton: string;
    };
};
export interface DrawerProps {
    open: boolean;
    onClose?: (event: React.MouseEvent) => void;
    position: keyof typeof positions;
    children?: React.ReactNode;
    hasBackdrop?: boolean;
    hasCloseButton?: boolean;
}
declare const Drawer: {
    ({ children, open, hasBackdrop, hasCloseButton, position, onClose, }: DrawerProps): JSX.Element;
    defaultProps: Partial<DrawerProps>;
};
export default Drawer;

import React from 'react';
import { ModalAnimation, ModalPosition, ModalSize } from './helpers';
export interface ModalProps extends React.DialogHTMLAttributes<HTMLDivElement> {
    open?: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    closeOnOverlayDoubleClick?: boolean;
    size?: ModalSize;
    position?: ModalPosition;
    animation?: ModalAnimation;
    alwaysRender?: boolean;
}
declare const Modal: ({ animation, open, onClose, children, size, position, closeOnOverlayDoubleClick, "aria-labelledby": ariaLabelledBy, "aria-label": ariaLabel, alwaysRender, }: ModalProps) => JSX.Element;
export default Modal;

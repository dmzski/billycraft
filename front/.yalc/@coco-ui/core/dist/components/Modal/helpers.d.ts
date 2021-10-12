declare const sizes: Record<string, string>;
export declare type ModalSize = keyof typeof sizes;
export declare type ModalPosition = 'top' | 'right' | 'bottom' | 'left' | 'center';
export declare type ModalState = 'closed' | 'opened' | 'opening' | 'closing';
export declare const getSize: (size: ModalSize) => string;
declare const fades: {
    fade: {
        in: string;
        out: string;
    };
    fadeTop: {
        in: string;
        out: string;
    };
    fadeRight: {
        in: string;
        out: string;
    };
    fadeBottom: {
        in: string;
        out: string;
    };
    fadeLeft: {
        in: string;
        out: string;
    };
};
export declare type ModalAnimation = keyof typeof fades;
export declare const getModalClassNames: (animation: ModalAnimation, state: ModalState, position: ModalPosition, size: ModalSize) => Record<string, string>;
export {};

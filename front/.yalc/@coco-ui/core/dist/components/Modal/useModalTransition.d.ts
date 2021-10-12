import { ModalState } from './helpers';
declare type useModalTransitionProps = {
    defaultOpen: boolean | undefined;
    onOpenDuration: number;
    onCloseDuration?: number;
    callbacks: {
        opened?: () => void | undefined;
        opening?: () => void | undefined;
        closed?: () => void | undefined;
        closing?: () => void | undefined;
    };
};
declare type useModalTransitionState = {
    state: ModalState;
    open: () => void;
    close: () => void;
    isOpen: boolean;
    isClose: boolean;
};
declare const useModalTransition: ({ defaultOpen, onOpenDuration, onCloseDuration, callbacks, }: useModalTransitionProps) => useModalTransitionState;
export default useModalTransition;

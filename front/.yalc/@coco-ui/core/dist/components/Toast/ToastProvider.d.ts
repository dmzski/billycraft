export declare type ToastProviderProps = {
    children: any;
    duration?: number;
    maxConcurrent?: number;
};
declare const ToastProvider: ({ children, duration, maxConcurrent, }: ToastProviderProps) => JSX.Element;
export declare const useToast: () => any;
export default ToastProvider;

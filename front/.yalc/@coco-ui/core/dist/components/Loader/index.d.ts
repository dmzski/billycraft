declare type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export interface LoaderProps {
    size?: number | LoaderSize;
    color?: string;
    className?: string;
}
declare const Loader: ({ size, color, className, }: LoaderProps) => JSX.Element;
export default Loader;

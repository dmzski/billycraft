import { tw } from "lib/utils";

export type LoaderProps = {
	className?: string;
};

const Loader = ({ className = "" }: LoaderProps) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={tw("animate-spin size-8", className)}
		>
			<path d="M21 12a9 9 0 1 1-6.219-8.56" />
		</svg>
	);
};

export default Loader;

import { useMediaQuery } from "@react-hook/media-query";

type UseBreakPointReturn = {
	isXs: boolean;
	isSm: boolean;
	isMd: boolean;
	isLg: boolean;
	isXl: boolean;
};
// sm: "640px",
// md: "768px",
// lg: "1024px",
// xl: "1280px",
const useBreakpoint = (): UseBreakPointReturn => {
	const xs = useMediaQuery("only screen and (max-width: 640px)");
	const sm = useMediaQuery("only screen and (min-width: 640px)");
	const md = useMediaQuery("only screen and (min-width: 768px)");
	const lg = useMediaQuery("only screen and (min-width: 1024px)");
	const xl = useMediaQuery("only screen and (min-width: 1280px)");

	return {
		isXs: xs,
		isSm: sm,
		isMd: md,
		isLg: lg,
		isXl: xl,
	};
};

export default useBreakpoint;

import type { Scanner } from "@yudiel/react-qr-scanner";
import type { ComponentProps } from "react";

export const SCANNER_FORMATS: ComponentProps<typeof Scanner>["formats"] = [
	"qr_code",
	"micro_qr_code",
	"rm_qr_code",
	"maxi_code",
	"pdf417",
	"aztec",
	"data_matrix",
	"matrix_codes",
	"dx_film_edge",
	"databar",
	"databar_expanded",
	"codabar",
	"code_39",
	"code_93",
	"code_128",
	"ean_8",
	"ean_13",
	"itf",
	"linear_codes",
	"upc_a",
	"upc_e",
];

export const SCANNER_COMPONENTS = {
	audio: false,
	onOff: false,
	torch: true,
	zoom: true,
	finder: false,
};

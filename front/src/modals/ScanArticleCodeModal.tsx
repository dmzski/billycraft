import { Scanner } from "@yudiel/react-qr-scanner";
import { ComponentProps } from "react";
import { sendErrorToSentry } from "@/utils/errors";
import { Modal } from "@billycraft/ui";
import { SCANNER_COMPONENTS, SCANNER_FORMATS } from "@/constants/scanner";

type ScanArticleCodeModalProps = {
	disclosure: ComponentProps<typeof Modal>["disclosure"];
	onScan: ComponentProps<typeof Scanner>["onScan"];
};

export const ScanArticleCodeModal = ({
	disclosure,
	onScan,
}: ScanArticleCodeModalProps) => (
	<Modal disclosure={disclosure}>
		{({ close }) => (
			<div className="pt-8">
				<Scanner
					onScan={(codes) => {
						onScan(codes);
						close();
					}}
					classNames={{
						container: "scanner",
					}}
					formats={SCANNER_FORMATS}
					components={SCANNER_COMPONENTS}
					scanDelay={500}
					allowMultiple
					onError={(err) => {
						sendErrorToSentry(err);
					}}
				/>
			</div>
		)}
	</Modal>
);

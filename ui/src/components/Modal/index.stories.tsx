import { useState } from "react";
import Modal from ".";
import { Button } from "components/Button";
import { StoryObj } from "@storybook/react";

export default {
	title: "Components/Modal",
	component: Modal,
};

type Story = StoryObj<typeof Modal>;

export const Basic: Story = {
	render: ({ withoutPortal, hideOnClickOutside }) => (
		<Modal
			disclosure={<Button>Open modal</Button>}
			withoutPortal={withoutPortal}
			hideOnClickOutside={hideOnClickOutside}
		>
			{<>You can close me</>}
		</Modal>
	),
	args: {
		withoutPortal: false,
		hideOnClickOutside: true,
	},
};

export const Controlled: Story = {
	render: ({ withoutPortal, hideOnClickOutside }) => {
		const [open, setOpen] = useState(false);

		return (
			<>
				<Button
					onClick={() => {
						setOpen(true);
					}}
				>
					Open controlled modal
				</Button>
				<Modal
					open={open}
					onClose={() => setOpen(false)}
					withoutPortal={withoutPortal}
					hideOnClickOutside={hideOnClickOutside}
				>
					{<>You can close me</>}
				</Modal>
			</>
		);
	},
	args: {
		withoutPortal: false,
		hideOnClickOutside: true,
	},
};

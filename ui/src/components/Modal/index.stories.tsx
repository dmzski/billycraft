import type { StoryObj } from "@storybook/react";
import { Button } from "components/Button";
import { Dropdown } from "components/Dropdown";
import { Select } from "components/Select";
import { useState } from "react";
import { Modal } from ".";

export default {
	title: "Components/Modal",
	component: Modal,
};

type Story = StoryObj<typeof Modal>;

export const Basic: Story = {
	render: ({ withoutPortal, hideOnClickOutside, size }) => (
		<Modal
			disclosure={<Button>Open modal</Button>}
			withoutPortal={withoutPortal}
			hideOnClickOutside={hideOnClickOutside}
			size={size}
		>
			{({ close }) => (
				<div>
					<Modal.Title>Title</Modal.Title>
					<p>Description</p>
					<Modal.Actions>
						<Button onClick={close}>Close</Button>
					</Modal.Actions>
				</div>
			)}
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
					You can close me
				</Modal>
			</>
		);
	},
	args: {
		withoutPortal: false,
		hideOnClickOutside: true,
	},
};

export const WithScroll: Story = {
	render: ({ withoutPortal, hideOnClickOutside }) => (
		<>
			<Modal
				disclosure={<Button>Open scrollable modal</Button>}
				withoutPortal={withoutPortal}
				hideOnClickOutside={hideOnClickOutside}
			>
				<div className="flex flex-col gap-4">
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
					<p>Content</p>
				</div>
			</Modal>
		</>
	),
	args: {
		withoutPortal: false,
		hideOnClickOutside: true,
	},
};

export const WithSelectDropdown: Story = {
	render: ({ withoutPortal, hideOnClickOutside, size }) => (
		<Modal
			disclosure={<Button>Open modal</Button>}
			withoutPortal={withoutPortal}
			hideOnClickOutside={hideOnClickOutside}
			size={size}
		>
			{({ close }) => (
				<div>
					<Modal.Title>Title</Modal.Title>
					<div className="grid grid-cols-2">
						<Dropdown disclosure={<Button>Dropdown</Button>}>
							<Dropdown.Content>
								<Dropdown.Button>1</Dropdown.Button>
								<Dropdown.Button>2</Dropdown.Button>
								<Dropdown.Button>3</Dropdown.Button>
								<Dropdown.Button>4</Dropdown.Button>
							</Dropdown.Content>
						</Dropdown>
						<Select
							options={[
								{ value: "1", label: "1" },
								{ value: "1", label: "1" },
								{ value: "1", label: "1" },
								{ value: "1", label: "1" },
								{ value: "1", label: "1" },
								{ value: "1", label: "1" },
								{ value: "1", label: "1" },
								{ value: "1", label: "1" },
								{ value: "1", label: "1" },
							]}
							value=""
						/>
					</div>
					<Modal.Actions>
						<Button onClick={close}>Close</Button>
					</Modal.Actions>
				</div>
			)}
		</Modal>
	),
	args: {
		withoutPortal: false,
		hideOnClickOutside: true,
	},
};

export const StackedDropdown: Story = {
	render: ({ withoutPortal, hideOnClickOutside, size }) => (
		<Modal
			disclosure={<Button>Open modal</Button>}
			withoutPortal={withoutPortal}
			hideOnClickOutside={hideOnClickOutside}
			size={size}
		>
			{({ close }) => (
				<div>
					<Modal.Title>Title</Modal.Title>
					<div className="grid grid-cols-2">
						<Modal hideOnClickOutside disclosure={<Button>Open 2</Button>}>
							{({ close: close2 }) => (
								<div>
									<Modal.Title>Title 2</Modal.Title>

									<Modal.Actions>
										<Button onClick={close2}>Close</Button>
									</Modal.Actions>
								</div>
							)}
						</Modal>
					</div>
					<Modal.Actions>
						<Button onClick={close}>Close</Button>
					</Modal.Actions>
				</div>
			)}
		</Modal>
	),
	args: {
		withoutPortal: false,
		hideOnClickOutside: true,
	},
};

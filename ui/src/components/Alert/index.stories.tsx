import type { StoryObj } from "@storybook/react";
import { Alert } from "./index";

export default {
	title: "components/Alert",
	component: Alert,
};

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
	render: ({ children, ...props }) => <Alert {...props}>{children}</Alert>,
	args: {
		children: "It gonna be legen wait for it... legendary !",
	},
};
export const Destructive: Story = {
	render: ({ children, ...props }) => <Alert {...props}>{children}</Alert>,
	args: {
		children: "It gonna be legen wait for it... legendary !",
		variant: "destructive",
	},
};

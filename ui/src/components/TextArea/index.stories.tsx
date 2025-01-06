import type { StoryObj } from "@storybook/react";
import { TextArea } from ".";

export default {
	title: "Components/TextArea",
	component: TextArea,
};

type Story = StoryObj<typeof TextArea>;

const render: Story["render"] = (args) => <TextArea {...args} />;

export const Basic: Story = {
	render,
};

export const WithLabel: Story = {
	render,
	args: {
		label: "My awesome label",
	},
};

export const WithError: Story = {
	render,
	args: {
		value: "test",
		label: "My awesome label",
		error: "Test error",
	},
};

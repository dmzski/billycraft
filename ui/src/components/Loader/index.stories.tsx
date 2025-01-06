import type { StoryObj } from "@storybook/react";
import Loader from ".";

export default {
	title: "Components/Loader",
	component: Loader,
};

type Story = StoryObj<typeof Loader>;

const render: Story["render"] = (args) => <Loader {...args} />;

export const Basic: Story = {
	render,
	args: {},
};

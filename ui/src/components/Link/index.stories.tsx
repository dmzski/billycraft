import { StoryObj } from "@storybook/react";
import { Link } from ".";

export default {
	title: "Components/Link",
	component: Link,
};

type Story = StoryObj<typeof Link>;

export const Basic: Story = {
	render: (args) => <Link {...args} />,
	args: {
		children: "Basic",
	},
};

export const ButtonVariant: Story = {
	render: (args) => <Link {...args} />,
	args: {
		children: "Basic",
		variant: "button",
	},
};

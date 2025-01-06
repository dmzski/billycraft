import type { StoryObj } from "@storybook/react";
import { useState } from "react";
import { Switch } from ".";

export default {
	title: "Components/Switch",
	component: Switch,
};

type Story = StoryObj<typeof Switch>;
const render: Story["render"] = ({ checked, onCheckedChange, ...props }) => {
	const [isChecked, setIsChecked] = useState(checked);
	return (
		<Switch
			checked={isChecked}
			onCheckedChange={(newValue) => {
				setIsChecked(newValue);
				onCheckedChange?.(newValue);
			}}
			{...props}
		/>
	);
};

export const Basic: Story = {
	render,
	args: {
		id: "test",
		value: "on",
	},
};

export const WithLabel: Story = {
	render,
	args: {
		label: "My awesome switch",
		id: "test",
		value: "on",
	},
};

export const Disabled: Story = {
	render,
	args: {
		label: "My awesome switch",
		id: "test",
		value: "on",
		disabled: true,
	},
};

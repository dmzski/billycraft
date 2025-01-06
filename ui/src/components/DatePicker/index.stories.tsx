import type { StoryObj } from "@storybook/react";
import { useState } from "react";
import { DatePicker, type DatePickerProps } from ".";

export default {
	title: "Components/DatePicker",
	component: DatePicker,
};

type Story = StoryObj<typeof DatePicker>;

const render = ({ ...args }: DatePickerProps) => {
	const [value, setValue] = useState<Date | undefined>();
	return (
		<DatePicker
			{...args}
			value={value}
			onChange={(newValue) => setValue(newValue)}
		/>
	);
};

export const Basic: Story = {
	render,
	args: {
		label: "Basic",
	},
};

export const Labeled: Story = {
	render,
	args: {
		label: "Labeled",
	},
};

export const Disabled: Story = {
	render,
	args: {
		label: "Disabled",
		disabled: true,
	},
};

export const WithError: Story = {
	render,
	args: {
		label: "Error",
		error: true,
	},
};

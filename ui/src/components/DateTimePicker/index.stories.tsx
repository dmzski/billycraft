import type { StoryObj } from "@storybook/react"
import { useState } from "react"
import { DateTimePicker, type DateTimePickerProps } from "."

export default {
	title: "Components/DateTimePicker",
	component: DateTimePicker,
}

type Story = StoryObj<typeof DateTimePicker>

const render = ({ ...args }: DateTimePickerProps) => {
	const [value, setValue] = useState<Date | undefined>()
	return (
		<DateTimePicker
			{...args}
			value={value}
			onChange={(newValue) => setValue(newValue)}
		/>
	)
}

export const Basic: Story = {
	args: {
		label: "Basic",
	},
	render,
}

export const Labeled: Story = {
	render,
	args: {
		label: "Labeled",
	},
}

export const Disabled: Story = {
	render,
	args: {
		label: "Disabled",
		disabled: true,
	},
}

export const WithError: Story = {
	render,
	args: {
		label: "Error",
		error: true,
	},
}

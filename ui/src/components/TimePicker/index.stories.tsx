import type { StoryObj } from "@storybook/react"
import { useState } from "react"
import { TimePicker, type TimePickerProps } from "."

export default {
	title: "Components/TimePicker",
	component: TimePicker,
}

type Story = StoryObj<typeof TimePicker>

const render: Story["render"] = ({ ...args }: TimePickerProps) => {
	const [value, setValue] = useState("")

	return (
		<TimePicker
			{...args}
			value={value}
			onChange={(newValue) => setValue(newValue)}
		/>
	)
}

export const Basic: Story = {
	render,
	args: {
		id: "test",
	},
}

export const Disabled: Story = {
	render,
	args: {
		id: "test",
		disabled: true,
	},
}

export const WithError: Story = {
	render,
	args: {
		id: "test",
		error: true,
	},
}

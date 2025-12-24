import type { StoryObj } from "@storybook/react"
import { Button } from "components/Button"
import { Dropdown } from "."

export default {
	title: "Components/Dropdown",
	component: Dropdown,
}

type Story = StoryObj<typeof Dropdown>

export const Basic: Story = {
	render: (args) => {
		return (
			<Dropdown {...args} disclosure={<Button>Click me</Button>}>
				{({ close }) => (
					<Dropdown.Content>
						<Dropdown.Link href="/">This is a link</Dropdown.Link>
						<Dropdown.Button>Action</Dropdown.Button>
						<Dropdown.Button>Action</Dropdown.Button>
						<Dropdown.Button>Action</Dropdown.Button>
						<Dropdown.Button onClick={close}>
							Action that close dropdown
						</Dropdown.Button>
						<Dropdown.Button>
							Action that has a super long content
						</Dropdown.Button>
					</Dropdown.Content>
				)}
			</Dropdown>
		)
	},
}

export const Align: Story = {
	render: (args) => {
		return (
			<Dropdown {...args} disclosure={<Button>Click me</Button>}>
				{({ close }) => (
					<Dropdown.Content align="end">
						<Dropdown.Link href="/">This is a link</Dropdown.Link>
						<Dropdown.Button>Action</Dropdown.Button>
						<Dropdown.Button>Action</Dropdown.Button>
						<Dropdown.Button>Action</Dropdown.Button>
						<Dropdown.Button onClick={close}>
							Action that close dropdown
						</Dropdown.Button>
						<Dropdown.Button>
							Action that has a super long content
						</Dropdown.Button>
					</Dropdown.Content>
				)}
			</Dropdown>
		)
	},
}

export const CustomStyles: Story = {
	render: (args) => {
		return (
			<Dropdown {...args} disclosure={<Button>Click me w-52</Button>}>
				<Dropdown.Content className="w-52">
					<Dropdown.Button>Action</Dropdown.Button>
					<Dropdown.Button>Action</Dropdown.Button>
					<Dropdown.Button>Action</Dropdown.Button>
					<Dropdown.Button>Action</Dropdown.Button>
					<Dropdown.Button>
						Action that has a super long content
					</Dropdown.Button>
				</Dropdown.Content>
			</Dropdown>
		)
	},
}

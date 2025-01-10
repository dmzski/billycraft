import type { StoryObj } from "@storybook/react"
import { Button } from "."

export default {
	title: "Components/Button",
	component: Button,
}
type Story = StoryObj<typeof Button>

export const Basic: Story = {
	args: {
		children: "Basic",
		size: "default",
	},
}

export const Variants = () => (
	<div style={{ display: "flex", gap: 4 }}>
		<Button variant="default">default</Button>
		<Button variant="secondary">secondary</Button>
		<Button variant="destructive">destructive</Button>
		<Button variant="link">link</Button>
		<Button variant="ghost">ghost</Button>
		<Button variant="outline">outline</Button>
	</div>
)

export const Sizes = () => (
	<div style={{ display: "flex", gap: 4 }}>
		<Button size="default">default</Button>
		<Button size="sm">sm</Button>
		<Button size="lg">lg</Button>
		<Button size="icon">icon</Button>
	</div>
)

export const Disabled = () => (
	<div style={{ display: "flex", gap: 4 }}>
		<Button disabled variant="default">
			default
		</Button>
		<Button disabled variant="secondary">
			secondary
		</Button>
		<Button disabled variant="destructive">
			destructive
		</Button>
		<Button disabled variant="link">
			link
		</Button>
		<Button disabled variant="ghost">
			ghost
		</Button>
		<Button disabled variant="outline">
			outline
		</Button>
	</div>
)

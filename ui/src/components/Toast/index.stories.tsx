import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "components/Button";
import { ToastProvider } from ".";
import type { ToastProps } from "./Toast";
import { useToast } from "./ToastProvider";

export default {
	title: "Components/Toast",
	component: ToastProvider,
	decorators: [
		(ToastStory) => (
			<ToastProvider>
				<ToastStory />
			</ToastProvider>
		),
	],
} as Meta;

type Story = StoryObj<ToastProps>;

export const Basic: Story = {
	render: ({ children, duration, variant }: ToastProps) => {
		const toast = useToast();

		const showToast = () => {
			toast.show(children, { duration, variant });
		};

		return (
			<>
				<Button onClick={showToast}>Show toast</Button>
			</>
		);
	},
	args: {
		duration: 3000,
		children: "Test message",
		variant: undefined,
	},
};

export const Variants = {
	render: () => {
		const toast = useToast();

		const showToast = (variant?: ToastProps["variant"]) => () => {
			toast.show(variant ?? "default", { variant });
		};

		return (
			<div className="flex flex-col gap-1">
				<Button variant="destructive" onClick={showToast("destructive")}>
					destructive
				</Button>
				<Button variant="secondary" onClick={showToast()}>
					default
				</Button>
			</div>
		);
	},
};

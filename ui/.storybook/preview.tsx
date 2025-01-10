import "../src/index.css"
import type { ComponentType, ReactNode } from "react"

export const parameters = {
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	options: {
		storySort: {
			method: "",
			order: ["Introduction", "Components", "Credits"],
			locales: "",
		},
	},
	backgrounds: {
		disable: true,
	},
}

const Root = ({ children }: { children: ReactNode }) => {
	const firstHtml = document.querySelector("html")

	if (firstHtml) firstHtml.setAttribute("data-theme", "light")

	return children
}

export const decorators = [
	(Story: ComponentType) => (
		<Root>
			<Story />
		</Root>
	),
]
export const tags = ["autodocs"]

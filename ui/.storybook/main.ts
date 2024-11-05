import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],

	framework: "@storybook/react-vite",
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-a11y",
		"@storybook/addon-themes",
		"@storybook/addon-mdx-gfm",
		"@chromatic-com/storybook",
	],

	core: {
		builder: "@storybook/builder-vite",
	},
	async viteFinal(config) {
		// Merge custom configuration into the default config
		return mergeConfig(config, {
			// Add dependencies to pre-optimization
			optimizeDeps: {
				include: ["storybook-dark-mode"],
			},
			resolve: {
				alias: [
					{
						find: "components",
						replacement: path.resolve(__dirname, "../src/components"),
					},
					{
						find: "hooks",
						replacement: path.resolve(__dirname, "../src/hooks"),
					},
				],
			},
		});
	},

	typescript: {
		check: false,
		reactDocgen: "react-docgen-typescript",
	},

	docs: {},
};

export default config;

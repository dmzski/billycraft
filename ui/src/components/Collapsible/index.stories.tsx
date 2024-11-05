import { Meta } from "@storybook/react";
import { Collapsible } from ".";
import { Button } from "components/Button";
import { Dropdown } from "components/Dropdown";
import { Select } from "components/Select";

export default {
	title: "Components/Collapsible",
	component: Collapsible,
} as Meta<typeof Collapsible>;

export const Basic = () => (
	<Collapsible open disclosure={<Button>Toggle collapsible</Button>}>
		<div className="border rounded-md p-4">
			<p>Some Text</p>
			<p>Again some Text</p>
			<Dropdown disclosure={<Button>Click me</Button>}>
				<Dropdown.Content>
					<Dropdown.Button>1</Dropdown.Button>
					<Dropdown.Button>2</Dropdown.Button>
					<Dropdown.Button>3</Dropdown.Button>
				</Dropdown.Content>
			</Dropdown>
			<Select
				label="text me"
				options={[{ label: "test", value: "test" }]}
				value=""
			/>
		</div>
	</Collapsible>
);

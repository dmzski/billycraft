import { Meta } from "@storybook/react";
import { Collapsible } from ".";
import { Button } from "components/Button";

export default {
	title: "Components/Collapsible",
	component: Collapsible,
} as Meta<typeof Collapsible>;


export const Basic = () => (
  <Collapsible disclosure={
    <Button>Toggle collapsible</Button>
  }>
  <div className="border rounded-lg pt-2">
    <p>Awesome text</p>
    <p>Awesome text</p>
    <p>Awesome text</p>
    <p>Awesome text</p>
    <p>Awesome text</p>
    <p>Awesome text</p>
    <p>Awesome text</p>
    <p>Awesome text</p>
    <p>Awesome text</p>
    <p>Awesome text</p>
    <p>Awesome text</p>
    <p>Awesome text</p>
    <p>Awesome text</p>
    <p>Awesome text</p>
    <p>Awesome text</p>
  </div>
  </Collapsible>
)

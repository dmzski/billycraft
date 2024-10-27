import { useTheme } from "@/providers/ThemeProvider";
import { Button, Dropdown } from "@coco-ui/core";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

export function ThemeToggle() {
	const { setTheme } = useTheme();

	return (
		<Dropdown
			disclosure={
				<Button variant="outline" size="icon" className="min-w-[2.5rem]">
					<SunIcon className="min-h-[1.2rem] min-w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<MoonIcon className="absolute min-h-[1.2rem] min-w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			}
		>
			<Dropdown.Content align="end">
				<Dropdown.Button onClick={() => setTheme("light")}>
					Light
				</Dropdown.Button>
				<Dropdown.Button onClick={() => setTheme("dark")}>Dark</Dropdown.Button>
				<Dropdown.Button onClick={() => setTheme("system")}>
					System
				</Dropdown.Button>
			</Dropdown.Content>
		</Dropdown>
	);
}

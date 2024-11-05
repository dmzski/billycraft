import { Fragment, useCallback, useMemo, useState } from "react";
import { datesAreOnSameDay, datesOfMonthAndYear, daysOfWeek } from "./helpers";
import { Button } from "../Button";
import ArrowLeftIcon from "@heroicons/react/24/outline/ArrowLeftIcon";
import ArrowRightIcon from "@heroicons/react/24/outline/ArrowRightIcon";
import { tw } from "lib/utils";
import TimeCalendar from "./TimeCalendar";

type MonthCalendarButtonProps = {
	date?: Date;
	onDateClick?: (newDate: Date) => void;
	selected?: Date;
};

const buttonClassNames = tw(
	"user-select-none appearance-none text-sm rounded-md size-10",
	"hover:bg-primary hover:text-primary-foreground",
	"aria-[selected=true]:bg-primary aria-[selected=true]:text-primary-foreground",
);
const MonthCalendarButton = ({
	date,
	selected,
	onDateClick,
}: MonthCalendarButtonProps) => {
	const isSelected =
		selected && date ? datesAreOnSameDay(selected, date) : false;

	if (date)
		return (
			<button
				onClick={() => {
					onDateClick?.(date);
				}}
				className={buttonClassNames}
				aria-selected={isSelected}
			>
				{date.getDate()}
			</button>
		);

	return <div className="size-10" />;
};

type MonthCalendarProps = {
	selected?: Date;
	onDateClick: (newDate: Date) => void;
	onTimeClick: (hours: number, minutes: number) => void;
};

const MonthCalendar = ({
	selected,
	onDateClick,
	onTimeClick,
}: MonthCalendarProps) => {
	const [dateView, setDateView] = useState(selected ?? new Date());

	const goPrevious = useCallback(() => {
		setDateView((current) => {
			current.setMonth(current.getMonth() - 1);
			return new Date(current);
		});
	}, []);

	const goNext = useCallback(() => {
		setDateView((current) => {
			current.setMonth(current.getMonth() + 1);
			return new Date(current);
		});
	}, []);

	const dates = useMemo(() => datesOfMonthAndYear(dateView), [dateView]);

	const daysOfWeekStrings = useMemo(() => daysOfWeek(undefined), []);

	return (
		<div className="w-70 flex flex-col gap-2">
			<div className="flex flex-col">
				<div className="border-b gap-2 p-1 flex items-center justify-between">
					<Button
						aria-label="Previous"
						type="button"
						variant="ghost"
						onClick={goPrevious}
					>
						<ArrowLeftIcon className="size-5" />
					</Button>
					<div className="text-center">
						{dateView
							.toLocaleDateString(undefined, {
								month: "long",
								year: "numeric",
							})
							.toLocaleUpperCase()}
					</div>
					<Button
						aria-label="Next"
						type="button"
						variant="ghost"
						onClick={goNext}
					>
						<ArrowRightIcon className="size-5" />
					</Button>
				</div>
			</div>
			<div className="px-2 grid grid-cols-7 gap-2">
				{daysOfWeekStrings.map((dayString, dayIndex) => (
					<div
						key={`${dateView.getMonth()}-weekday-${dayIndex}`}
						className="text-muted-foreground text-center"
					>
						{dayString}
					</div>
				))}
				{dates.map((weekDates, weekIndex) => (
					<Fragment key={`${dateView.getMonth()}-weekday-${weekIndex}`}>
						{weekDates.map((date, index) => (
							<MonthCalendarButton
								key={`${dateView.getMonth()}-day-${index}`}
								date={date}
								selected={selected}
								onDateClick={onDateClick}
							/>
						))}
					</Fragment>
				))}
			</div>
			<TimeCalendar selected={selected} onTimeClick={onTimeClick} />
		</div>
	);
};

export default MonthCalendar;

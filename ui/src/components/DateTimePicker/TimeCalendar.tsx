import { useCallback, useMemo } from "react";

type HourButtonProps = {
	selected?: Date;
	hour: number;
	onHourClick?: (hour: number) => void;
};

const HourButton = ({ selected, hour, onHourClick }: HourButtonProps) => {
	const isSelected = useMemo(
		() => selected?.getHours() === hour,
		[selected, hour],
	);

	return (
		<button
			type="button"
			aria-selected={isSelected}
			onClick={() => onHourClick?.(hour)}
			className={`size-10 min-w-10 rounded-md w-full outline-none
        focus:bg-primary focus:text-primary-foreground
        hover:bg-primary hover:text-primary-foreground
        aria-[selected=true]:bg-primary aria-[selected=true]:text-primary-foreground
      `}
		>
			{`${hour}`.padStart(2, "0")}
		</button>
	);
};

type MinuteButtonProps = {
	selected?: Date;
	minute: number;
	onMinuteClick?: (minute: number) => void;
};

const MinuteButton = ({
	selected,
	minute,
	onMinuteClick,
}: MinuteButtonProps) => {
	const isSelected = useMemo(
		() => selected?.getMinutes() === minute,
		[selected, minute],
	);

	return (
		<button
			type="button"
			aria-selected={isSelected}
			onClick={() => onMinuteClick?.(minute)}
			className={`size-10 min-w-10 rounded-md w-full outline-none
        focus:bg-primary focus:text-primary-foreground
        hover:bg-primary hover:text-primary-foreground
        aria-[selected=true]:bg-primary aria-[selected=true]:text-primary-foreground
      `}
		>
			{`${minute}`.padStart(2, "0")}
		</button>
	);
};

type TimeCalendarProps = {
	selected?: Date;
	onTimeClick: (hours: number, minutes: number) => void;
};
const TimeCalendar = ({ selected, onTimeClick }: TimeCalendarProps) => {
	const options = useMemo(
		() => ({
			hours: Array.from({ length: 24 }, (_, index) => index),
			minutes: [0, 30],
		}),
		[],
	);

	const handleHourClick = useCallback(
		(hour: number) => {
			onTimeClick(hour, selected?.getMinutes() ?? 0);
		},
		[onTimeClick, selected],
	);

	const handleMinuteClick = useCallback(
		(minute: number) => {
			onTimeClick(selected?.getHours() ?? 0, minute);
		},
		[onTimeClick, selected],
	);

	return (
		<div className="w-96 max-w-screen overflow-hidden">
			<div className="grid mt-2">
				<div className="flex flex-col gap-2 overflow-x-auto border-t">
					<div className="px-2 text-muted-foreground">Heures</div>
					<div className="flex flex-row overflow-x-auto">
						{options.hours.map((hour) => (
							<HourButton
								hour={hour}
								selected={selected}
								key={`hour-${hour}`}
								onHourClick={handleHourClick}
							/>
						))}
					</div>
				</div>
				<div className="flex flex-col gap-2 overflow-x-auto border-t">
					<div className="text-muted-foreground">Minutes</div>
					<div className="flex flex-row overflow-x-auto">
						{options.minutes.map((minute) => (
							<MinuteButton
								minute={minute}
								selected={selected}
								key={`minute-${minute}`}
								onMinuteClick={handleMinuteClick}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TimeCalendar;

import React, { useEffect, useRef, useState } from "react";
import { DateRange, Range } from "react-date-range";
import { format, subDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

const QuickDateRanges = [
	{ label: "Last 1 day", days: 1 },
	{ label: "Last 30 days", days: 30 },
	{ label: "Last 90 days", days: 90 },
	{ label: "Last 1 year", days: 365 },
	{ label: "Last 2 years", days: 730 },
	{ label: "Last 3 years", days: 1095 },
	{ label: "Last 5 years", days: 1825 },
];

interface DateRangePickerProps {
	dateRangeProp: Range;
	setDateRangeProp: React.Dispatch<React.SetStateAction<Range>>;
	classNameProp?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRangeProp, setDateRangeProp, classNameProp }) => {
	const [visible, setVisible] = useState(false);
	const [selectedLabel, setSelectedLabel] = useState("Custom");
	const pickerRef = useRef<HTMLDivElement>(null);

	const [localDateRange, setLocalDateRange] = useState<Range>({
		startDate: subDays(new Date(), 1),
		endDate: new Date(),
		key: "selection",
	});

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
				setVisible(false);
			}
		};
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

	const handleQuickSelect = (days: number, label: string) => {
		const endDate = new Date();
		const startDate = subDays(endDate, days);

		setDateRangeProp({ startDate, endDate, key: "selection" });
		setLocalDateRange({ startDate, endDate, key: "selection" });

		setSelectedLabel(label);
	};

	const handleUpdate = () => {
		setDateRangeProp({
			startDate: localDateRange.startDate,
			endDate: localDateRange.endDate,
			key: "selection",
		});

		setSelectedLabel("Custom");
		setVisible(false);
	};

	return (
		<div className="relative flex justify-end" ref={pickerRef}>
			<button
				className="rounded bg-white px-3 py-2 text-sm shadow-[0px_0.5px_2.5px_0px_rgba(0,0,0,0.3),0px_0px_0px_0.5px_rgba(0,0,0,0.05)] w-full text-left"
				onClick={() => setVisible((prev) => !prev)}
			>
				{format(dateRangeProp.startDate!, "dd/MM/yyyy")} - {format(dateRangeProp.endDate!, "dd/MM/yyyy")}
			</button>

			{visible && (
				<div className={`absolute top-10 z-50 flex rounded-lg bg-white w-[860px] p-5 shadow-xl border-2 ${classNameProp}`}>
					<div className="border-r pr-4">
						{QuickDateRanges.map(({ label, days }) => (
							<button
								key={label}
								onClick={() => handleQuickSelect(days, label)}
								className={`mb-2 block w-full rounded px-2 py-1 text-left ${
									selectedLabel === label ? "bg-gray-200" : "hover:bg-gray-100"
								}`}
							>
								{label}
							</button>
						))}
					</div>

					<div className="flex flex-col pl-4">
						<DateRange
							editableDateInputs
							ranges={[localDateRange]}
							onChange={(item) => setLocalDateRange(item.selection)}
							moveRangeOnFirstSelection={false}
							months={2}
							direction="horizontal"
						/>

						<div className="mt-4 flex justify-end gap-3">
							<button className="text-gray-500 hover:underline" onClick={() => setVisible(false)}>
								Cancel
							</button>
							<button className="rounded bg-blue-500 px-4 py-1 text-white hover:bg-blue-600" onClick={handleUpdate}>
								Update
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default DateRangePicker;

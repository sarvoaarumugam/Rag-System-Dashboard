import { ChevronDown, ChevronUp } from "lucide-react";
import { SetStateAction, useEffect, useRef, useState } from "react";

interface MultipleDropDownProps {
	optionsProp: string[];
	selectedOptionsProp: string[];
	setSelectedOptionsProp: React.Dispatch<SetStateAction<string[]>>;
}

const MultipleDropDown: React.FC<MultipleDropDownProps> = ({ optionsProp, selectedOptionsProp, setSelectedOptionsProp }) => {
	const [dropdownVisibility, setDropdownVisibility] = useState<boolean>(false);
	const [tempOptions, setTempOptions] = useState<string[]>(selectedOptionsProp);

	const containerRef = useRef<HTMLDivElement>(null);

	const handleOptionClicked = (option: string) => {
		console.log(option);
		setTempOptions((prev) => (prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]));
	};

	const selectedRef = useRef<string[]>(selectedOptionsProp);
	const tempRef = useRef<string[]>(tempOptions);

	useEffect(() => {
		selectedRef.current = selectedOptionsProp;
	}, [selectedOptionsProp]);
	useEffect(() => {
		tempRef.current = tempOptions;
	}, [tempOptions]);

	const areArraysEqual = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));
	const handleOutsideClick = (e: MouseEvent) => {
		if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
			if (!areArraysEqual(selectedRef.current, tempRef.current)) {
				setSelectedOptionsProp(tempRef.current);
			}
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, []);

	useEffect(() => {
		if (!areArraysEqual(selectedRef.current, tempRef.current)) {
			setSelectedOptionsProp(tempRef.current);
		}
	}, [dropdownVisibility]);

	return (
		<div
			className="w-fit p-2 rounded-xl border-2 shadow relative"
			ref={containerRef}
			onClick={() => setDropdownVisibility((prev) => !prev)}
		>
			<div className="flex hover:cursor-pointer">
				{selectedOptionsProp.map((selectedOption, index) => (
					<>
						<span key={index}>{selectedOption}</span>
						{index !== selectedOptionsProp.length - 1 && <span>,</span>}
					</>
				))}
				<div className="ml-2">{dropdownVisibility ? <ChevronUp /> : <ChevronDown />}</div>
			</div>
			{dropdownVisibility && (
				<div className="absolute translate-y-1 right-0 bg-white p-1 rounded-md shadow border">
					{optionsProp.map((option, index) => (
						<>
							<button
								key={index}
								className={` w-full px-5 py-1 rounded-md ${
									tempOptions.includes(option) ? "bg-blue-200 text-blue-500 hover:bg-blue-100" : "hover:bg-black/5"
								}`}
								onClick={(e) => {
									e.stopPropagation();
									handleOptionClicked(option);
								}}
							>
								{option}
							</button>
							{index !== optionsProp.length - 1 && <hr className="my-1" />}
						</>
					))}
				</div>
			)}
		</div>
	);
};

export default MultipleDropDown;

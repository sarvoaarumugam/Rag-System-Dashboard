import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

interface SuggestionsDropdownProps {
	isLoadingProp: boolean;
	titleProp: string;
	children?: React.ReactNode;
	lengthProp?: number;
}

const SuggestionsDropdown: React.FC<SuggestionsDropdownProps> = ({ isLoadingProp, titleProp, children, lengthProp }) => {
	const [expanded, setExpanded] = useState<boolean>(true);

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex justify-between items-center">
					<button className="flex gap-2 items-center" onClick={() => setExpanded((prev) => !prev)}>
						{expanded ? <ChevronUp /> : <ChevronDown />}
						<div className="font-semibold">{titleProp}</div>
						{lengthProp && (
							<div className="bg-blue-100 rounded-full p-1 aspect-square w-auto h-5 items-center justify-center flex text-blue-500 text-sm ">
								{lengthProp}
							</div>
						)}
					</button>
				</div>
				{expanded && (
					<>
						<div className="border"></div>
						<div className="w-full flex flex-col gap-2">
							{!isLoadingProp && children}
							{/* Loading Skeleton */}
							{isLoadingProp &&
								Array.from({ length: 8 }).map((_, index) => (
									<div key={index} className="animate-pulse w-full h-[175px] border rounded-lg bg-gray-50 overflow-clip">
										<div className="h-10 bg-gray-200 animate-pulse"></div>
									</div>
								))}
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default SuggestionsDropdown;

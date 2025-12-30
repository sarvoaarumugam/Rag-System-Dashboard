import React from "react";

interface InputContainerProps {
	labelProp: string;
	children: React.ReactNode;
}

const InputContainer: React.FC<InputContainerProps> = ({ children, labelProp }) => {
	return (
		<div className="flex flex-col gap-2 w-full">
			<div className="font-semibold">{labelProp}</div>
			{children}
		</div>
	);
};

export default InputContainer;

interface TitleHeadingProps {
	titleProp: string;
	textStylingProp?: string;
}

const TitleHeading: React.FC<TitleHeadingProps> = ({ titleProp, textStylingProp }) => {
	return (
		<div className="flex items-center justify-between gap-6">
			<div className="w-full border"></div>
			<div className={`whitespace-nowrap font-semibold text-gray-400 ${textStylingProp !== null && textStylingProp}`}>
				{titleProp}
			</div>
			<div className="w-full border"></div>
		</div>
	);
};

export default TitleHeading;

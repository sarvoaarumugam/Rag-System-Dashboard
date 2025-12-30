import { LoaderCircle } from "lucide-react";

interface MetricContainerProps {
	children: React.ReactNode;
	titleProp: string;
	loadingStatusProp?: boolean;
	classNameProp?: string;
}

const MetricContainer: React.FC<MetricContainerProps> = ({ children, titleProp, classNameProp, loadingStatusProp }) => {
	return (
		<div className={`h-full border rounded-2xl p-5 ${classNameProp}`}>
			{loadingStatusProp ? (
				<div className="flex flex-col w-full h-full items-center justify-center gap-2">
					<LoaderCircle className="animate-spin text-black/25" />
					<div className="text-black/20 text-2xl">Loading</div>
				</div>
			) : (
				<div className="flex flex-col h-full gap-6 items-center justify-center">
					<div className="text-2xl text-center font-semibold text-black/50">{titleProp}</div>
					{children}
				</div>
			)}
		</div>
	);
};

export default MetricContainer;

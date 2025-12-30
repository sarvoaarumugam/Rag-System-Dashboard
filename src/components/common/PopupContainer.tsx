import { ChevronLeft, X } from "lucide-react";

interface PopupContainerProps {
	handleVisibilityProp: () => void;
	titleProp: string;
	children: React.ReactNode;
	handleSubmitProp?: () => void;
	submitDisabledProp?: boolean;
	isChildProp?: boolean;
}

const PopupContainer: React.FC<PopupContainerProps> = ({
	handleVisibilityProp,
	titleProp,
	children,
	handleSubmitProp,
	submitDisabledProp,
	isChildProp,
}) => {
	return (
		<div className="inset-0 fixed z-50 flex items-center justify-center bg-black/20 shadow-[inset_0px_4px_80px_0px_rgba(157,44,255,1),inset_0px_-3px_210px_rgba(44,83,255,1)]">
			<div className="bg-[#F6F6F6] rounded-2xl border border-[#BABABA] shadow-[0px_4px_45px_0px_rgba(0,0,0,0.25)] p-6 relative min-w-[460px]">
				{/* Close Button */}
				{!isChildProp && (
					<button
						onClick={handleVisibilityProp}
						className="absolute -top-4 -right-12 rounded-full bg-black/60 cursor-pointer text-white p-1 hover:opacity-50"
					>
						<X />
					</button>
				)}
				{/* Body */}
				<div className="flex flex-col gap-6">
					<div className="flex items-center justify-between">
						{isChildProp && (
							<button
								className="bg-blue-200 text-blue-500 flex items-center justify-center rounded-full w-8 h-8"
								onClick={handleVisibilityProp}
							>
								<ChevronLeft />
							</button>
						)}
						<div className="text-xl font-semibold text-center w-full">{titleProp}</div>
						{isChildProp && <div className="w-8 h-8"></div>}
					</div>
					{/* Children */}
					<div className="flex flex-col gap-6 h-[420px] overflow-y-scroll">{children}</div>
					{/* Submit Button */}
					{handleSubmitProp && (
						<button
							className="hover:opacity-50 font-semibold flex items-center gap-2 justify-center text-white bg-blue-500 rounded-2xl py-2 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
							onClick={handleSubmitProp}
							disabled={submitDisabledProp}
						>
							Submit
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default PopupContainer;

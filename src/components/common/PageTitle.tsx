import BackButton from "./BackButton";

interface PageTitleProps {
	backButtonLinkProp: string;
	titleProp: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ backButtonLinkProp, titleProp }) => {
	return (
		<>
			<div className="w-full flex items-center justify-between max-w-[1440px] mx-auto p-4 pt-6">
				<BackButton backPageLinkProp={backButtonLinkProp} />
				<div className="text-2xl font-semibold text-black/50">{titleProp}</div>
				<div className="w-[80px]"></div>
			</div>
			<hr className="max-w-[1440px] mx-auto" />
		</>
	);
};

export default PageTitle;

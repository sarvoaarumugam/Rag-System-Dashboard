import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
	backPageLinkProp: string;
}

const BackButton: React.FC<BackButtonProps> = ({ backPageLinkProp }) => {
	const navigate = useNavigate();

	return (
		<button
			onClick={() => navigate(backPageLinkProp)}
			className="bg-blue-100 px-2 py-1 font-normal text-[16px] rounded-xl border border-blue-300 text-blue-500 flex items-center gap-2 hover:opacity-50"
		>
			<ChevronLeft size={16} />
			Back
		</button>
	);
};

export default BackButton;

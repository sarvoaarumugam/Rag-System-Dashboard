import React from "react";

interface TablePageSectionProps {
	totalProfilesProp: number;
	onPageChangeProp: (pageNumber: number) => void;
	activePageProp: number;
}

const TablePageSection: React.FC<TablePageSectionProps> = ({ totalProfilesProp, onPageChangeProp, activePageProp }) => {
	const totalPages = Math.ceil(totalProfilesProp / 10);
	const currentPage = activePageProp;

	const pagesToShow = [];

	// Previous page
	if (currentPage > 1) pagesToShow.push(currentPage - 1);
	// Current page
	pagesToShow.push(currentPage);
	// Next page
	if (currentPage < totalPages) pagesToShow.push(currentPage + 1);

	const isFirst = currentPage === 1;
	const isLast = currentPage === totalPages;

	return (
		<div className="mt-4 flex w-full justify-end">
			<div className="flex items-center gap-2 text-sm">
				{/* First Page */}
				{!isFirst && activePageProp > 2 && (
					<>
						<button
							onClick={() => onPageChangeProp(1)}
							disabled={isFirst}
							className="h-8 w-8 cursor-pointer rounded border border-gray-300 text-sm text-gray-600"
						>
							1
						</button>
						<>...</>
					</>
				)}

				{/* Page Numbers */}
				{pagesToShow.map((pageNum) => (
					<button
						key={pageNum}
						onClick={() => onPageChangeProp(pageNum)}
						className={`h-8 w-8 cursor-pointer rounded border text-sm ${
							pageNum === currentPage ? "border-blue-500 font-semibold text-blue-500" : "border-gray-300 text-gray-600"
						}`}
					>
						{pageNum}
					</button>
				))}

				{/* Last Page */}
				{!isLast && activePageProp < totalPages - 1 && (
					<>
						<>...</>
						<button
							onClick={() => onPageChangeProp(totalPages)}
							disabled={isLast}
							className="h-8 w-8 cursor-pointer rounded border border-gray-300 text-sm text-gray-600"
						>
							{totalPages}
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default TablePageSection;

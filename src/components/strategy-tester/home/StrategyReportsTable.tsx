import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { BacktestReportDataType } from "../../../types/StrategyReport";
import { useNavigate } from "react-router-dom";

const columnHelper = createColumnHelper<BacktestReportDataType>();

const columns: ColumnDef<BacktestReportDataType, any>[] = [
	columnHelper.accessor("file_name", {
		header: "Report",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("symbol", {
		header: "Symbol",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("timeframe", {
		header: "Timeframe",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("impulse_percentage", {
		header: "Impulse Percentage",
		cell: (info) => String(info.getValue()),
	}),
	columnHelper.accessor("impulse_window", {
		header: "Impulse Window",
		cell: (info) => info.getValue(),
	}),
];

interface StrategyReportsTableProps {
	data: BacktestReportDataType[];
}

const StrategyReportsTable: React.FC<StrategyReportsTableProps> = ({ data }) => {
	const navigate = useNavigate();

	// Supply the generic so options aren’t <unknown>
	const table = useReactTable<BacktestReportDataType>({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="overflow-x-auto">
			<table className="min-w-full text-sm text-center">
				<thead>
					{table.getHeaderGroups().map((hg) => (
						<tr key={hg.id}>
							{hg.headers.map((header) => (
								<th key={header.id} className="px-3 py-2 bg-blue-100 text-blue-600/75 border-blue-300 border font-semibold">
									{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => {
						const file_id = (row.original as any).key ?? (row.original as any).file_id;

						return (
							<tr
								key={row.id}
								onClick={() => navigate(`/strategy-tester/report/${file_id}`)}
								className="hover:bg-blue-100/50 hover:text-black text-black/60 bg-blue-100/20 cursor-pointer"
							>
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="px-3 py-1.5 border border-black/25">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default StrategyReportsTable;

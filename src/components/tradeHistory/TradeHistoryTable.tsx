import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { TradeHistoryType } from "../../types/TradeHistoryType";

const columnHelper = createColumnHelper<TradeHistoryType>();

const columns: ColumnDef<TradeHistoryType, any>[] = [
	columnHelper.accessor("symbol", {
		header: "Symbol",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("timeframe", {
		header: "Timeframe",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("entry_time", {
		header: "Entry Time",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("ob_timestamp", {
		header: "OB Timestamp",
		cell: (info) => String(info.getValue()),
	}),
	columnHelper.accessor("impulse_threshold", {
		header: "Impulse Threshold",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("impulse_window", {
		header: "Impulse Window",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("result", {
		header: "Result",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor(
		(row) => ((row.exit_capital - row.initial_capital) / row.initial_capital) * 100, // accessor function
		{
			id: "plPercent", // must give an ID if not using a property name
			header: "P / L (in % )",
			cell: (info) => {
				const value = info.getValue();
				return `${value.toFixed(2)}%`; // format to 2 decimal places
			},
		}
	),
];

interface TradeHistoryTableProps {
	data: TradeHistoryType[];
}

const TradeHistoryTable: React.FC<TradeHistoryTableProps> = ({ data }) => {
	// Supply the generic so options aren’t <unknown>
	const table = useReactTable<TradeHistoryType>({
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
								<th key={header.id} className="px-3 py-2 bg-black/10 text-black/80 border-black/50 border font-semibold">
									{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => {
						// Find the 'result' cell in the row
						const resultCell = row.getVisibleCells().find((cell) => cell.column.id === "result");
						const isProfitable = resultCell?.getValue() === "profitable";

						return (
							<tr key={row.id} className={`border-t ${isProfitable ? "bg-green-100" : "bg-red-200"}`}>
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

export default TradeHistoryTable;

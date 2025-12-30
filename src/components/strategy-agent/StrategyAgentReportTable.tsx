import React from "react";
import {
	ColumnDef,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from "@tanstack/react-table";

import { AgentStrategyReportType, AgentStrategyType } from "../../types/strategyAgent/StrategyAgentType";
import DownloadCsvButton from "../common/DownloadCsvButton";
import CsvAnalysisButton from "../ai/fileAnalysis/CsvAnalysisButton";

const columnHelper = createColumnHelper<AgentStrategyType>();

// helper: numeric sorting (protects against stringified numbers)
const numericSort: import("@tanstack/react-table").SortingFn<any> = (rowA, rowB, colId) => {
	const a = Number(rowA.getValue(colId));
	const b = Number(rowB.getValue(colId));
	if (Number.isNaN(a) && Number.isNaN(b)) return 0;
	if (Number.isNaN(a)) return 1;
	if (Number.isNaN(b)) return -1;
	return a === b ? 0 : a > b ? 1 : -1;
};

const columns: ColumnDef<AgentStrategyType, any>[] = [
	columnHelper.accessor("net_pnl_pct", {
		header: "Net PnL ( in % )",
		cell: (info) => info.getValue(),
		sortingFn: numericSort,
	}),
	columnHelper.accessor("net_pnl", {
		header: "Net PnL",
		cell: (info) => info.getValue(),
		sortingFn: numericSort,
	}),
	columnHelper.accessor("win_rate", {
		header: "Win rate ( in % )",
		cell: (info) => info.getValue(),
		sortingFn: numericSort,
	}),
	columnHelper.accessor("impulse_window", {
		header: "Impulse Window",
		cell: (info) => info.getValue(),
		sortingFn: numericSort,
	}),
	columnHelper.accessor("impulse_percentage", {
		header: "Impulse Percentage",
		cell: (info) => info.getValue(),
		sortingFn: numericSort,
	}),
	columnHelper.accessor("take_profit", {
		header: "TP ( in % )",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value * 100 : value;
		},
		sortingFn: numericSort, // sorts by the underlying value (not the formatted *100)
	}),
	columnHelper.accessor("stop_loss", {
		header: "SL ( in % )",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value * 100 : value;
		},
		sortingFn: numericSort,
	}),
	columnHelper.accessor("total_obs", {
		header: "Total OBs",
		cell: (info) => info.getValue(),
		sortingFn: numericSort,
	}),
	columnHelper.accessor("profit_obs", {
		header: "Profitable OBs",
		cell: (info) => info.getValue(),
		sortingFn: numericSort,
	}),
	columnHelper.accessor("loss_obs", {
		header: "Loss OBs",
		cell: (info) => info.getValue(),
		sortingFn: numericSort,
	}),
	columnHelper.accessor("total_invested", {
		header: "Total Investment",
		cell: (info) => info.getValue(),
		sortingFn: numericSort,
	}),
	columnHelper.accessor("total_result", {
		header: "Total Result",
		cell: (info) => info.getValue(),
		sortingFn: numericSort,
	}),
	columnHelper.accessor("ending_wallet", {
		header: "Final Wallet Balance",
		cell: (info) => info.getValue(),
		sortingFn: numericSort,
	}),
	columnHelper.accessor("avg_trade_duration", {
		header: "Avg Trade Duration",
		cell: (info) => info.getValue(),
		sortingFn: numericSort,
	}),
	columnHelper.accessor("max_drawdown", {
		header: "Max Drawdown",
		cell: (info) => info.getValue(),
		sortingFn: numericSort,
	}),
	columnHelper.accessor("sharpe_ratio", {
		header: "Sharpe ratio",
		cell: (info) => info.getValue(),
		sortingFn: numericSort,
	}),
];

interface StrategyTradesTableProps {
	dataProp: AgentStrategyReportType;
}

const StrategyAgentReportTable: React.FC<StrategyTradesTableProps> = ({ dataProp }) => {
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const data = dataProp.all_results;

	const table = useReactTable<AgentStrategyType>({
		data,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<div className="flex flex-col gap-4">
			<div className="flex w-full justify-end gap-2">
				<CsvAnalysisButton dataProp={dataProp} tableProp={table} typeProp="report_automation" />
				<DownloadCsvButton tableProp={table} />
			</div>
			<div className="overflow-x-auto w-full">
				<table className="text-sm text-center">
					<thead>
						{table.getHeaderGroups().map((hg) => (
							<tr key={hg.id}>
								{hg.headers.map((header) => {
									const sorted = header.column.getIsSorted(); // false | 'asc' | 'desc'
									return (
										<th
											key={header.id}
											onClick={header.column.getToggleSortingHandler()}
											className="px-3 py-2 bg-black/10 text-black/80 border-black/50 border font-semibold whitespace-nowrap select-none cursor-pointer"
											title={sorted ? `Sorted ${sorted}` : "Click to sort"}
										>
											<div className="flex items-center gap-1 justify-center">
												{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
												<span className="text-xs opacity-70">{sorted === "asc" ? "▲" : sorted === "desc" ? "▼" : "⇅"}</span>
											</div>
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id} className="border-t hover:cursor-pointer hover:shadow-xl bg-gray-50 hover:bg-gray-200/60">
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="px-3 py-1.5 border border-black/25">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default StrategyAgentReportTable;

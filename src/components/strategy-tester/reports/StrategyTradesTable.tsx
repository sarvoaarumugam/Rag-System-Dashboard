import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ReportTableItemType } from "../../../types/StrategyReport";
import ReportOBChartContainer from "./ReportOBChartContainer";
import React, { useEffect, useState } from "react";
import DownloadCsvButton from "../../common/DownloadCsvButton";
import CsvAnalysisButton from "../../ai/fileAnalysis/CsvAnalysisButton";



const columnHelper = createColumnHelper<ReportTableItemType>();

const columns: ColumnDef<ReportTableItemType, any>[] = [

 
	columnHelper.accessor("ob_timestamp", {
		header: "OB Timestamp",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("zone_low", {
		header: "Zone Low",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("zone_high", {
		header: "Zone High",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("entry_time", {
		header: "Entry Timestamp",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("exit_time", {
		header: "Exit Timestamp",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("outcome", {
		header: "Outcome",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("ob_type", {
		header: "OB Type",
		cell: (info) => info.getValue(),
	}),

	columnHelper.accessor("entry", {
		header: "Entry Price",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	}),
	columnHelper.accessor("exit", {
		header: "Exit Price",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	}),
	columnHelper.accessor("impulse_percentage", {
		header: "Impulse Percentage",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	}),
	columnHelper.accessor("mitigation_prct", {
		header: "Mitigation ( in % )",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	}),
	columnHelper.accessor("volume_spike", {
		header: "Volume Spike",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("bos_detected", {
		header: "BoS Detected",
		cell: (info) => (info.getValue() ? "Yes" : "No"),
	}),
	columnHelper.accessor("displacement_strength", {
		header: "Displacement Strength",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	}),
	columnHelper.accessor("orderblock_wick_ratio", {
		header: "OB Wick Ratio",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	}),
	columnHelper.accessor("trend_direction_swings", {
		header: "Trend",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("invested", {
		header: "Invested",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	}),
	columnHelper.accessor("result", {
		header: "Result",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	}),
	columnHelper.accessor("wallet_after", {
		header: "Wallet Balance",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	}),
	columnHelper.accessor("position_size", {
		header: "Postion Size",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	}),

	columnHelper.accessor("hours_held", {
		header: "Hours Held",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	}),
	columnHelper.accessor("base_pnl", {
		header: "Base P / L",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	}),
	columnHelper.accessor("trading_fees", {
		header: "Trading Fee",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	}),
	columnHelper.accessor("funding_fees", {
		header: "Funding Fee",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	}),
	columnHelper.accessor("total_fees", {
		header: "Total Fee",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	}),
	columnHelper.accessor("net_pnl", {
		header: "Net P / L",
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number" ? value.toFixed(2) : value;
		},
	}),
];

interface StrategyTradesTableProps {
	data: ReportTableItemType[];
	timeframeProp?: string;
	configProp: {
		symbol: string;
		timeframe: string;
		start_date: string;
		end_date: string;
		ob_type: string;
		impulse_window: string;
		impulse_percentage: string;
		take_profit: string;
		stop_loss: string;
	};
}

const StrategyTradesTable: React.FC<StrategyTradesTableProps> = ({ data, configProp, timeframeProp }) => {
const table = useReactTable<ReportTableItemType>({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const [selectedOB, setSelectedOB] = useState<ReportTableItemType | null>(null);

	const [chartPopupVisibility, setChartPopupVisibility] = useState<boolean>(false);

	useEffect(() => {
		setChartPopupVisibility(true);
	}, [selectedOB]);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex w-full justify-end gap-2">
				<CsvAnalysisButton typeProp="trade_data" dataProp={configProp} tableProp={table} />
				<DownloadCsvButton tableProp={table} />
			</div>
			<div className="overflow-x-auto w-full">
				<table className="text-sm text-center">
					<thead>
						{table.getHeaderGroups().map((hg) => (
							<tr key={hg.id}>
								{hg.headers.map((header) => (
									<th
										key={header.id}
										className="px-3 py-2 bg-black/10 text-black/80 border-black/50 border font-semibold whitespace-nowrap"
									>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => {
							// Find the 'result' cell in the row
							const resultCell = row.getVisibleCells().find((cell) => cell.column.id === "outcome");
							const isProfitable = resultCell?.getValue() === "profit";

							return (
								<React.Fragment key={row.id}>
									<tr
									onClick={() => { 
										console.log("row clicked", row.original?.ob_timestamp);
										setSelectedOB(row.original);
										setChartPopupVisibility(true);
									 }}
									className={`border-t hover:cursor-pointer hover:shadow-xl ${isProfitable ? "bg-green-100 hover:bg-green-200" : "bg-red-200 hover:bg-red-300"}`}
									>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="px-3 py-1.5 border border-black/25">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									))}
									</tr>

									
								</React.Fragment>
								);
						})}
					</tbody>
				</table>
			</div>
			{chartPopupVisibility && selectedOB !== null && configProp && (
				<ReportOBChartContainer
					symbolProp={configProp.symbol}
					timeframeProp={timeframeProp ?? configProp.timeframe}
					reportDataProp={{
						ob_timestamp: selectedOB.ob_timestamp,
						zone_high: selectedOB.zone_high,
						zone_low: selectedOB.zone_low,
						ob_type: selectedOB.ob_type,
						entry_price: selectedOB.entry,
						entry_timestamp: selectedOB.entry_time,
						exit_timestamp: selectedOB.exit_time,
						exit_price: selectedOB.exit,
						exits_info: selectedOB.exits_info ?? [],
					}}
					setPopupVisibilityProp={setChartPopupVisibility}
				/>
			)}
			<div className="fixed bottom-2 left-2 text-xs bg-white p-2 border">
        debug: {String(chartPopupVisibility)}{" "}
        {selectedOB ? selectedOB.ob_timestamp : "no-selected"}{" "}
        timeframe:{String(timeframeProp)}
      </div>
		</div>
	);
};

export default StrategyTradesTable;

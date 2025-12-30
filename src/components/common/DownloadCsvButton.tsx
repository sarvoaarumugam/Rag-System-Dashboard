import { Table } from "@tanstack/react-table";
import { downloadCSV, toCSVValue } from "../../utils/CsvUtilities";
import { Download } from "lucide-react";

interface DownloadCsvButtonProps {
	tableProp: Table<any>;
}

const DownloadCsvButton: React.FC<DownloadCsvButtonProps> = ({ tableProp }) => {
	const handleExportCSV = () => {
		// use leaf columns, not header groups, and avoid flexRender for CSV
		const leafCols = tableProp.getAllLeafColumns();

		// headers: prefer string header, else use column id
		const headers = leafCols.map((c) => (typeof c.columnDef.header === "string" ? c.columnDef.header : c.id)).map(toCSVValue);

		// rows: use row.getValue(col.id) to get the accessor value (not the cell renderer)
		const dataRows = tableProp.getRowModel().rows.map((row) =>
			leafCols.map((c) => {
				let v = row.getValue<any>(c.id);

				// if you want to mimic your UI percentage formatting, adjust here
				if ((c.id === "take_profit" || c.id === "stop_loss") && typeof v === "number") {
					v = v * 100;
				}

				return toCSVValue(v);
			})
		);

		downloadCSV("strategy-report.csv", [headers, ...dataRows]);
	};

	return (
		<button
			onClick={handleExportCSV}
			className="flex text-sm bg-blue-50 gap-2 border-blue-400 border text-blue-500 p-2 w-fit rounded-2xl items-center"
		>
			<Download size={20} />
			Download CSV
		</button>
	);
};

export default DownloadCsvButton;

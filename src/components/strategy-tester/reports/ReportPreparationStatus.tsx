import { useEffect, useState } from "react";
import { useWebSocketEvent } from "../../../hooks/UseWebSocketEvent";

const ReportPreparationStatus = () => {
	const statusUpdate = useWebSocketEvent("backtest_orderblock_status");

	const [reportStatus, setReportStatus] = useState<{ status: string; message: string }>({ status: "", message: "" });

	useEffect(() => {
		if (statusUpdate != null) {
			setReportStatus({ status: statusUpdate?.status, message: statusUpdate?.message });
		}
	}, [statusUpdate]);

	return (
		<div className="flex flex-col items-center justify-center">
			<div>{reportStatus.message}</div>
		</div>
	);
};

export default ReportPreparationStatus;

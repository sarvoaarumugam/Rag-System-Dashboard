export function toCSVValue(v: unknown): string {
	if (v === null || v === undefined) return "";
	// primitives
	if (typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "bigint") {
		const s = String(v);
		const needsQuotes = /[",\n]/.test(s);
		const escaped = s.replace(/"/g, '""');
		return needsQuotes ? `"${escaped}"` : escaped;
	}
	// fallback (ReactNode, arrays, etc.)
	const s = (v as any)?.toString?.() ?? "";
	const needsQuotes = /[",\n]/.test(s);
	const escaped = s.replace(/"/g, '""');
	return needsQuotes ? `"${escaped}"` : escaped;
}

export function downloadCSV(filename: string, rows: string[][]) {
	const csv = rows.map((r) => r.join(",")).join("\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

export function buildCSVString(rows: string[][]): string {
	return rows.map((r) => r.join(",")).join("\n");
}

export function buildCSVBlob(rows: string[][]): Blob {
	const csv = buildCSVString(rows);
	return new Blob([csv], { type: "text/csv;charset=utf-8;" });
}

export function buildCSVFile(filename: string, rows: string[][]): File {
	const csv = buildCSVString(rows);
	return new File([csv], filename, { type: "text/csv;charset=utf-8;" });
}

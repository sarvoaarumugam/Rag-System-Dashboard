export function fileToDataURL(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string); // "data:*/*;base64,...."
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(file);
	});
}

export async function fileToBase64(file: File): Promise<string> {
	const dataUrl = await fileToDataURL(file);
	const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
	if (!match) {
		throw new Error("Invalid data URL format");
	}
	const [, , base64] = match;
	return base64;
}

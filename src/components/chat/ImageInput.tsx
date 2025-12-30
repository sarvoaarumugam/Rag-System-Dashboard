import { LoaderCircle, Paperclip, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useChatInputContext } from "../../context/ChatInputContext";
import { useWebSocketContext } from "../../context/WebSocketContext";
import { fileToBase64 } from "../../utils/FileToBase64";
import { useWebSocketEvent } from "../../hooks/UseWebSocketEvent";
import { useChatMessagesContext } from "../../context/ChatMessagesContext";

interface ImageInputProps {
	imagePositionProp?: "top" | "bottom";
}

const ImageInput: React.FC<ImageInputProps> = ({ imagePositionProp }) => {
	const { imageUrl, setImageUrl, setFileUrl, fileUrl } = useChatInputContext();
	const { initialMessage } = useChatMessagesContext();
	const [file, setFile] = useState<File | null>(null);
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);
	const objectUrlRef = useRef<string | null>(null);

	const { client } = useWebSocketContext();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const uploadConfirmation = useWebSocketEvent("upload_image");
	const deleteConfirmation = useWebSocketEvent("delete_image");

	useEffect(() => {
		if (!initialMessage?.file) return;

		const f = initialMessage.file as File;

		if (f) {
			if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);

			const url = URL.createObjectURL(f);
			objectUrlRef.current = url;

			setFile(f);
			setPreviewSrc(url);
			handleUpload(f);
		}

		// cleanup when initialMessage changes/unmounts
		return () => {
			if (objectUrlRef.current) {
				URL.revokeObjectURL(objectUrlRef.current);
				objectUrlRef.current = null;
			}
		};
	}, [initialMessage]);

	//#region Upload
	useEffect(() => {
		if (uploadConfirmation && uploadConfirmation?.status === "success") {
			if (uploadConfirmation?.image_url) {
				setIsLoading(false);
				setImageUrl(uploadConfirmation?.image_url);
			} else if (uploadConfirmation?.file_url) {
				setIsLoading(false);
				setFileUrl(uploadConfirmation?.file_url);
			}
		}
	}, [uploadConfirmation]);

	const handleUpload = async (file: File) => {
		if (!client?.isConnected()) return;

		const base64 = await fileToBase64(file);

		client.send({ type: "upload_image", data: { image_data: base64 } });
		setIsLoading(true);
	};
	//#endregion

	//#region Delete
	useEffect(() => {
		if (deleteConfirmation && deleteConfirmation?.status === "success") {
			setIsLoading(false);

			setPreviewSrc(null);
			setFile(null);
		}
	}, [deleteConfirmation]);

	const handleDelete = async () => {
		if (!client?.isConnected()) return;

		client.send({ type: "delete_image", data: { image_url: imageUrl ? imageUrl : fileUrl } });
		setIsLoading(true);
	};
	//#endregion

	const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.currentTarget; // safer than e.target
		const f = input.files?.[0] ?? null;
		setFile(f);

		if (f) {
			// cleanup previous URL
			if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
			const url = URL.createObjectURL(f);
			objectUrlRef.current = url;
			setPreviewSrc(url);
			handleUpload(f);
		} else {
			setPreviewSrc(null);
		}

		// reseting the input so selecting the same file triggers onChange next time
		input.value = "";
	};

	useEffect(() => {
		return () => {
			// cleanup on unmount
			if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
		};
	}, []);

	useEffect(() => {
		if (!imageUrl && previewSrc && !initialMessage?.file) {
			setPreviewSrc(null);
			setFile(null);
		}
	}, [imageUrl]);

	useEffect(() => {
		if (!fileUrl && previewSrc && !initialMessage?.file) {
			setPreviewSrc(null);
			setFile(null);
		}
	}, [fileUrl]);

	useEffect(() => {
		if (file === null && !initialMessage?.file) {
			setPreviewSrc(null);
			setFile(null);
		}
	}, [file]);

	return (
		<div className="relative w-8 h-8">
			<div
				className={`rounded-full w-full h-full flex justify-center items-center pointer-events-none aspect-square ${
					file ? "text-gray-500 bg-gray-300" : "text-blue-600 bg-blue-300 hover:opacity-50"
				}`}
			>
				<Paperclip size={16} />
				<input
					disabled={file !== null}
					type="file"
					accept="image/*,.csv,text/csv"
					className="absolute inset-0 w-full h-full pointer-events-auto opacity-0"
					onChange={onPick}
				/>
			</div>
			{previewSrc && (
				<div className={`absolute  ${imagePositionProp === "bottom" ? "top-16" : "bottom-16"}`}>
					{isLoading && (
						<div className="absolute inset-0 bg-black/10 rounded-2xl flex justify-center items-center">
							<LoaderCircle className="text-white/80 animate-spin" />
						</div>
					)}
					{!isLoading && (
						<button
							className="absolute bg-white/80 rounded-full border p-1 right-2 top-2 hover:opacity-50"
							onClick={handleDelete}
							type="button"
						>
							<X />
						</button>
					)}
					<img
						src={previewSrc}
						alt={file?.name || "preview"}
						className="max-w-xs min-w-32 min-h-20 rounded-2xl border border-black/25 max-h-[256px]"
					/>
				</div>
			)}
		</div>
	);
};

export default ImageInput;

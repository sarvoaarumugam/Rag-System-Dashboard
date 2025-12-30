import { useLayoutEffect, useRef, useState } from "react";

const AutoSizeTextArea = () => {
	const ref = useRef<HTMLTextAreaElement | null>(null);

	const resize = () => {
		const el = ref.current;
		if (!el) return;
		el.style.height = "auto"; // reset to measure
		const next = Math.min(el.scrollHeight, 160);
		el.style.height = `${next}px`;
		el.style.overflowY = el.scrollHeight > 160 ? "auto" : "hidden";
	};

	const [input, setInput] = useState<string>("");
	useLayoutEffect(resize, [input]);

	return (
		<textarea
			ref={ref}
			value={input}
			onChange={(e) => setInput(e.target.value)}
			rows={1}
			placeholder="Enter text here"
			className="w-full bg-transparent outline-none resize-none px-2"
			style={{ maxHeight: 160 }}
			onInput={resize}
		/>
	);
};

export default AutoSizeTextArea;

import moment from "moment-timezone";

export type FormattedDateAndTime = {
	date: string;
	time: string;
};

const regionKey = import.meta.env.VITE_REGION_KEY;

const timezones: Record<string, string> = {
	IN: "Asia/Kolkata",
	NL: "Europe/Amsterdam",
};

export const getFormattedDateTime = (IsoDateTime: string) => {
	const localizedDateTime = moment.utc(IsoDateTime).tz(timezones[regionKey]);

	const formattedDateTime = `${localizedDateTime.format("DD/MM/YYYY")} ${localizedDateTime.format("hh:mm A")}`;

	return formattedDateTime;
};

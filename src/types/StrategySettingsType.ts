export const ObSettings: StrategySettingsType = [
	{
		key: "impulse_threshold",
		display_name: "Impulse Threshold",
		default_value: 1.5,
		type: "number",
	},
	{
		key: "impulse_window",
		display_name: "Impulse Window",
		default_value: 3,
		type: "number",
	},
];

export type StrategySettingsType = StrategySettingType[];

export type StrategySettingType = { display_name: string; key: string; default_value: number; type: string };

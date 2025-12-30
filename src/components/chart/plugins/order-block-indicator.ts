import { CanvasRenderingTarget2D } from "fancy-canvas";
import {
	Coordinate,
	isBusinessDay,
	ISeriesApi,
	IPrimitivePaneRenderer,
	IPrimitivePaneView,
	SeriesType,
	Time,
} from "lightweight-charts";
import { positionsBox } from "./helpers/dimensions/positions";
import { PluginBase } from "./plugin-base";
import { ensureDefined } from "./helpers/assertions";

class RectanglePaneRenderer implements IPrimitivePaneRenderer {
	_p1: ViewPoint;
	_p2: ViewPoint;
	_fillColor: string;
	_label: string;
	_labelColor: string;

	constructor(p1: ViewPoint, p2: ViewPoint, fillColor: string, label: string, labelColor: string) {
		this._p1 = p1;
		this._p2 = p2;
		this._fillColor = fillColor;
		this._label = label;
		this._labelColor = labelColor;
	}

	draw(target: CanvasRenderingTarget2D) {
		target.useBitmapCoordinateSpace((scope) => {
			if (this._p1.x === null || this._p1.y === null || this._p2.x === null || this._p2.y === null) return;
			const ctx = scope.context;
			const horizontalPositions = positionsBox(this._p1.x, this._p2.x, scope.horizontalPixelRatio);
			const verticalPositions = positionsBox(this._p1.y, this._p2.y, scope.verticalPixelRatio);
			ctx.fillStyle = this._fillColor;
			ctx.fillRect(
				horizontalPositions.position,
				verticalPositions.position,
				horizontalPositions.length,
				verticalPositions.length
			);

			// Calculate center of rectangle
			const centerX = horizontalPositions.position + horizontalPositions.length / 2;
			const centerY = verticalPositions.position + verticalPositions.length / 2;

			// Font setup
			const fontSize = 12 * Math.min(scope.horizontalPixelRatio, scope.verticalPixelRatio);
			ctx.font = `${fontSize}px system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`;
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";

			// Draw the label in the middle of the rectangle
			ctx.fillStyle = this._labelColor;
			ctx.fillText(this._label, centerX, centerY);
		});
	}
}

interface ViewPoint {
	x: Coordinate | null;
	y: Coordinate | null;
}

class RectanglePaneView implements IPrimitivePaneView {
	_source: Rectangle;
	_p1: ViewPoint = { x: null, y: null };
	_p2: ViewPoint = { x: null, y: null };

	constructor(source: Rectangle) {
		this._source = source;
	}

	update() {
		const series = this._source.series;
		const y1 = series.priceToCoordinate(this._source._p1.price);
		const y2 = series.priceToCoordinate(this._source._p2.price);
		const timeScale = this._source.chart.timeScale();
		const x1 = timeScale.timeToCoordinate(this._source._p1.time);
		const x2 = timeScale.timeToCoordinate(this._source._p2.time);
		this._p1 = { x: x1, y: y1 };
		this._p2 = { x: x2, y: y2 };
	}

	renderer() {
		return new RectanglePaneRenderer(
			this._p1,
			this._p2,
			this._source._options.fillColor,
			this._source._options.labelText,
			this._source._options.labelColor
		);
	}
}

interface Point {
	time: Time;
	price: number;
}

export interface RectangleDrawingToolOptions {
	fillColor: string;
	labelColor: string;
	labelTextColor: string;
	labelText: string;
	showLabels: boolean;
	priceLabelFormatter: (price: number) => string;
	timeLabelFormatter: (time: Time) => string;
}

const defaultOptions: RectangleDrawingToolOptions = {
	fillColor: "rgba(255, 0, 0, 0.25)",
	labelColor: "rgba(255, 0, 0, 0.25)",
	labelTextColor: "black",
	showLabels: true,
	labelText: "",
	priceLabelFormatter: (price: number) => price.toFixed(2),
	timeLabelFormatter: (time: Time) => {
		if (typeof time == "string") return time;
		const date = isBusinessDay(time) ? new Date(time.year, time.month, time.day) : new Date(time * 1000);
		return date.toLocaleDateString();
	},
};

export class Rectangle extends PluginBase {
	_options: RectangleDrawingToolOptions;
	_p1: Point;
	_p2: Point;
	_paneViews: RectanglePaneView[];

	constructor(p1: Point, p2: Point, options: Partial<RectangleDrawingToolOptions> = {}) {
		super();
		this._p1 = p1;
		this._p2 = p2;
		this._options = {
			...defaultOptions,
			...options,
		};
		this._paneViews = [new RectanglePaneView(this)];
	}

	updateAllViews() {
		this._paneViews.forEach((pw) => pw.update());
	}

	paneViews() {
		return this._paneViews;
	}

	applyOptions(options: Partial<RectangleDrawingToolOptions>) {
		this._options = { ...this._options, ...options };
		this.requestUpdate();
	}
}

export type OrderBlockIndicatorDataType = {
	start_point: Point;
	end_point: Point;
};

export class OrderBlockIndicator {
	private _series: ISeriesApi<SeriesType> | undefined;
	private _defaultOptions: Partial<RectangleDrawingToolOptions>;
	public _rectangles: Rectangle[];

	constructor(
		series: ISeriesApi<SeriesType>,
		options: Partial<RectangleDrawingToolOptions>,
		data: OrderBlockIndicatorDataType[]
	) {
		this._series = series;
		this._defaultOptions = options;
		this._rectangles = [];

		data.forEach((element) => {
			this._addNewRectangle(element.start_point, element.end_point);
		});
	}
	remove() {
		if (!this._rectangles.length) return; // idempotent

		for (const rect of this._rectangles) {
			try {
				this._removeRectangle(rect);
			} catch (e) {
				console.warn("detachPrimitive failed", e);
			}
		}
		this._rectangles = [];
		this._series = undefined;
	}

	private _addNewRectangle(p1: Point, p2: Point) {
		const rectangle = new Rectangle(p1, p2, { ...this._defaultOptions });
		this._rectangles.push(rectangle);
		ensureDefined(this._series).attachPrimitive(rectangle);
	}

	private _removeRectangle(rectangle: Rectangle) {
		ensureDefined(this._series).detachPrimitive(rectangle);
	}
}

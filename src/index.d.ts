declare module "SignaturePadTypings" {
	export interface Brush {
		size: number;
		color: string;
		position: BrushPosition;
	}

	type BrushPosition = {
		x: number;
		y: number;
		lastX: number;
		lastY: number;
	};
}

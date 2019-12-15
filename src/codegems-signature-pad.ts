import { html, LitElement, css, customElement, property } from 'lit-element';

// typings
import { Brush } from 'SignaturePadTypings';

@customElement('codegems-signature-pad')
export class CodegemsSignaturePad extends LitElement {
	// styles
	static styles = css`
		:host {
			display: block;
			width: 100%;
			height: 100%;
		}

		canvas {
			width: 100%;
			height: 100%;
		}
	`;

	@property()
	options: any;
	@property()
	disabled: boolean;
	@property()
	canvas: HTMLCanvasElement;
	@property()
	ctx: CanvasRenderingContext2D;
	brush: Brush;
	hasSignature: boolean;

	_boundCanvasEventTouchStart: any;
	_boundCanvasEventTouchMove: any;
	_boundWindowResize: any;

	// createRenderRoot() {
	// 	return document.body;
	// }

	constructor() {
		super();
		this.brush = {
			size: 2,
			color: '#ababab',
			position: {
				x: 0,
				y: 0,
				lastX: 0,
				lastY: 0
			}
		};

		// EVENTS
		this._boundCanvasEventTouchStart = this._canvasEventTouchStart.bind(this);
		this._boundCanvasEventTouchMove = this._canvasEventTouchMove.bind(this);
		this._boundWindowResize = this._windowResize.bind(this);
	}

	firstUpdated() {
		this.canvas = this.shadowRoot.querySelector('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = this.clientWidth;
		this.canvas.height = this.clientHeight;

		this.canvas.addEventListener('touchstart', this._boundCanvasEventTouchStart);
		this.canvas.addEventListener('touchmove', this._boundCanvasEventTouchMove);
	}

	connectedCallback() {
		super.connectedCallback();
		console.log('%c CONNECTED', 'font-size: 24px; color: green;');
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		console.log('%c DISCONNECTED', 'font-size: 24px; color: red;');

		this.canvas.removeEventListener('touchstart', this._boundCanvasEventTouchStart);
		this.canvas.removeEventListener('touchmove', this._boundCanvasEventTouchMove);
	}

	render() {
		return html`
			<canvas></canvas>
		`;
	}

	draw() {
		if (
			this.brush.position.lastX &&
			this.brush.position.lastY &&
			(this.brush.position.x !== this.brush.position.lastX ||
				this.brush.position.y !== this.brush.position.lastY)
		) {
			this.ctx.fillStyle = this.brush.color;
			this.ctx.strokeStyle = this.brush.color;
			this.ctx.lineWidth = this.brush.size * 2;
			this.ctx.beginPath();
			this.ctx.moveTo(this.brush.position.lastX, this.brush.position.lastY);
			this.ctx.lineTo(this.brush.position.x, this.brush.position.y);
			this.ctx.stroke();
		}

		this.ctx.fillStyle = this.brush.color;
		this.ctx.beginPath();
		this.ctx.arc(
			this.brush.position.x,
			this.brush.position.y,
			this.brush.size,
			0,
			Math.PI * 2,
			true
		);
		this.ctx.closePath();
		this.ctx.fill();

		this.brush.position.lastX = this.brush.position.x;
		this.brush.position.lastY = this.brush.position.y;
	}

	// based on Ramer–Douglas–Peucker algorithm
	// https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm
	simplifyLine(points: any[], length: number) {
		let newLine = [...points[0]];
		let end = points.length - 1;

		const simplify = (start: number, end: number) => {
			// recursize simplifies points from start to end
			let maxDist = length;
			let firstPoint = points[start];
			let lastPoint = points[end];
			let xx = firstPoint[0];
			let yy = firstPoint[1];
			let ddx = lastPoint[0] - xx;
			let ddy = lastPoint[1] - yy;
			let dist1 = ddx * ddx + ddy * ddy;
			let t;
			let index;
			let dx;
			let dy;

			for (let i = start + 1; i < end; i++) {
				let point = points[i];

				if (ddx !== 0 || ddy !== 0) {
					t = ((point[0] - xx) * ddx + (point[1] - yy) * ddy) / dist1;
					if (t > 1) {
						dx = point[0] - lastPoint[0];
						dy = point[1] - lastPoint[1];
					} else if (t > 0) {
						dx = point[0] - (xx + ddx * t);
						dy = point[1] - (yy + ddy * t);
					} else {
						dx = point[0] - xx;
						dy = point[1] - yy;
					}
				} else {
					dx = point[0] - xx;
					dy = point[1] - yy;
				}

				let dist = dx * dx + dy * dy;
				if (dist > maxDist) {
					index = i;
					maxDist = dist;
				}
			}

			if (maxDist > length) {
				// continue simplification while maxDist > length
				if (index - start > 1) {
					simplify(start, index);
				}
				newLine.push(points[index]);
				if (end - index > 1) {
					simplify(index, end);
				}
			}
		};

		simplify(0, end);
		newLine.push(points[end]);
		return newLine;
	}

	cleanUp() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	// EVENTS HANDLERS
	_canvasEventTouchStart(e: TouchEvent) {
		let touch = e.touches[0];
		let rect = this.canvas.getBoundingClientRect();

		this.brush.position.x = touch.clientX - rect.left;
		this.brush.position.y = touch.clientY - rect.top;
		this.brush.position.lastX = this.brush.position.x;
		this.brush.position.lastY = this.brush.position.y;
		this.draw();

		e.preventDefault();
	}

	_canvasEventTouchMove(e: TouchEvent) {
		let touch = e.touches[0];
		let rect = this.canvas.getBoundingClientRect();

		this.brush.position.x = touch.clientX - rect.left;
		this.brush.position.y = touch.clientY - rect.top;
		this.draw();

		e.preventDefault();
	}

	_windowResize() {
		console.log('resize');
	}
}

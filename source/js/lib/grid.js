
import assign from 'lodash.assign'

import {
	PADDING,
	RESOLUTION,
	DOT_RATIO,
	TWO_PI
} from './constants'

export default class Grid {

	constructor (args) {
		const opts = assign({
			padding: PADDING,
			spacing: RESOLUTION,
			fill: 'rgb(0, 0, 0)'
		}, args)

		this.width = opts.width
		this.height = opts.height
		this.padding = opts.padding
		this.spacing = opts.spacing
		this.fill = opts.fill
	}

	get innerWidth () {
		return this.width - (this.padding * 2)
	}

	get innerHeight () {
		return this.height - (this.padding * 2)
	}

	get exactSpacing () {
		return this.innerWidth / this.columns
	}

	get columns () {
		return Math.floor(this.innerWidth / this.spacing)
	}

	get rows () {
		return Math.floor(this.innerHeight / this.spacing)
	}

	get dotSize () {
		return this.spacing * DOT_RATIO
	}

	x (i) {
		return this.padding + i * this.exactSpacing
	}

	y (i) {
		return this.padding + i * this.exactSpacing
	}

	blocks (i) {
		return this.exactSpacing * i
	}

	render (ctx) {
		ctx.fillStyle = 'rgb(0, 0, 0)'
		for (let i = 0; i <= this.columns; i++) {
			for (let j = 0; j <= this.rows; j++) {
				ctx.beginPath()
				ctx.arc(this.x(i), this.y(j), this.dotSize, 0, TWO_PI, true)
				ctx.closePath()
				ctx.fill()
			}
		}
	}

	resize (w, h) {
		this.width = w
		this.height = h
	}

}

const columns = () => Math.floor((width - TWO_PADDING) / RESOLUTION)
const rows = () => Math.floor((height - TWO_PADDING) / RESOLUTION)
const count = () => columns() * rows()

const dotSize = () => RESOLUTION * DOT_RATIO


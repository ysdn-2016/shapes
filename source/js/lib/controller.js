
import rand from 'random-int'
import pick from './helpers/random-el'

import {
	COLOURS
} from './constants'

import {
	AbstractShape,
	Circle,
	Semicircle,
	Triangle,
	Square
} from './shapes'

const allowedShapes = [
	Circle,
	Triangle,
	Square,
	// Semicircle
]

const LOW_TIME  = 150
const HIGH_TIME = 3000

export default class ShapeController {

	constructor (opts) {
		this.shapes = Array.isArray(opts.shapes) ? shapes : []
		this.count = opts.count
		this.grid = opts.grid || null
		this.timer = null
	}

	/**
	 * Randomly generate shapes up to the specified amount
	 */
	static create (opts) {
		return new ShapeController(opts)
	}

	add (shape) {
		this.shapes.push(shape)
	}

	start () {
		this.timer = setTimeout(this.tick.bind(this), rand(LOW_TIME, HIGH_TIME))
	}

	tick () {
		this.shapes.forEach((shape, i) => {
			if (shape.hidden) {
				this.shapes.splice(i, 1)
			}
		})
		if (this.shapes.length > this.count) {
			const shape = this.shapes[0]
			shape.hide()
		}
		const newShape = generateShape(this.grid)
		this.shapes.push(newShape)
		newShape.show()
		this.timer = setTimeout(this.tick.bind(this), rand(LOW_TIME, HIGH_TIME))
	}

	render (ctx) {
		for (let shape of this.shapes) {
			shape.render(ctx)
		}
	}

}

function generateShape (grid) {
	const Shape = pick(allowedShapes)
	const size = rand(2, 8)
	const shape = new Shape(
		grid,
		rand(size, grid.columns - size),
		rand(size, grid.rows - size),
		size,
		{
			fill: pick(COLOURS)
		}
	)
	return shape
}
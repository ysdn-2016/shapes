
import assign from 'lodash.assign'
import rand from 'random-int'
import pick from '../helpers/random-el'

import {
	COLOURS
} from '../constants'

const directions = {
	top: { x: 0.0, y: -1.0 },
	left: { x: -1.0, y: 0.0 },
	right: { x: 1.0, y: 0.0 },
	bottom: { x: 0.0, y: 1.0 }
}

export default class AbstractShape {
	constructor (args) {
		const opts = assign({
			fill: COLOURS[rand(COLOURS.length - 1)],
			lifetime: rand(3000)
		}, args)
		this.fill = opts.fill
		this.speed = (Math.random() * 1.5) + 0.75
		this.x = 0
		this.y = 0
		this.direction = directions[pick(Object.keys(directions))]
		this.shiftX = this.direction.x
		this.shiftY = this.direction.y
	}
}

import tween from '../helpers/tween'

import { TWO_PI } from '../constants'
import AbstractShape from './abstract'

export default class Circle extends AbstractShape {
	constructor (grid, x, y, size, opts) {
		super(opts)
		this.grid = grid
		this.x = x
		this.y = y
		this.size = Math.floor(size / 2) * 2
	}

	show () {
		tween.to(this, {
			shiftX: 0,
			shiftY: 0,
			ease: 'expoOut',
			duration: this.speed
		})
	}

	hide () {
		setTimeout(() => {
			this.hidden = true
		}, this.speed)
		tween.to(this, {
			shiftX: this.direction.x,
			shiftY: this.direction.y,
			ease: 'expoOut',
			duration: this.speed
		})
	}

	render (ctx) {
		const x = this.grid.x(this.x)
		const y = this.grid.y(this.y)
		const size = this.grid.blocks(this.size)
		const radius = size / 2
		const shiftX = this.shiftX * size
		const shiftY = this.shiftY * size

		ctx.save()
		ctx.beginPath()
		ctx.rect(x - radius , y - radius, size, size)
		ctx.closePath()
		ctx.clip()
		ctx.beginPath()
		ctx.arc(x + shiftX, y + shiftY, radius, 0, TWO_PI, true)
		ctx.closePath()
		ctx.fillStyle = this.fill
		ctx.fill()
		ctx.restore()
	}
}
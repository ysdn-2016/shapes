
import rand from 'random-int'

import tween from '../helpers/tween'
import { PI } from '../constants'
import AbstractShape from './abstract'

export default class Circle extends AbstractShape {
	constructor (grid, x, y, size, opts) {
		super(opts)
		this.grid = grid
		this.x = x
		this.y = y
		this.size = Math.floor(size / 2) * 2
		this.rotation = Math.round(rand(0, PI) / (PI / 2)) * (PI / 2)
	}

	show () {
		tween.to(this, {
			shiftX: 0.0,
			shiftY: 0.0,
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
		const isWide = this.rotation % Math.PI === 0

		ctx.save()
		ctx.translate(x, y)
		ctx.beginPath()
		ctx.rect(0, 0, isWide ? size : radius, isWide ? radius : size)
		ctx.closePath()
		ctx.clip()
		ctx.beginPath()
		ctx.arc(shiftX, radius + shiftY, radius, this.rotation, PI + this.rotation, true)
		ctx.closePath()
		ctx.fillStyle = this.fill
		ctx.fill()
		ctx.restore()
	}
}
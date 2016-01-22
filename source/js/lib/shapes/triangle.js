
import tween from '../helpers/tween'
import AbstractShape from './abstract'

export default class Triangle extends AbstractShape {

	constructor (grid, x, y, size, opts) {
		super(opts)
		this.grid = grid
		this.x = x
		this.y = y
		this.size = size
	}

	show () {
		tween.to(this, {
			shiftX: 0,
			shiftY: 0,
			ease: 'expoOut',
			duration: this.speed
		})
	}

	hide (fn) {
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
		const shiftX = this.shiftX * size
		const shiftY = this.shiftY * size

		ctx.save()
		ctx.beginPath()
		ctx.rect(x, y, size, size)
		ctx.closePath()
		ctx.clip()
		ctx.beginPath()
		ctx.translate(x + shiftX, y + shiftY)
		ctx.moveTo(0, 0)
		ctx.lineTo(size, size)
		ctx.lineTo(0, size)
		ctx.lineTo(0, 0)
		ctx.closePath()
		ctx.fillStyle = this.fill
		ctx.fill()
		ctx.restore()
	}

}
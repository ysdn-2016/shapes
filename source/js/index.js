
import ready from 'domready'
import createCtx from '2d-context'
import createLoop from 'canvas-loop'

import Grid from './lib/grid'
import ShapeController from './lib/controller'

let width, height

ready(function () {

	const shapeCanvas = document.querySelector('canvas.shapes')
	const gridCanvas = document.querySelector('canvas.grid')
	const shapeCtx = createCtx({ canvas: shapeCanvas })
	const gridCtx = createCtx({ canvas: gridCanvas })
	const grid = new Grid({ width: 500, height: 280 })

	const shapeLoop = createLoop(shapeCanvas, {
		scale: window.devicePixelRatio
	})

	const gridLoop = createLoop(gridCanvas, {
		alpha: true,
		scale: window.devicePixelRatio
	})

	shapeLoop.on('tick', loop)
	shapeLoop.on('resize', shapeResize)
	gridLoop.on('resize', gridResize)

	shapeResize()
	gridResize()
	shapeLoop.start()

	const shapes = ShapeController.create({ grid, count: 5 })

	shapes.start()

	// draw dots
	// setInterval to create new shapes

	function loop (dt) {
		shapeCtx.clearRect(0, 0, width, height)
		shapeCtx.globalCompositeOperation = 'screen'
		shapes.render(shapeCtx)
		// shapeCtx.globalCompositeOperation = 'source-over'
	}

	function shapeResize () {
		width = shapeLoop.shape[0]
		height = shapeLoop.shape[1]
		grid.resize(width, height)
	}

	function gridResize () {
		grid.render(gridCtx)
	}

})

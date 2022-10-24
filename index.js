const circleR = 40
const rainbowV = ["#FF0000", "#FF1600", "#FF2C00", "#FF4200", "#FF5700", "#FF6D00", "#FF8300", "#FF9900", "#FFAF00", "#FFC500", "#FFDB00", "#FFF000", "#F8FF00", "#E2FF00", "#CCFF00",  "#B6FF00", "#A0FF00", "#8AFF00", "#75FF00", "#5FFF00", "#49FF00", "#33FF00", "#1DFF00",  "#07FF00", "#00FF0F", "#00FF24", "#00FF3A",  "#00FF50", "#00FF66",  "#00FF7C", "#00FF92", "#00FFA8",  "#00FFBD", "#00FFD3", "#00FFE9", "#00FFFF", "#00E9FF",  "#00D3FF", "#00BDFF",  "#00A8FF", "#0092FF", "#007CFF",  "#0066FF", "#0050FF", "#003AFF", "#0024FF", "#000FFF", "#0700FF", "#1D00FF", "#3300FF", "#4900FF", "#5F00FF", "#7500FF", "#8A00FF", "#A000FF", "#B600FF", "#CC00FF", "#E200FF", "#F800FF", "#FF00F0", "#FF00DB", "#FF00C5", "#FF00AF", "#FF0099", "#FF0083", "#FF006D", "#FF0057", "#FF0042", "#FF002C", "#FF0016"]

var isEnabled = false
//var isMoving = false
var mult = 3
var taskID = -1
var lastPoint = {x: circleR, y: circleR}

var rI = 0

const dist = (p1, p2) => Math.floor(Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)))
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

window.onload = function WindowLoad(e) {
	document.getElementById("speed-input").value = mult
	
	document.getElementById("start-anim").addEventListener("click", startProcess)
	document.getElementById("stop-anim").addEventListener("click", stopAnimation)
	document.getElementById("reset-anim").addEventListener("click", resetAnimation)
	
	document.getElementById("myCanvas").addEventListener("click", e => {
		if(isEnabled /*&& !isMoving*/) {
			let canv = e.target.getBoundingClientRect()
			let x = e.clientX - canv.left
			let y = e.clientY - canv.top	
		
			startAnimation(x, y)
		}
	})
	
	document.getElementById("speed-input").addEventListener("focusout", () => {
		let input = document.getElementById("speed-input")
		input.value = clamp(input.value, input.min, input.max)
	})
}

function startProcess() {
	drawElement(circleR, circleR)
	document.getElementById("myCanvas").style.cursor = "pointer"
	isEnabled = true
}

function startAnimation(x, y) {
	stopMovement()
	
	let speedInput = document.getElementById("speed-input")
	
	let i = 0
	let di = dist(lastPoint, {x, y})
	mult = parseFloat(speedInput.value)
	let points = lerpCoordinates(lastPoint, {x, y}, di/mult);
	
	taskID = setInterval(() => {
		if(i == points.length) {
			stopMovement()
			return
		}
		
		let inBetween = points[i]
		clearCanvas()
		
		rainbowElement(inBetween.x, inBetween.y)
		
		lastPoint = inBetween
		i++
	}, 17)
	
	//document.getElementById("myCanvas").style.cursor = "not-allowed"
	//isMoving = true
}

function stopAnimation() {
	stopMovement()
	clearCanvas()
	lastPoint = {x: circleR, y: circleR}
	document.getElementById("myCanvas").style.cursor = "not-allowed"
	isEnabled = false
}

function stopMovement() {
	clearInterval(taskID)
	taskID = -1
	drawElement(lastPoint.x, lastPoint.y)
	//document.getElementById("myCanvas").style.cursor = "pointer"
	//isMoving = false
}

function resetAnimation() {
	stopAnimation()
	startProcess()
}

function clearCanvas() {
	let canv = document.getElementById("myCanvas")
	let ctx = canv.getContext("2d")
	ctx.clearRect(0, 0, canv.width, canv.height)
}

function drawElement(x, y, color) {
	if(typeof color === "undefined") {
		drawElement(x, y, "#0000FF")
		return
	}
	
	let canv = document.getElementById("myCanvas")
	let ctx = canv.getContext("2d")
	
	ctx.beginPath()
	ctx.arc(x, y, circleR, 0, 2*Math.PI)
	ctx.fillStyle = color
	ctx.fill()
}

function rainbowElement(x, y) {
	drawElement(x, y, rainbowV[rI])
	rI = (rI + 1) % rainbowV.length
}

function lerpCoordinates(p1, p2, amount) {
	let coordinates = []
	let canv = document.getElementById("myCanvas")
	let f = false

	coordinates.push(p1)
	
	const outOfX = p2.x < circleR || p2.x > canv.width - circleR
	const outOfY = p2.y < circleR || p2.y > canv.height - circleR
		
	if(outOfX) p2.x = clamp(p2.x, circleR, canv.width - circleR)
	if(outOfY) p2.y = clamp(p2.y, circleR, canv.height - circleR)

	for(let i = 1; i < amount; i++) {
		let point = {
			x: p1.x + (p2.x - p1.x) * (i/amount),
			y: p1.y + (p2.y - p1.y) * (i/amount)
		}
		
		const outOfX = point.x < circleR || point.x > canv.width - circleR
		const outOfY = point.y < circleR || point.y > canv.height - circleR
		
		if(outOfX || outOfY) {
			f = true
			
			if(outOfX) point.x = clamp(point.x, circleR, canv.width - circleR)
			if(outOfY) point.y = clamp(point.y, circleR, canv.height - circleR)
		}
		
		coordinates.push(point)
	}
	
	if(!f) coordinates.push(p2)
	
	return coordinates
}







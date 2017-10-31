var points = [];
var ctx;
var isMoving = false;
var pressedPoint = -1;
var canvas;
const THRESHOLD = 5; //一開始設小於1，但JS浮點數真的麻煩，後來發現大於1的表現就不錯了
var count = 0;


$(document).ready(function(){

	canvas = document.getElementById('myCanvas');
	// 畫筆
	ctx = canvas.getContext("2d");

	$("#myCanvas").on("mousemove", onMouseMove);
	$("#myCanvas").on("mousedown", onMouseDown);
	$("#myCanvas").on("mouseup", onMouseUp);

});

// 有沒有被包含方法
function isCollided ( pointX, pointY, targetX,
	 targetY, targetWidth, targetHeight ) {
	if(     pointX >= targetX
        &&  pointX <= targetX + targetWidth
        &&  pointY >= targetY
        &&  pointY <= targetY + targetHeight
	){
        return true;
	} else {
        return false;
	}
}

// 判斷座標位置在哪個定位點上，-1為點在空白處
function onLocationPoints(pointX, pointY){
	var onPoint = -1;
	for(var i = 0; i < points.length; i++){
		if (isCollided(pointX, pointY, points[i].x -5,
						 points[i].y -5, 10, 10)) {
			onPoint = i;
			break;
		}
		console.log("X:" + points[i].x + ", Y:" + points[i].y);
	}
	return onPoint;
}

function onMouseDown(){
	console.log("mouseDown");
	// console.log("click: X: " + cursor.x + ", Y: " + cursor.y);
	pressedPoint = onLocationPoints(cursor.x, cursor.y);

	if (points.length < 4 && pressedPoint == -1) {
		// console.log("points.length < 4 && pressedPoint == -1");
		points.push(new Point(cursor.x, cursor.y));

		draw();
	}
	console.log(pressedPoint);
}

function onMouseMove(event){
	cursor.x = event.offsetX;
	cursor.y = event.offsetY;
	if (pressedPoint != -1) {
		// console.log("pressed");
		points[pressedPoint].x = cursor.x;
		points[pressedPoint].y = cursor.y;
		draw();
	}
}

function onMouseUp(){
	console.log("mouseUp");
	console.log(pressedPoint);

	pressedPoint = -1;
}

function draw(){
	console.log("draw");
	clear();

	// 定位點
	for (var i = 0; i < points.length; i++) {
		ctx.beginPath();
		ctx.lineWidth = "3";
		ctx.strokeStyle = "orange";
		ctx.rect(points[i].x - 5, points[i].y - 5, 10, 10);
		ctx.stroke();
	}

	// 曲線
	if (points.length == 4) {
		bezierCurve(points[0], points[1], points[2], points[3]);
	}
}

function bezierCurve(point1, point2, point3, point4){
	console.log("bezierCurve");
	if (!isPointsCloseEnough(point1, point2, point3, point4)) {
		console.log("Cal");
		count++;
		console.log("Count: " + count);

		var point12 = new Point((point1.x + point2.x)/2, (point1.y + point2.y)/2);
		var point23 = new Point((point3.x + point2.x)/2, (point3.y + point2.y)/2);
		var point34 = new Point((point3.x + point4.x)/2, (point3.y + point4.y)/2);
		var point123 = new Point((point12.x + point23.x)/2, (point12.y + point23.y)/2);
		var point234 = new Point((point34.x + point23.x)/2, (point34.y + point23.y)/2);
		var pointQ = new Point((point123.x + point234.x)/2, (point123.y + point234.y)/2);

		bezierCurve(point1, point12, point123, pointQ);
		bezierCurve(pointQ, point234, point34, point4);
	}else{
		console.log("drawLine");
		ctx.beginPath(); 
		ctx.lineWidth = "1";
		ctx.strokeStyle = "black";
		ctx.moveTo(point1.x, point1.y);
		ctx.lineTo(point2.x, point2.y);
		ctx.lineTo(point3.x, point3.y);
		ctx.lineTo(point4.x, point4.y);
		ctx.stroke();
	}
}

// 判斷四點是否夠靠近了，方法是利用中點距離
// 沒用面積是因為海龍公式只能用在凸四邊形
function isPointsCloseEnough(point1, point2, point3, point4){
	console.log("isPointsCloseEnough");
	var isEnough = true;
	var X = (point1.x + point2.x + point3.x + point4.x)/4;
	var Y = (point1.y + point2.y + point3.y + point4.y)/4;

	if (Math.abs(X - point1.x) > THRESHOLD ||
		Math.abs(X - point2.x) > THRESHOLD ||
		Math.abs(X - point3.x) > THRESHOLD ||
		Math.abs(X - point4.x) > THRESHOLD ||
		Math.abs(Y - point1.y) > THRESHOLD ||
		Math.abs(Y - point2.y) > THRESHOLD ||
		Math.abs(Y - point3.y) > THRESHOLD ||
		Math.abs(Y - point4.y) > THRESHOLD
		){
			isEnough = false;
		}

	return isEnough;
}

// 清除畫面
function clear(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 定位點類別
function Point(x, y){
	this.x = x,
	this.y = y
}

// 滑鼠物件
var cursor = {
	x:640 - 32,
	y:480 - 32
};
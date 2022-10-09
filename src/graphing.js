"use strict"

let ctx;
let l, r, b, t;
let height, width;
let delta;

/**
 * Initializes the canvas rendering context.  This function must be called before any other methods in this module
 * @param {CanvasRenderingContext2D} canvasContext is the context to be used for drawing by this module
 * @param {number} left is the initial minimum x-value of the viewport
 * @param {number} right is the intial maximum x-value of the viewport
 * @param {number} bottom is the initial minimum y-value of the viewport
 * @param {number} top is the inital maximum y-value of the viewport
 */
export function init(canvasContext, left, right, bottom, top) {
    ctx = canvasContext;
    l = left;
    r = right;
    b = bottom;
    t = top;
    delta = Math.min(r - l, t - b) / 1000;
    height = ctx.canvas.height;
    width = ctx.canvas.width;
    console.log(height);
}

/**
 * Draws a vertical line
 * @param {number} x is the x-position at which the line will be drawn
 */
export function drawVerticalLine(x) {
    ctx.beginPath();
    ctx.moveTo((x - l) * width / (r - l), 0);
    ctx.lineTo((x - l) * width / (r - l), height);
    ctx.closePath()
    ctx.stroke();
}

/**
 * Draws a horizontal line
 * @param {*} y is y-position at which the line will be drawn
 */
export function drawHorizontalLine(y) {
    ctx.beginPath();
    ctx.moveTo(0, (y - b) * height / (t - b));
    ctx.lineTo(width, (y - b) * height / (t - b));
    ctx.closePath();
    ctx.stroke();
}

/**
 * Plots a point at (x,y)
 * @param {number} x the x-coordinate to plot the point at
 * @param {number} y the y-coordinate to plot the point at
 * @param {number} radius The radius with which to draw the point [defaults to 2.5]
 */
export function plot(x, y, radius = 2.5) {
    ctx.beginPath();
    ctx.arc((x - l) * width / (r - l), (y - t) * height / (b - t), radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

/**
 * Moves to (x,y) on graph's coordinate system, as opposed to the canvas's coordinate system
 * @param {number} x the x-value of the coordinate
 * @param {number} y the y-value of the coordinate
 */
function moveTo(x, y) {
    ctx.moveTo((x - l) * width / (r - l), (y - t) * height / (b - t));
}

/**
 * Adds a line to (x,y) on the graph's coordinate system, as opposed to the canvas's coordinate system
 * @param {number} x the x-value of the coordinate
 * @param {number} y the y-value of the coordinate
 */
function lineTo(x, y) {
    ctx.lineTo((x - l) * width / (r - l), (y - t) * height / (b - t));
}

/**
 * Plots a functions of x on [left, right] where left and right are the arguments passed to init()
 * @param {function} f is the function to plot against x
 */
export function graphFunctionofX(f) {
    ctx.beginPath();
    moveTo(l, f(l));
    for (let x = l + delta; x <= r + delta; x += delta) {
        lineTo(x, f(x));
    }
    ctx.stroke();

    ctx.beginPath();
}

/**
 * Plots a functions of y on [bottom, top] where bottom and top are the arguments passed to init()
 * @param {function} f is the function to plot against y
 */
export function graphFunctionOfY(f) {
    ctx.beginPath();
    moveTo(f(b), b);
    for (let y = b + delta; y <= t; y += delta) {
        lineTo(f(y), y);
    }
    ctx.stroke();
}

/**
 * Graphs the parametric (x(t), y(t)) from t=t_i to t=t_f
 * @param {number} x the x-value as a function of t
 * @param {number} y the y-value as a function of t
 * @param {*} t_i the initial value of t
 * @param {*} t_f the final value of t
 */
export function graphParametric(x, y, t_i, t_f) {
    ctx.beginPath();
    moveTo(x(t_i), y(t_i));
    for (let t = t_i + delta; t <= t_f + delta; t += delta) {
        lineTo(x(t), y(t));
    }
    ctx.stroke();
}
/**
 * Graphs a function whose curvature is the function argumment curvature, starting at (x_i, y_i) in direction theta_i
 * @param {function} curvature a function of (x, y, l), where x is the x-coordinate, y is the y-coordinate, and l is the total arclength drawn so far
 * @param {*} x_i the x-coorinate at which to begin graphing
 * @param {*} y_i the y-coorinate at which to begin graphing
 * @param {*} theta_i The angle in radians at which to begin graphing
 * @param {*} totalDistance the total arc length of the graph
 */
export function graphAntiCurvature(curvature, x_i, y_i, theta_i, totalDistance) {
    let x = x_i;
    let y = y_i;
    let vx = Math.cos(theta_i);
    let vy = Math.sin(theta_i);

    let vxNew, vyNew, mag;
    moveTo(x_i, y_i);
    for (let i = 0; i < totalDistance + delta; i += delta) {
        vxNew = vx * Math.cos(curvature(x, y, i) * delta) - vy * Math.sin(curvature(x, y, i) * delta);
        vyNew = vx * Math.sin(curvature(x, y, i) * delta) + vy * Math.cos(curvature(x, y, i) * delta);
        mag = Math.sqrt(vxNew * vxNew + vyNew * vyNew);
        vxNew /= mag;
        vyNew /= mag;
        vx = vxNew;
        vy = vyNew;
        x += vx * delta;
        y += vy * delta;
        lineTo(x, y);
    }
    ctx.stroke();
}

/**
 * Graphs the points on the x-y plane where left(x,y) == right(x,y)
 * @param {function} left is the function on (x,y) on the left of the equivalence
 * @param {function} right is the function on (x,y) on the right of the equivalence
 */
export function graphEquivalence(left, right) {
    const f = (x, y) => left(x, y) - right(x, y);
    const numPoints = 20;
    let points = [];
    for (let x = l; x <= r; x += (r - l) / numPoints) {
        for (let y = b; y <= t; y += (t - b) / numPoints) {
            let point = { "x": x, "y": y };
            for (let i = 0; i < 10; i++) {
                let dfdx = (f(point.x + delta, point.y) - f(point.x, point.y)) / delta;
                let dfdy = (f(point.x, point.y + delta) - f(point.x, point.y)) / delta;
                let fxy = f(point.x, point.y);
                point.x -= fxy * dfdx / (dfdx*dfdx + dfdy*dfdy);
                point.y -= fxy * dfdy /(dfdx*dfdx + dfdy*dfdy);
            }
            plot(point.x, point.y);
        }
    }
}


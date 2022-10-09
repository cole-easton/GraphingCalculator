"use strict";
import * as graphing from "./graphing.js";
// #1 - wait for page to load
window.onload = init;

function init() {
    console.log("init() called");
    // #2 - get pointer to <canvas> element on page
    let canvas = document.querySelector('canvas');

    // #3 - get pointer to "graphing context" and graphing API
    let ctx = canvas.getContext('2d');

    let curvature = (x, y, d) => Math.sin(x) * 0.88;
    let f = x => 0;
    let x = t => 3.3484 * Math.cos(t) / (1 + Math.pow(Math.sin(t), 2));
    let y = t => 3.3484 * Math.sin(t) * Math.cos(t) / (1 + Math.pow(Math.sin(t), 2));

    let l = -4, r = 4, b = -4, t = 4;
    graphing.init(ctx, l, r, b, t);

    draw();

    function draw() {
        drawFunctions();
        requestAnimationFrame(draw, 1 / 60);
    }

    function drawFunctions() {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'rgb(200, 200, 200)';
        for (let x = Math.floor(l); x < r; x++) {
            if (x != 0) graphing.drawVerticalLine(x);
        }
        for (let y = Math.floor(b); y<t; y++) {
            graphing.drawHorizontalLine(y);
        }

        ctx.strokeStyle = 'rgb(0, 0, 0)';
        graphing.drawVerticalLine(0);
        graphing.drawHorizontalLine(0);


        ctx.strokeStyle = 'rgb(70, 240, 0)';
        graphing.graphParametric(x, y, 0, 2*Math.PI);

        ctx.fillStyle = 'rgb(255, 50, 10)';
        graphing.graphFunctionofX(f);
        ctx.strokeStyle = 'rgb(50, 150, 255)';
        //graphing.graphAntiCurvature(curvature, 0, 0, -Math.PI/4, 100);

        ctx.fillStyle = 'rgb(255, 130, 0)';
        graphing.graphEquivalence((x,y)=>Math.pow(x*x+y*y, 2), (x,y)=>x*x-y*y);
    }
}
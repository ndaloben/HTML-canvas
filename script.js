let canvas;
let ctx;
let flowField;
let flowFieldAnimation;
window.onload = function () {
    canvas = document.getElementById('canvas1');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    flowField.animate(0);
}

window.addEventListener('resize', function () {
    this.cancelAnimationFrame(flowFieldAnimation);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    flowField.animate(0);
});

const mouse = {
    x: 0,
    y: 0,
}
window.addEventListener('mousemove', function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
})

class FlowFieldEffect {
    #ctx;
    #width;
    #height;
    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#ctx.strokeStyle = "blue";
        this.#ctx.lineWidth = 1;
        this.#width = width;
        this.#height = height;
        this.lastTime = 0;
        this.interval = 200;
        this.timer = 0;
        this.cellSize = 10;
        this.gradient;
        this.#createGradient();
        this.#ctx.strokeStyle = this.gradient
        this.radius = 0;
        this.vr = 0.03
    }

    #createGradient() {
        this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
        this.gradient.addColorStop("0.1", "red");
        this.gradient.addColorStop("0.2", "orange");
        this.gradient.addColorStop("0.3", "yellow");
        this.gradient.addColorStop("0.4", "green");
        this.gradient.addColorStop("0.5", "brown");
        this.gradient.addColorStop("0.6", "indigo");
        this.gradient.addColorStop("0.7", "violet");
        this.gradient.addColorStop("0.8", "blue");
    }

    #drawLine(x, y, angle) {
        let positionX = x;
        let positionY = y;
        let dx = mouse.x - positionX;
        let dy = mouse.y - positionY;
        let distance = dx * dx + dy * dy;
        if (distance > 150000) distance = 300000
        let length = distance/10000;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        this.#ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
        this.#ctx.stroke();
    }
    animate(timeStamp) {
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        if (this.timer > this.interval) {
            this.#ctx.clearRect(0, 0, this.#width, this.#height);
            this.radius += this.vr
            if (this.radius > 5 || this.radius < -5) this.vr *= -1;

            for (let y = 0; y < this.#height; y += this.cellSize) {
                for (let x = 0; x < this.#width; x += this.cellSize) {
                    const angle = (Math.cos(x * 10) + Math.sin(y * 10)) * this.radius;
                    this.#drawLine(x, y, angle);
                }
            }

            this.timer = 0;
        } else {
            this.timer += deltaTime;
        }
        flowFieldAnimation = requestAnimationFrame(this.animate.bind(this));
    }
}
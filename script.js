let height;
let width;
const rows = 10;
const columns = 15;
// для теста длина змеи = 4
const snake = [{
    row: 5,
    column: 0
}];
let direction = "RIGHT";
let game;
let interval;
let intervalTimeout = 1000;
let food = generateFood();

function changeInterval() {
    clearInterval(interval);
    interval = setInterval(() => {
        moveSnake()
        render();
    }, intervalTimeout);
}

window.onload = () => {
    console.log("Скрипты подключены");
    let canvas = document.getElementById("canvas");
    game = canvas.getContext("2d");
    height = canvas.clientHeight;
    width = height  * 1.5;
    canvas.width = width;
    canvas.height = height;
    render();
    changeInterval();
}

function generateFood() {
    let row = Math.round(Math.random() * (rows - 1));
    let column = Math.round(Math.random() * (columns - 1));
    return { row, column }
}

function renderFood() {
    let size = height / rows;
    game.fillStyle = "green";
    let y = food.row * size;
    let x = food.column * size;
    game.fillRect(x, y, size, size);
}

function render() {
    game.clearRect(0, 0, width, height);
    renderSnake();
    renderFood();
}

function renderSnake() {
    let size = height / rows;
    for (let s of snake) {
        game.fillStyle = "red";
        let y = s.row * size;
        let x = s.column * size;
        game.fillRect(x, y, size, size);
    }
}

function moveSnake() {
    let head = getHead();
    switch (direction) { // добавляем новый элемент после головы
        case "RIGHT":
            addBody(head.row, head.column + 1);
            break;
        case "LEFT":
            addBody(head.row, head.column - 1);
            break;
        case "UP":
            addBody(head.row - 1, head.column);
            break;
        case "DOWN":
            addBody(head.row + 1, head.column);
            break;
    }
}

function addBody(row, column) {
    if (row === -1) row = rows - 1;
    if (row === rows) row = 0;
    if (column === -1) column = columns - 1;
    if (column === columns) column = 0;
    if (isCellFill(row, column)) {
        gameover();
    }
    if (isFood(row, column)) {
        food = generateFood();
        intervalTimeout -= intervalTimeout * 0.1;
        changeInterval();
    } else {
        snake.shift();
    }
    snake.push({
        row,
        column
    });
}

function isFood(row, column) {
    return food.row === row && food.column === column;
}

function isCellFill(row, column) {
    return !!snake.find(it => it.row === row && it.column === column);
}

function getHead() {
    return snake[snake.length - 1];
}

function gameover() {
    console.log("Конец игры");
    clearInterval(interval);
}

document.addEventListener("keydown", onKeyDown, false);

function changeDirection(dir) {
    console.log(dir);
    // запрещаем поворот на 180 градусов
    if (dir === "RIGHT" && direction === "LEFT") return;
    if (dir === "LEFT" && direction === "RIGHT") return;
    if (dir === "UP" && direction === "DOWN") return;
    if (dir === "DOWN" && direction === "UP") return;
    direction = dir;
}

function onKeyDown(event) {
    var key = event.key;
    switch (key) {
        case "d":
            changeDirection("RIGHT");
            break;
        case "s":
            changeDirection("DOWN");
            break;
        case "a":
            changeDirection("LEFT");
            break;
        case "w":
            changeDirection("UP");
            break;
    }
}
let height;
let width;
const rows = 10;
const columns = 15;
const snake = [{
    row: 5,
    column: 0
}];
let direction = "RIGHT";
let game;
let interval;
let intervalTimeout = 300;
let foodImages = [];
loadFoodImages("images/apple.png");
loadFoodImages("images/tomato.png");
loadFoodImages("images/orange.png");
let food = generateFood();
let snakeImage = new Image();
snakeImage.src = "images/snake.png";
let time = 0;
let fruitsCount = 0;

function loadFoodImages(url) {
    let image = new Image();
    image.src = url;
    foodImages.push(image);
}

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
    let imageIndex = Math.round(Math.random() * (foodImages.length - 1));
    console.log(imageIndex);
    let image = foodImages[imageIndex];
    return { row, column, image }
}

function renderFood() {
    let size = height / rows;
    let y = food.row * size;
    let x = food.column * size;
    game.drawImage(food.image, x, y, size, size);
}

function render() {
    game.clearRect(0, 0, width, height);
    renderSnake();
    renderFood();
    renderTimer();
}

function renderTimer() {
    document.getElementById("time").innerText = time + " сек";
}

setInterval(() => time++, 1000)

function renderHead() {
    let size = height / rows;
    let s = snake[snake.length - 1];
    let y = s.row * size;
    let x = s.column * size;
    switch (direction) {
        case "UP":
            // https://developer.mozilla.org/ru/docs/Web/API/CanvasRenderingContext2D/drawImage
            game.drawImage(snakeImage, 190, 0, 63, 63, x, y, size, size);
            break;
        case "DOWN":
            // https://developer.mozilla.org/ru/docs/Web/API/CanvasRenderingContext2D/drawImage
            game.drawImage(snakeImage, 257, 64, 63, 63, x, y, size, size);
            break;
        case "RIGHT":
            // https://developer.mozilla.org/ru/docs/Web/API/CanvasRenderingContext2D/drawImage
            game.drawImage(snakeImage, 256, 0, 63, 63, x, y, size, size);
            break;
        case "LEFT":
            // https://developer.mozilla.org/ru/docs/Web/API/CanvasRenderingContext2D/drawImage
            game.drawImage(snakeImage, 190, 64, 63, 63, x, y, size, size);
            break;
    } 
}

function renderSnake() {
    let size = height / rows;
    for (let i = 0; i < snake.length - 1; i++) { // в цикл не попадут первый и последний элемент
        let s = snake[i];
        game.fillStyle = "blue";
        let y = s.row * size;
        let x = s.column * size;
        game.beginPath();
        game.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
        game.fill();
    }
    renderHead();
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
        eatFood();
    } else {
        snake.shift();
    }
    snake.push({
        row,
        column
    });
}

function eatFood() {
    fruitsCount++;
    document.getElementById("fruits-count").innerText = fruitsCount + " шт";
    food = generateFood();
    intervalTimeout -= intervalTimeout * 0.1;
    changeInterval();
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
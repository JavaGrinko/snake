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
let badFoodImages = [];
loadBadFoodImages("images/badfood.png");
let food = generateFood();
let badFood;
let snakeImage = new Image();
snakeImage.src = "images/snake.png";
let time = 0;
let fruitsCount = 0;
let hints = [];
let level = 0;

function addHint(message, color, x, y) {
    hints.push({
        message,
        color,
        x,
        y,
        alpha: 1
    });
}

function renderHints() {
    for (let hint of hints) {
        hint.y -= 10;
        hint.alpha -= 0.1;
        if (hint.alpha <= 0) {
            hints = hints.filter(it => it !== hint);
            continue;
        }
        game.globalAlpha = hint.alpha;
        game.fillStyle = hint.color;
        game.font = "bold 30px PixelFont";
        game.fillText(hint.message, hint.x, hint.y);
        game.globalAlpha = 1;
    }
}

const levels = [{
    fruitsCount: 0,
    background: "images/bg.jpg"
}, {
    fruitsCount: 3,
    background: "images/bg2.jpeg"
}, {
    fruitsCount: 60,
    background: "images/bg3.jpg"
}, {
    fruitsCount: 90,
    background: "images/bg4.jpg"
}, {
    fruitsCount: 120,
    background: "images/bg5.jpg"
}];

function loadFoodImages(url) {
    let image = new Image();
    image.src = url;
    foodImages.push(image);
}


function loadBadFoodImages(url) {
    let image = new Image();
    image.src = url;
    badFoodImages.push(image);
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
    let input = document.getElementById("name");
    let error = document.getElementById("error");
    let playerName = document.getElementById("player-name");
    document.getElementById("start").onclick = () => {
        let name = input.value;
        if (!name || name.length < 0) {
            error.innerText = "Имя пустое, введите имя";
            error.style['display'] = 'block';
        } else {
            playerName.innerText = "Игрок: " + input.value;
            changeInterval();
            document.getElementById("registration").style["display"] = "none";
        }
    }
}


function generateBadFood() {
    let row = Math.round(Math.random() * (rows - 1));
    let column = Math.round(Math.random() * (columns - 1));
    let imageIndex = Math.round(Math.random() * (badFoodImages.length - 1));
    let image = badFoodImages[imageIndex];
    if (checkPosition(row, column)) {
        return { row, column, image }
    } else {
        console.log('место занято, еще одна попытка');
        return generateBadFood();
    }
}

setInterval(() => {
    badFood = generateBadFood();
}, 5000);

function generateFood() {
    let row = Math.round(Math.random() * (rows - 1));
    let column = Math.round(Math.random() * (columns - 1));
    let imageIndex = Math.round(Math.random() * (foodImages.length - 1));
    let image = foodImages[imageIndex];
    if (checkPosition(row, column)) {
        return { row, column, image }
    } else {
        console.log('место занято, еще одна попытка');
        return generateFood();
    }
}

function checkPosition(row, column) {
    if (row === 0) return false;
    for (let s of snake) {
        if (s.row === row && s.column === column) {
            return false;
        }
    }
    return true;
}

function renderFood() {
    let size = height / rows;
    let y = food.row * size;
    let x = food.column * size;
    game.drawImage(food.image, x, y, size, size);
}

function renderBadFood() {
    if (!badFood) return; // если нет плохой еды, то не рендерим
    let size = height / rows;
    let y = badFood.row * size;
    let x = badFood.column * size;
    game.drawImage(badFood.image, x, y, size, size);
}

function render() {
    game.clearRect(0, 0, width, height);
    renderLevel();
    renderSnake();
    renderFood();
    renderBadFood();
    renderTimer();
    renderHints();
}

function renderLevel() {
    for (let i = levels.length - 1; i >= 0; i--) {
        if (fruitsCount >= levels[i].fruitsCount) {
            let newBackground = levels[i].background;
            document.querySelector(".wrapper").style["background-image"] = "url(" + newBackground + ")";
            setActiveLevel(i);
            if (level != i) {
                addHint('Новый уровень!', '#00ff00', width / 2 - 100, height / 2);
                level = i;
            }
            return;
        }
    }
}

function setActiveLevel(level) {
    let preLevel = document.querySelector(`.level:nth-child(${level + 1})`);
    if (preLevel) preLevel.classList.remove("level-active");
    let activeLevel = document.querySelector(`.level:nth-child(${level + 2})`);
    if (activeLevel) activeLevel.classList.add("level-active");
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
    if (isBadFood(row, column)) {
        poisoning();
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

function poisoning() {
    if (!badFood) return;
    let size = height / rows;
    let y = badFood.row * size;
    let x = badFood.column * size;
    addHint("Фуууу, бяка", '#ff0000', x, y);
    badFood = generateBadFood();
}

function eatFood() {
    let size = height / rows;
    let y = food.row * size;
    let x = food.column * size;
    addHint("Ням-ням", '#ff0000', x, y);
    fruitsCount++;
    document.getElementById("fruits-count").innerText = fruitsCount + " шт";
    food = generateFood();
    intervalTimeout -= intervalTimeout * 0.1;
    changeInterval();
}

function isFood(row, column) {
    return food.row === row && food.column === column;
}

function isBadFood(row, column) {
   return badFood && badFood.row === row && badFood.column === column;
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
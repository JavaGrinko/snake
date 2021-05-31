let height;
let width;
const rows = 10;
const columns = 10;
const snake = [{
    row: 5,
    column: 0
}];
let direction = "RIGHT";
let game;

window.onload = () => {
    console.log("Скрипты подключены");
    let canvas = document.getElementById("canvas");
    game = canvas.getContext("2d");
    height = canvas.clientHeight;
    width = height;
    canvas.width = width * 1.5;
    canvas.height = height;
    setInterval(() => {
        moveSnake()
        render();
    }, 1000);
}

function render() {
    game.clearRect(0, 0, width, height);
    renderSnake();
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
            snake.push({
                row: head.row,
                column: head.column + 1
            });
    }
    snake.shift(); // удаляем хвостовой элемент
}

function getHead() {
    return snake[snake.length - 1];
}
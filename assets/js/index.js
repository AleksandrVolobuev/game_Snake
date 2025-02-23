const gameArea = document.querySelector(".gameArea");
const gameMusic = document.querySelector(".gameMusic");
const scoreDisplay = document.querySelector(".score");
const gameOverText = document.querySelector(".gameOverText");

gameMusic.volume = 0.5; // Громкость музыки

let score = 0; // Счётчик съеденных яблок
const tileSize = 50; // Размер плитки
let snake = [{ x: 200, y: 200 }]; // Начальная позиция змейки
let direction = "RIGHT"; // Начальное направление
let food = { x: 100, y: 100 }; // Начальная позиция еды
let gameOver = false; // Флаг окончания игры
let musicStarted = false; // Флаг для отслеживания запуска музыки
let obstacles = []; // Массив препятствий
let delay = 250; // Начальная задержка (скорость игры)

// Запуск музыки
function startMusic() {
  if (!musicStarted) {
    gameMusic.play();
    musicStarted = true;
  }
}

// Функция для отрисовки змейки
function drawSnake() {
  gameArea.innerHTML = "";
  snake.forEach(segment => {
    const snakeSegment = document.createElement("img");
    snakeSegment.className = "snake";
    snakeSegment.src = "./assets/img/snake1.png";
    snakeSegment.style.position = "absolute";
    snakeSegment.style.left = `${segment.x}px`;
    snakeSegment.style.top = `${segment.y}px`;
    gameArea.appendChild(snakeSegment);
  });
}

// Функция для отрисовки еды
function drawFood() {
  const foodElement = document.createElement("img");
  foodElement.className = "food";
  foodElement.src = "./assets/img/apple.png";
  foodElement.style.position = "absolute";
  foodElement.style.left = `${food.x}px`;
  foodElement.style.top = `${food.y}px`;
  gameArea.appendChild(foodElement);
}

// Функция для отрисовки препятствий
function drawObstacles() {
  obstacles.forEach(obstacle => {
    const obstacleElement = document.createElement("img");
    obstacleElement.className = "obstacle";
    obstacleElement.src = "./assets/img/weel.png";
    obstacleElement.style.position = "absolute";
    obstacleElement.style.left = `${obstacle.x}px`;
    obstacleElement.style.top = `${obstacle.y}px`;
    gameArea.appendChild(obstacleElement);
  });
}

// Функция генерации новой еды
function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * (gameArea.clientWidth / tileSize)) * tileSize,
      y: Math.floor(Math.random() * (gameArea.clientHeight / tileSize)) * tileSize,
    };
  } while (
    snake.some(seg => seg.x === newFood.x && seg.y === newFood.y) ||
    obstacles.some(obs => obs.x === newFood.x && obs.y === newFood.y)
  );
  return newFood;
}

// Управление змейкой
document.addEventListener("keydown", (event) => {
  startMusic();
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Обновление игры
function update() {
  if (gameOver) return;

  let head = { ...snake[0] };
  if (direction === "UP") head.y -= tileSize;
  if (direction === "DOWN") head.y += tileSize;
  if (direction === "LEFT") head.x -= tileSize;
  if (direction === "RIGHT") head.x += tileSize;

  // Проверка столкновений
  if (
    head.x < 0 || head.x >= gameArea.clientWidth ||
    head.y < 0 || head.y >= gameArea.clientHeight ||
    snake.some(seg => seg.x === head.x && seg.y === head.y) ||
    obstacles.some(obs => obs.x === head.x && obs.y === head.y)
  ) {
    gameOver = true;
    gameMusic.pause();
    gameOverText.style.opacity = "1";
    gameOverText.style.fontSize = "150px";
    return;
  }

  snake.unshift(head);

  // Проверка, съела ли змейка яблоко
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = `Яблок съедено: ${score}`;
    food = generateFood();

    // Генерация нового препятствия
    let newObstacle;
    do {
      newObstacle = {
        x: Math.floor(Math.random() * (gameArea.clientWidth / tileSize)) * tileSize,
        y: Math.floor(Math.random() * (gameArea.clientHeight / tileSize)) * tileSize,
      };
    } while (
      snake.some(seg => seg.x === newObstacle.x && seg.y === newObstacle.y) ||
      (food.x === newObstacle.x && food.y === newObstacle.y)
    );
    obstacles.push(newObstacle);

    // Уменьшаем задержку (увеличиваем скорость), но не меньше 50 мс
    delay = Math.max(delay - 1, 50);
  } else {
    snake.pop();
  }
}

// Игровой цикл
function gameLoop() {
  update();
  drawSnake();
  drawFood();
  drawObstacles();
  if (!gameOver) setTimeout(gameLoop, delay);
}

// Запуск игры
gameLoop();

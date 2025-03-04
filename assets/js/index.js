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

// Универсальная функция отрисовки объектов
function drawObject(object, className, imageSrc) {
  const element = document.createElement("img");
  element.className = className;
  element.src = imageSrc;
  element.style.position = "absolute";
  element.style.left = `${object.x}px`;
  element.style.top = `${object.y}px`;
  gameArea.appendChild(element);
}

// Функция отрисовки змейки
function drawSnake() {
  gameArea.innerHTML = "";
  snake.forEach(segment => drawObject(segment, "snake", "./assets/img/snake1.png"));
}

// Функция отрисовки еды
function drawFood() {
  drawObject(food, "food", "./assets/img/apple.png");
}

// Функция отрисовки препятствий
function drawObstacles() {
  obstacles.forEach(obstacle => drawObject(obstacle, "obstacle", "./assets/img/weel.png"));
}

// Универсальная функция генерации объектов (еда или препятствия)
function generateGameObject(existingObjects) {
  let newObject;
  do {
    newObject = {
      x: Math.floor(Math.random() * (gameArea.clientWidth / tileSize)) * tileSize,
      y: Math.floor(Math.random() * (gameArea.clientHeight / tileSize)) * tileSize,
    };
  } while (
    snake.some(seg => seg.x === newObject.x && seg.y === newObject.y) ||
    existingObjects.some(obj => obj.x === newObject.x && obj.y === newObject.y)
  );
  return newObject;
}

// Функции для генерации еды и препятствий
function generateFood() {
  return generateGameObject(obstacles);
}

function generateObstacle() {
  return generateGameObject([...obstacles, food]); // Исключаем наложение на еду
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
    obstacles.push(generateObstacle()); // Добавляем новое препятствие
    delay = Math.max(delay - 5, 50); // Уменьшаем задержку, но не меньше 50 мс
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
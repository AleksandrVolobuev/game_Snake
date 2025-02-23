const gameArea = document.getElementById("gameArea");
const gameMusic = document.getElementById("gameMusic");
const scoreDisplay = document.getElementById("score");

gameMusic.volume = 0.5; // Установите громкость от 0.0 до 1.0

let score = 0; // Счётчик съеденных яблок
// Получаем элемент для отображения

const tileSize = 50; // Размер одной плитки
let snake = [{ x: 200, y: 200 }]; // Начальная позиция змейки
let direction = "RIGHT"; // Начальное направление
let food = { x: 100, y: 100 }; // Начальная позиция еды
let gameOver = false; // Переменная окончания игры
let musicStarted = false; // Флаг для отслеживания запуска музыки

// Функция для запуска музыки
function startMusic() {
  if (!musicStarted) {
    gameMusic.play();
    musicStarted = true; // Устанавливаем флаг
  }
}

// Функция для отрисовки змейки
function drawSnake() {
  gameArea.innerHTML = ""; // Очищаем игровую область перед отрисовкой змейки
  snake.forEach((segment, index) => {
    const snakeSegment = document.createElement("img");
    snakeSegment.className = "snake";
    snakeSegment.src = "./assets/img/snake1.png"; // Путь к изображению змейки
    //snakeSegment.style.width = `${tileSize}px`;
    //snakeSegment.style.height = `${tileSize}px`;
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
  foodElement.src = "./assets/img/apple.png"; // Путь к изображению
  foodElement.style.left = `${food.x}px`;
  foodElement.style.top = `${food.y}px`;
  gameArea.appendChild(foodElement);
}

// Обработчик событий для управления змейкой с помощью клавиш стрелок
document.addEventListener("keydown", (event) => {
  startMusic(); // Запускаем музыку при нажатии клавиши

  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Функция обновления состояния игры
function update() {
  if (gameOver) return; // Если игра окончена, выходим из функции

  // Создаем новую голову змейки на основе текущей позиции
  let head = { ...snake[0] };

  // Обновляем позицию головы в зависимости от направления
  if (direction === "UP") head.y -= tileSize;
  if (direction === "DOWN") head.y += tileSize;
  if (direction === "LEFT") head.x -= tileSize;
  if (direction === "RIGHT") head.x += tileSize;

  // Проверяем на столкновения: со стенами или с телом змейки
  if (
    head.x < 0 ||
    head.x >= gameArea.clientWidth ||
    head.y < 0 ||
    head.y >= gameArea.clientHeight ||
    snake.some((seg) => seg.x === head.x && seg.y === head.y)
  ) {
    gameOver = true; // Устанавливаем флаг окончания игры
    gameMusic.pause(); // Останавливаем музыку при окончании игры

    // Показать Game Over
    const gameOverText = document.getElementById("gameOverText");
    gameOverText.style.opacity = "1";
    gameOverText.style.fontSize = "100px"; // Увеличиваем размер

    return;
  }

  // Добавляем новую голову к змейке
  snake.unshift(head);

  // Проверяем, съела ли змейка еду
  if (head.x === food.x && head.y === food.y) {
    score++; // Увеличиваем счётчик
    scoreDisplay.textContent = `Яблок съедено: ${score}`; // Обновляем текст

    // Если да, генерируем новую еду в случайной позиции
    food = {
      x:
        Math.floor(Math.random() * (gameArea.clientWidth / tileSize)) *
        tileSize,
      y:
        Math.floor(Math.random() * (gameArea.clientHeight / tileSize)) *
        tileSize,
    };
  } else {
    // Если еда не съедена, убираем последний сегмент змейки
    snake.pop();
  }
}

// Основной игровой цикл
function gameLoop() {
  update(); // Обновляем состояние игры
  drawSnake(); // Рисуем змейку
  drawFood(); // Рисуем еду
  if (!gameOver) setTimeout(gameLoop, 200); // Если игра не окончена, повторяем цикл через 200 мс
}

// Запускаем игровой цикл
gameLoop();

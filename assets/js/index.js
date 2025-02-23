// Создаем элемент canvas и добавляем его на страницу
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = 1000; // Ширина канваса
canvas.height = 800; // Высота канваса

const tileSize = 20; // Размер одной плитки (ширина и высота квадрата)
let snake = [{ x: 200, y: 200 }]; // Начальная позиция змейки
let direction = "RIGHT"; // Начальное направление движения змейки
let food = { x: 100, y: 100 }; // Начальная позиция еды
let gameOver = false; // Переменная, указывающая, окончена ли игра

// Обработчик событий для управления змейкой с помощью клавиш стрелок
document.addEventListener("keydown", (event) => {
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
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        gameOver = true; // Устанавливаем флаг окончания игры
        alert("Game Over"); // Уведомляем игрока о конце игры
        return;
    }

    // Добавляем новую голову к змейке
    snake.unshift(head);
    
    // Проверяем, съела ли змейка еду
    if (head.x === food.x && head.y === food.y) {
        // Если да, генерируем новую еду в случайной позиции
        food = {
            x: Math.floor(Math.random() * (canvas.width / tileSize)) * tileSize,
            y: Math.floor(Math.random() * (canvas.height / tileSize)) * tileSize
        };
    } else {
        // Если еда не съедена, убираем последний сегмент змейки
        snake.pop();
    }
}

// Функция для рисования элементов на канвасе
function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Полупрозрачный черный цвет
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Рисуем фон
  
  ctx.fillStyle = "red"; // Задаем цвет еды
  ctx.beginPath();
  ctx.arc(food.x + tileSize / 2, food.y + tileSize / 2, tileSize / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "green"; // Задаем цвет змейки
  snake.forEach(segment => {
      ctx.beginPath();
      ctx.arc(segment.x + tileSize / 2, segment.y + tileSize / 2, tileSize / 2, 0, Math.PI * 2);
      ctx.fill();
  });
}


// Основной игровой цикл
function gameLoop() {
    update(); // Обновляем состояние игры
    draw(); // Рисуем текущие состояния
    if (!gameOver) setTimeout(gameLoop, 200); // Если игра не окончена, повторяем цикл через 200 мс
}

// Запускаем игровой цикл
gameLoop();

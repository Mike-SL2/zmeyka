// --- v.4.8 Змейка ООП - Автор Слугин М.В. zmey.js
let direction;
let x;
let y;
const keyRepeat = false;
let playTimer;
let appleX;
let appleY;
let sccnt;
let snake = [];
let snakeLength;
const tail = "green";
const head = "red";
const appl = "apple";
const none = "none";
const rnd = (min = 0, max = 0, last = 0.5) => {
  let aux1;
  if (isNaN(min)) {
    min = 0;
  }
  if (isNaN(max)) {
    max = 0;
  }
  if (isNaN(last)) {
    last = 0.5;
  }
  if (min == max) return min;
  else {
    if (min > max) {
      aux1 = min;
      min = max;
      max = aux1;
    }
  }
  aux1 = max - min + 1;
  const rnd = () => min + Math.floor(Math.random() * aux1);
  let first = rnd();
  while (last === first) {
    first = rnd();
  }
  return first;
};
const view = [
  '<div id="scoreWindow"></div>',
  '<div id="record"></div>',
  '<div id="playground"></div>',
  '<button id="btnRestart">Restart</button>',
];
const center = document.querySelector(".center");
view.forEach((i) => {
  center.insertAdjacentHTML("beforeend", i);
});
const restartBtn = document.getElementById("btnRestart");
const scoreW = document.getElementById("scoreWindow");
function score(s = 0) {
  s = `Cчёт : ${s}`;
  scoreW.innerHTML = s;
}

const recordW = document.getElementById("record");
function record(r = 0) {
  recordW.innerHTML = `Рекорд : ${r}`;
  if (r) {
    recordW.style.opacity = 1;
  } else {
    recordW.style.opacity = 0;
  }
}
const playground = document.getElementById("playground");
for (let y = 1; y < 11; y++) {
  for (let x = 1; x < 11; x++) {
    playground.insertAdjacentHTML(
      "beforeend",
      `<div class="backCell"><div class="playCell" data-x="${x}" data-y="${y}"></div></div>`,
    );
  }
}

const cells = document.querySelectorAll(".playCell");
function cell(x, y) {
  let cellNumber = 0;
  cells.forEach((i, count) => {
    if (i.dataset.x == x && i.dataset.y == y) {
      cellNumber = count;
    }
  });
  return cells[cellNumber];
}
const cellsBack = document.querySelectorAll(".backCell");
let lightOrDark = true;
let cellcount = 0;
for (let i = 1; i < 11; i++) {
  lightOrDark = !lightOrDark;
  for (let j = 1; j < 11; j++) {
    lightOrDark = !lightOrDark;
    if (lightOrDark) {
      cellsBack[cellcount].style.background = "gainsboro";
    } else {
      cellsBack[cellcount].style.background = "darkgray";
    }

    cellcount++;
  }
}
function unPaint(x, y, c3) {
  switch (c3.className) {
    case "playCell clRed":
      c3.classList.remove("clRed");
      break;
    case "playCell clGreen":
      c3.classList.remove("clGreen");
      break;
    case "playCell redCircle":
      c3.classList.remove("redCircle");
  }
}

function paint(x, y, color) {
  let c2 = cell(x, y);
  unPaint(x, y, c2);
  switch (color) {
    case "apple":
      c2.classList.add("redCircle");
      break;
    case "red":
      c2.classList.add("clRed");
      break;
    case "green":
      c2.classList.add("clGreen");
  }
}

function gameEnd() {
  clearInterval(playTimer);
  record(sccnt);
  restartBtn.style.display = "block";
  if (sccnt > lastRecord) {
    localStorage.setItem("recordKey", sccnt);
  }
}

function appleDefine() {
  let freeCells = [];
  let appleCellNumber;
  let freeCellsQuantity = 0;
  cells.forEach((i, count) => {
    if (i.className === "playCell") {
      freeCells.push(count);
      freeCellsQuantity++;
    }
  });
  if (freeCellsQuantity) {
    appleCellNumber = freeCells[rnd(freeCellsQuantity - 1)];
  } else {
    gameEnd();
  }
  appleX = cells[appleCellNumber].dataset.x * 1;
  appleY = cells[appleCellNumber].dataset.y * 1;
}

document.addEventListener("keydown", function (event) {
  if ((!event.repeat || keyRepeat) && playTimer) {
    switch (event.code) {
      case "ArrowUp":
        if (direction != "Down") {
          direction = "Up";
        }
        break;
      case "ArrowDown":
        if (direction != "Up") {
          direction = "Down";
        }
        break;
      case "ArrowRight":
        if (direction != "Left") {
          direction = "Right";
        }
        break;
      case "ArrowLeft":
        if (direction != "Right") {
          direction = "Left";
        }
    }
  }
});

function rightOrLeft() {
  if (x < 5) {
    direction = "Right";
    x++;
  } else {
    direction = "Left";
    x--;
  }
}
function upOrDown() {
  if (y < 5) {
    direction = "Down";
    y++;
  } else {
    direction = "Up";
    y--;
  }
}

class Cell {
  _collision = false;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  collide(cell) {
    if (this.x === cell.x && this.y === cell.y) {
      this.bump(cell);
    }
  }
  bump(cell) {}
  destroy() {
    // убирает клетку
    paint(appleX, appleY, none);
  }
}

class Head extends Cell {
  showHead() {
    paint(this.x, this.y, head);
  }
  bump(cell) {
    if (cell instanceof Tail) {
      //укус за хвост - завершение игры
      gameEnd();
    }
    if (cell instanceof Apple) {
      // яблоко
      sccnt++;
      score(sccnt);
      this._collision = true;
    }
  }
  get collisionState() {
    return this._collision;
  }
}

class Tail extends Cell {
  showTail() {
    paint(this.x, this.y, tail);
  }
}

class Apple extends Cell {
  showApple() {
    paint(this.x, this.y, appl);
  }
  bump(cell) {
    if (cell instanceof Head) {
      this.destroy();
      paint(appleX, appleY, head);
      appleDefine();
      tailLength++;
    }
  }
}

class Game {
  newApple() {
    appleDefine();
  }
  play(direction) {
    let trail;
    let snakeAUX;
    let lastCollide;
    if (snakeLength < tailLength) {
      snakeLength++;
    } else {
      snakeAUX = snake[snakeLength];
      paint(snakeAUX[0], snakeAUX[1], none);
      snake.pop();
    }
    switch (direction) {
      case "Up":
        y--;
        if (y < 1) {
          y = 1;
          rightOrLeft();
        }
        break;
      case "Down":
        y++;
        if (y > 10) {
          y = 10;
          rightOrLeft();
        }
        break;
      case "Right":
        x++;
        if (x > 10) {
          x = 10;
          upOrDown();
        }
        break;
      case "Left":
        x--;
        if (x < 1) {
          x = 1;
          upOrDown();
        }
    }
    snake.unshift([x, y]);
    snakeAUX = snake[0];
    let head = new Head(snakeAUX[0], snakeAUX[1]);
    head.showHead();
    snakeAUX = snake[1];
    let tail = new Tail(snakeAUX[0], snakeAUX[1]);
    tail.showTail();

    snake.forEach((i, count) => {
      if (count) {
        trail = new Tail(i[0], i[1]);
        head.collide(trail);
      }
    });
    let apple = new Apple(appleX, appleY);
    apple.collide(head);
    head.collide(apple);
    if (head.collisionState) {
      paint(appleX, appleY, appl);
    }
  }
}
const game = new Game();

function callInit2() {
  playTimer = 0;
  x = rnd(3, 7);
  y = rnd(3, 7);
  if (rnd(1)) {
    direction = "Right";
    snake = [
      [x, y],
      [x - 1, y],
    ];
  } else {
    direction = "Left";
    snake = [
      [x, y],
      [x + 1, y],
    ];
  }
  tailLength = 1;
  snakeLength = 0;
  cells.forEach((i) => {
    paint(i.dataset.x, i.dataset.y, none);
  });
  sccnt = 0;
  score();
  lastRecord = localStorage.getItem("recordKey");
  if (lastRecord) {
    record(lastRecord);
  } else {
    record();
  }
  game.play(direction);
  game.newApple();
  restartBtn.style.display = "none";
}
function gameStart() {
  if (!playTimer) {
    let apple = new Apple(appleX, appleY);
    apple.showApple();
    playTimer = setInterval(function () {
      game.play(direction);
    }, 500);
  }
}

restartBtn.addEventListener("click", function () {
  callInit2();
  gameStart();
});
callInit2();
playground.addEventListener("click", function () {
  gameStart();
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let paddleHeight = 100, paddleWidth = 15;
let leftY = canvas.height / 2 - paddleHeight / 2;
let rightY = canvas.height / 2 - paddleHeight / 2;
let puckX = canvas.width / 2, puckY = canvas.height / 2;
let puckSpeedX = 6, puckSpeedY = 4;
let leftScore = 0, rightScore = 0;
const maxScore = 5;
let gameOver = false;
let fadeAlpha = 0;

// 🎨 رنگ‌ها و فونت‌ها
const colors = {
  bg: "#000",
  line: "#444",
  left: "#FFD700", // طلایی
  right: "#00FFFF", // آبی روشن
  puck: "#fff",
  text: "#fff",
  winner: "#ff0"
};

// رسم بازی
function draw() {
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // خط وسط
  ctx.strokeStyle = colors.line;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // راکت‌ها
  ctx.fillStyle = colors.left;
  ctx.fillRect(20, leftY, paddleWidth, paddleHeight);
  ctx.fillStyle = colors.right;
  ctx.fillRect(canvas.width - 35, rightY, paddleWidth, paddleHeight);

  // دیسک با سایه
  ctx.shadowColor = "#fff";
  ctx.shadowBlur = 10;
  ctx.fillStyle = colors.puck;
  ctx.beginPath();
  ctx.arc(puckX, puckY, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // امتیاز
  ctx.font = "bold 36px Arial";
  ctx.fillStyle = colors.text;
  ctx.fillText(leftScore, canvas.width / 4, 50);
  ctx.fillText(rightScore, canvas.width * 3 / 4, 50);

  // پایان بازی با افکت Fade
  if (gameOver) {
    fadeAlpha += 0.02;
    ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = colors.winner;
    ctx.font = "bold 48px Arial";
    ctx.fillText("🏆 Game Over", canvas.width / 2 - 150, canvas.height / 2 - 20);
    ctx.font = "32px Arial";
    let winner = leftScore > rightScore ? "Left Player Wins!" : "Right Player Wins!";
    ctx.fillText(winner, canvas.width / 2 - 130, canvas.height / 2 + 30);
  }
}

// به‌روزرسانی
function update() {
  if (gameOver) return;

  puckX += puckSpeedX;
  puckY += puckSpeedY;

  if (puckY <= 0 || puckY >= canvas.height) puckSpeedY *= -1;

  if (puckX <= 35 && puckY > leftY && puckY < leftY + paddleHeight)
    puckSpeedX *= -1;

  if (puckX >= canvas.width - 35 && puckY > rightY && puckY < rightY + paddleHeight)
    puckSpeedX *= -1;

  if (puckX < 0) {
    rightScore++;
    resetPuck();
  }
  if (puckX > canvas.width) {
    leftScore++;
    resetPuck();
  }

  if (leftScore >= maxScore || rightScore >= maxScore) {
    gameOver = true;
  }
}

function resetPuck() {
  puckX = canvas.width / 2;
  puckY = canvas.height / 2;
  puckSpeedX *= -1;
  puckSpeedY = (Math.random() > 0.5 ? 1 : -1) * 4;
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// کنترل با کیبورد
document.addEventListener("keydown", (e) => {
  if (e.key === "w") leftY -= 20;
  if (e.key === "s") leftY += 20;
  if (e.key === "ArrowUp") rightY -= 20;
  if (e.key === "ArrowDown") rightY += 20;
});

// کنترل لمسی روان‌تر
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  for (let touch of e.touches) {
    let x = touch.clientX;
    let y = touch.clientY;

    if (x < canvas.width / 2) leftY = y - paddleHeight / 2;
    else rightY = y - paddleHeight / 2;
  }
});

gameLoop();
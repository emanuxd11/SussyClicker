var score = parseInt(localStorage.getItem("score") || 0);
var scoreElement = document.getElementById("score");
var lastTime = Date.now();

scoreElement.textContent = "Sussy Meter: " + score;

function updateScore() {
  var currentTime = Date.now();
  var deltaTime = currentTime - lastTime;
  var secondsPassed = Math.floor(deltaTime / 1000);

  if (secondsPassed >= 1) {
    score += secondsPassed;
    scoreElement.textContent = "Sussy Meter: " + score;
    lastTime = currentTime;
  }

  localStorage.setItem("score", score);

  requestAnimationFrame(updateScore);
}

requestAnimationFrame(updateScore);

// Button click event to manually increase the score
var sussyButton = document.getElementById("sussyButton");
sussyButton.addEventListener("click", function() {
  score++;
  scoreElement.textContent = "Sussy Meter: " + score;
});


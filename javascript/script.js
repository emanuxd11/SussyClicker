var score = parseInt(localStorage.getItem("score") || 0);
var scoreElement = document.getElementById("score");
scoreElement.textContent = "Sussy Meter: " + score;
var lastTime = Date.now();

// the total clicks per second that gets updated with each buy
var cpsElement = document.getElementById("cps");
var cps = parseInt(localStorage.getItem("cps") || 0);
cpsElement.textContent = "Total CPS: " + cps;

// to reset everything
cps=0;
localStorage.setItem("cps", 0);
score=0;

function buy_helper(name) {
  $.ajax({
    url: '../actions/buy_helper.php',
    method: 'POST',
    data: {
      name: name
    },
    dataType: 'json',
    success: function(response) {
      $.getJSON('../content/helpers.json', function(helpers) {
        for (var key in helpers) {
          var entry = helpers[key];
          cps += entry["cps"] * entry["quantity"];
        }

        cpsElement.textContent = "Total CPS: " + cps;
        localStorage.setItem("cps", cps);
      });
      console.log(response);
    },
    error: function(xhr, status, error) {
      // bruh moment
      console.error(error);
    }
  });
}

function updateScore() {
  var currentTime = Date.now();
  var deltaTime = currentTime - lastTime;
  var secondsPassed = Math.floor(deltaTime / 1000);

  if (secondsPassed >= 1) {
    // update score each second with the number of clicks per second
    score += secondsPassed * cps;
    scoreElement.textContent = "Sussy Meter: " + score;
    lastTime = currentTime;
  }

  localStorage.setItem("score", 0);

  requestAnimationFrame(updateScore);
}

requestAnimationFrame(updateScore);

// Increase score on click
var sussyButton = document.getElementById("sussyButton");
sussyButton.addEventListener("click", function() {
  score++;
  scoreElement.textContent = "Sussy Meter: " + score;
});


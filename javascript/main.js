// define helper stats
const helpers = [
  {
    name: "Sussy Baka",
    cost: 15,
    cps: 0.1,
    description: "epic sussy baka super susuyssysysysy",
    icon: "images/helpers/SussyBaka.png",
    quantity: 0
  },
  {
    name: "PewDiePie",
    cost: 100,
    cps: 1,
    description: "what a fucking- (dies)",
    icon: "images/helpers/PewDiePie.gif",
    quantity: 0
  },
  {
    name: "John Cena",
    cost: 1000,
    cps: 100,
    description: "greetings, china. I have ice cream... YOU CAN'T SEE ME, MY TIME IS NOW111!!!",
    icon: "images/helpers/JohnCena.png",
    quantity: 0
  }
];

// get score from local storage
var score = 0;
var scoreElement = document.getElementById("score");
scoreElement.textContent = "Sussy Meter: " + score;
var lastTime = Date.now();

// increase score on click
var sussyButton = document.getElementById("sussyButton");
sussyButton.addEventListener("click", function() {
  score++;
  scoreElement.textContent = "Sussy Meter: " + score;
});


function generateHelperList() {
  const helperList = document.getElementById("helper-list");

  helperList.innerHTML = "";

  for (const helper of helpers) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <button id="buyable-helper">
        <img src="${helper.icon}" alt="${helper.name}">
        <p>${helper.name}</p>
        <p>Offers: ${helper.cps} sus/s</p>
        <p>Cost: ${helper.cost} sussies</p>
      </button>`;

    helperList.appendChild(listItem);

    if (helper.quantity === 0) {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <button id="mistery-helper">
          <img src="images/helpers/mistery.png" alt"mistery helper">
          <p>Unknown</p>
          <p>Offers: ? sus/s</p>
          <p>Cost: ?</p>
        </button>`;

      helperList.appendChild(listItem);

      break;
    }
  }
}

generateHelperList();


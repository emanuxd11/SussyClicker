// sometimes useful to reset the game while testing
// localStorage.clear()

/*
 * Set initial game parameters
 */

let score = getScore();
let sus_per_second = getSPS();
const helpers = getHelpers();

displayScore();
displaySPS();
generateHelperList();

// update score based on sus per second
setInterval(function() {
  score += sus_per_second;
  displayScore();
}, 1000);

// update title with score
setInterval(function() {
  if (score > 0) {
    document.title = parseInt(score) + " sus - Sussy Clicker";
  }
}, 5000);


/*
 * Handle local storage
 */

function setLocalStorage(name, value) {
  localStorage.setItem(name, value);
}

function getScore() {
  return parseInt(localStorage.getItem("score")) || 0;
}

function getSPS() {
  return parseFloat(localStorage.getItem("sps")) || 0;
}

function getHelpers() {
  return JSON.parse(localStorage.getItem("helpers")) || [
    {
      name: "Sussy Baka",
      base_cost: 15,
      cost: 15,
      base_sps: 0.1,
      sps: 0.1,
      description: "epic sussy baka super susuyssysysysy",
      icon: "images/helpers/SussyBaka.png",
      quantity: 0,
      sound_path: "sound/helpers/SussyBaka/",
      sfx_quantity: 3
    },
    {
      name: "PewDiePie",
      base_cost: 100,
      cost: 100,
      base_sps: 1,
      sps: 1,
      description: "what a fucking- (dies)",
      icon: "images/helpers/PewDiePie.gif",
      quantity: 0,
      sound_path: "sound/helpers/PewDiePie/",
      sfx_quantity: 1
    },
    {
      name: "John Cena",
      base_cost: 1100,
      cost: 1100,
      base_sps: 8,
      sps: 8,
      description: "greetings, china. I have ice cream... YOU CAN'T SEE ME, MY TIME IS NOW111!!!",
      icon: "images/helpers/JohnCena.png",
      quantity: 0,
      sound_path: "sound/helpers/JohnCena/",
      sfx_quantity: 2
    },
    {
      name: "Turing Machine",
      base_cost: 12000,
      cost: 12000,
      base_sps: 47,
      sps: 47,
      description: "A mathematical model of computation developed by Supicious Turing III with the goal of sussyfying the world",
      icon: "images/helpers/TuringMachine.jpg",
      quantity: 0,
      sound_path: "sound/helpers/TuringMachine/",
      sfx_quantity: 1
    },
    {
      name: "António Costa's Sus Son",
      base_cost: 130000,
      cost: 130000,
      base_sps: 260,
      sps: 260,
      description: "What's more sus than AC? AC and his son Boss AC",
      icon: "images/helpers/AntonioCosta.gif",
      quantity: 0,
      sound_path: "sound/helpers/FilhosACosta/",
      sfx_quantity: 1
    },
    {
      name: "Among Sus",
      base_cost: 1400000,
      cost: 1400000,
      base_sps: 1400,
      sps: 1400,
      description: "You can't see them but they're among sus...",
      icon: "images/helpers/AmongSus.gif",
      quantity: 0,
      sound_path: "sound/helpers/AmongSus/",
      sfx_quantity: 3
    }
  ];
}

function updateLocalStorage() {
  setLocalStorage("score", score);
  setLocalStorage("sps", sus_per_second);
  setLocalStorage("helpers", JSON.stringify(helpers));

  console.log("updated local storage");
}

setInterval(updateLocalStorage, 2 * 60 * 1000);

window.addEventListener("beforeunload", function() {
  updateLocalStorage();
});


/*
 * Display functions
 */

function displayScore() {
  document.getElementById("score").textContent = "Sussy Meter: " + parseInt(score);
}

function displaySPS() {
  let stringval = "";
  if (Number.isInteger(parseFloat(sus_per_second.toFixed(1)))) {
    stringval = "Total sus/s: " + Math.round(sus_per_second);
  } else {
    stringval = "Total sus/s: " + sus_per_second.toFixed(1);
  }

  document.getElementById("sps").textContent = stringval;
}

function generateHelperList() {
  const helper_list = document.getElementById("helper_list");

  helper_list.innerHTML = "";

  for (let i = 0; i < helpers.length; i++) {
    const helper = helpers[i];

    const list_item = document.createElement("li");
    
    list_item.innerHTML = `
      <button id="${helper.name}" class="buyable_helper">
        <img src="${helper.icon}" alt="${helper.name}">
        <p>${helper.name}</p>
        <p>Offers: ${helper.sps} sus/s</p>
        <p>Cost: ${Math.ceil(helper.cost)} sussies</p>
        <p>Owned: ${helper.quantity}</p>
      </button>`;

    helper_list.appendChild(list_item);

    document.getElementById(helper.name).addEventListener('click', function() {
      buyHelper(helper);

      console.log(helper.name + " quantity is " + helper.quantity);
      console.log("current score is " + score);
    });

    // add the mystery one in case the next isn't owned
    if (helper.quantity === 0 && i < helpers.length - 1) {
      const list_item = document.createElement("li");
      list_item.innerHTML = `
        <button id="mistery_helper">
          <img src="images/helpers/mistery.png" alt"mistery helper">
          <p>Unknown</p>
          <p>Offers: ? sus/s</p>
          <p>Cost: ?</p>
          <p></p>
        </button>`;

      helper_list.appendChild(list_item);

      break;
    }
  }
}


/*
 * Game functionality
 */

let sussy_button = document.getElementById("sussy_button");
sussy_button.addEventListener("click", function() {
  score++;
  displayScore();
  playAudio('sound/general/clickboom.mp3');
});

function updateSingleSPS(helper) {
  sus_per_second += helper.sps;
  displaySPS();
}

function increaseHelperCost(helper) {
  helper.cost *= 1.15
}

function playAudio(path) {
  let audio = new Audio(path);
  audio.play();
}

function playHelperBuySFX(helper) {
  if (helper.sfx_quantity > 0) {
    let file_number = Math.floor(Math.random() * helper.sfx_quantity) + 1;
    playAudio(helper.sound_path + file_number + '.mp3')
  }
}

function buyHelper(helper) {
  if (score >= helper.cost) {
    score -= helper.cost;
    helper.quantity++;

    displayScore();
    updateSingleSPS(helper);
    increaseHelperCost(helper);

    generateHelperList();

    playHelperBuySFX(helper);
  }
}

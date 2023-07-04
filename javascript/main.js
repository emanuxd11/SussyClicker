// sometimes useful to reset the game while testing
// localStorage.clear()

/*
 * Set initial game parameters
 */

const helper_list = [
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

let score = getScore();
let sus_per_second = getSPS();
let helpers = getHelpers();
checkHelperList();

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
    document.title = formatNumber(parseInt(score)) + " sus - Sussy Clicker";
  }
}, 5000);


/*
 * Audio functionality
 * This works ok, would probably want to change the way audio is played,
 * making use of the html <audio> tag. Also make the slider number dynamic.
 * But it's good for now.
 */

let volume_level = getVolumeLevel();
let volume_mute = getVolumeMute();
updateVolumeUI();

let volume_slider = document.getElementById('volume_slider');
volume_slider.addEventListener("change", function(e) {
  volume_level = e.currentTarget.value / 100;

  updateVolumeUI();
})

let mute_button = document.getElementById('mute_button');
mute_button.addEventListener("click", function() {
  volume_mute = !volume_mute;

  updateVolumeUI();
})

function playAudio(path) {
  if (!volume_mute) {
    let audio = new Audio(path);
    audio.volume = volume_level;
    audio.play();
  }
}

function playHelperBuySFX(helper) {
  if (helper.sfx_quantity > 0) {
    let file_number = Math.floor(Math.random() * helper.sfx_quantity) + 1;
    playAudio(helper.sound_path + file_number + '.mp3')
  }
}

function updateVolumeUI() {
  let volume_slider = document.getElementById("volume_slider");
  let volume_label = document.getElementById("volume_label");
  let mute_button = document.getElementById("mute_button");

  if (volume_mute == false) {
    volume_slider.value = volume_level * 100;
    volume_label.textContent = "Volume: " + parseInt(volume_level * 100);
    mute_button.textContent = "Mute";
  } else {
    volume_label.textContent = "Volume: " + "Muted";
    mute_button.textContent = "Unmute";
  }
}


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
  return JSON.parse(localStorage.getItem("helpers")) || helper_list;
}

function getVolumeLevel() {
  return parseFloat(localStorage.getItem("volume_level")) || 0.5;
}

function getVolumeMute() {
  return localStorage.getItem("volume_mute") === "true";
}

function updateLocalStorage() {
  setLocalStorage("score", score);
  setLocalStorage("sps", sus_per_second);
  setLocalStorage("helpers", JSON.stringify(helpers));
  setLocalStorage("volume_level", volume_level);
  setLocalStorage("volume_mute", volume_mute);
}

setInterval(updateLocalStorage, 2 * 60 * 1000);

window.addEventListener("beforeunload", function() {
  updateLocalStorage();
});

// for updating the helper list when new helpers are added or something is modified
function checkHelperList() {
  // situations:
  // 1 - new buildings are added
  // 2 - building characteristics are changed
  // 3 - base cps or cost are changed: requires recalculating total cps and next buy cost

  // part 1
  let new_len = helper_list.length;
  let old_len = helpers.length;
  
  if (old_len < new_len) {
    for (let i = old_len; i < new_len; i++) {
      // to prevent me from being a dumbass and adding shit with the same name, which fucks up the buttons
      if (!helpers.some(obj => obj["name"] === helper_list.slice(i, i + 1)[0].name)) {
        helpers.push(helper_list.slice(i, i + 1)[0]);
      }
    }
  }

  // part 2
  for (let i = 0; i < helpers.length; i++) {
    if (helpers[i].icon !== helper_list[i].icon) {
      helpers[i].icon = helper_list[i].icon;
    }
    if (helpers[i].sound_path !== helper_list[i].sound_path) {
      helpers[i].sound_path = helper_list[i].sound_path;
    }
    if (helpers[i].sfx_quantity !== helper_list[i].sfx_quantity) {
      helpers[i].sfx_quantity = helper_list[i].sfx_quantity;
    }
    // do part 3 later...
  }
}

/*
 * Display functions
 */

function displayScore() {
  document.getElementById("score").textContent = "Sussy Meter: " + formatNumber(parseInt(score));
}

function displaySPS() {
  let stringval = "";
  if (Number.isInteger(parseFloat(sus_per_second.toFixed(1)))) {
    stringval = "Total sus/s: " + formatNumber(Math.round(sus_per_second));
  } else {
    stringval = "Total sus/s: " + formatNumber(Math.round(sus_per_second * 10) / 10);
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
        <p>Offers: ${formatNumber(helper.sps)} sus/s</p>
        <p>Cost: ${formatNumber(Math.ceil(helper.cost))} sussies</p>
        <p>Owned: ${formatNumber(helper.quantity)}</p>
      </button>`;

    helper_list.appendChild(list_item);

    document.getElementById(helper.name).addEventListener('click', function() {
      buyHelper(helper);
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

function formatNumber(number) {
  let suffixes = [
    "", "", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion",
    "septillion", "octillion", "nonillion", "decillion", "undecillion", "duodecillion",
    "tredecillion", "quatturodecillion", "quindecillion", "sexdecillion", "septendecillion",
    "octodecillion", "novemdecillion", "vigintillion", "duovigintillion", "tresvigintillion",
    "quattuorvigintillion", "sexavigintillion", "septavigintillion", "octovigintillion",
    "novigintillion"
  ];
  let suffix_index = 0;

  if (number >= 1000000) {
    while (number >= 1000) {
      number /= 1000;
      suffix_index++;
    }
    number = Math.round(number * 100) / 100;
  } else {
    number = number.toLocaleString();
  }

  return number + " " + suffixes[suffix_index];
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

function buyHelper(helper) {
  if (score >= helper.cost) {
    score -= helper.cost;
    displayScore();

    helper.quantity++;
    updateSingleSPS(helper);
    increaseHelperCost(helper);
    playHelperBuySFX(helper);
    generateHelperList();
  }
}

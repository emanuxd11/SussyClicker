// sometimes useful to reset the game while testing
// localStorage.clear()

/*
 * Set initial game parameters
 */

const helper_list = fetch_helper_list();
const upgrade_list = fetch_all_upgrades();

let score = getScore();
let sus_per_second = getSPS();
let helpers = getHelpers();
let upgrades = getUpgrades();
checkHelperList();

displayScore();
displaySPS();
generateHelperList();
displayUpgradeList();

// update score based on sus per second
setInterval(function() {
  score += sus_per_second/100;
  displayScore();
}, 10);

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

  volume_slider.value = volume_level * 100;
  if (volume_mute == false) {
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

function getUpgrades() {
  return JSON.parse(localStorage.getItem("upgrades")) || upgrade_list;
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
  setLocalStorage("upgrades", JSON.stringify(upgrades));
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
      // to prevent my dumbassery of adding shit with the same name, which fucks up the buttons
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
    if (helpers[i].description !== helper_list[i].description) {
      helpers[i].description = helper_list[i].description;
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
      <div style="display: flex">
        <button id="${helper.name}" class="buyable_helper hover-element">
          <img id="helper_icon" src="${helper.icon}" alt="${helper.name}">
          <span id="helper_name">${helper.name}</span>
          <span id="helper_cost">
            <img src="images/misc/favicon.ico" alt="amogus logo">
            ${formatNumber(Math.ceil(helper.cost))}
          </span>
          <span id="helper_quantity">${formatNumber(helper.quantity)}</span>
        </button>

        <div class="info-card">
          <p>Info card content</p>
          <p>Umas merdas</p>
          <p>Umas merdas</p>
        </div>
      </div>
    `;

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
          <span id="helper_name">Unknown</span>
          <span id="helper_cost">
            <img src="images/misc/favicon.ico" alt="amogus logo">
            ???
          </span>
          <span id="helper_quantity">???</span>
        </button>
      `;
      helper_list.appendChild(list_item);

      break;
    }
  }
}

function displayUpgradeList() {
  const upgrade_list = document.getElementById("upgrades");
  upgrade_list.innerHTML = "";
  
  upgrades.forEach(upgrade_class => {
    upgrade_class.forEach(upgrade => {
      // console.log(upgrade)
      // console.log(upgrade.owned)
      if (upgrade.owned) return;

      current_building = helpers.find(helper => helper.name === upgrade.helper_name);
      if (current_building.quantity < 1 ||
        current_building.quantity < upgrade.requirement) return;
      console.log("displaying")

      const list_item = document.createElement("li");
      list_item.innerHTML = `
        <div style="display: flex">
          <img src="${upgrade.icon}" class="buyable_helper hover-element">

          <div class="info-card">
            <img src="${upgrade.icon}">
            <h1>${upgrade.name}</h1>
            <p>(upgrade)</p>
            <p>${formatNumber(parseInt(upgrade.cost))}</p>
            <p>${upgrade.summary}</p>
            <p>${upgrade.description}</p>
            <p>Click to Purchase</p>
          </div>
        </div>
      `;
        
      // </div>
      list_item.style.border = `3px solid ${upgrade.color}`;
      list_item.style.boxShadow = `0 0 10px ${upgrade.color}`;
      upgrade_list.appendChild(list_item);
    });
  });
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
    number = (Math.round(number * 1000) / 1000).toFixed(3);
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
    displayUpgradeList();
    updateSingleSPS(helper);
    increaseHelperCost(helper);
    playHelperBuySFX(helper);
    generateHelperList();
  }
}

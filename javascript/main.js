// sometimes useful to reset the game while testing
// localStorage.clear()

/*
 * Set initial game parameters
 */

const helper_list = fetch_helper_list();
const upgrade_list = fetch_all_upgrades();

let sus_per_click = getSusPerClick();
let score = getScore();
let sus_per_second = getSPS();
let game_total_farmed = getGameTotalFarmed();
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

// total farmed sus each second
setInterval(function() {
  updateTotalFarmed();
}, 1000);

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
    if (helpers[i].name !== helper_list[i].name) {
      helpers[i].name = helper_list[i].name;
    }
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
    if (helpers[i].total_farmed == undefined) {
      helpers[i].total_farmed = helper_list[i].total_farmed;
    }

    // do part 3 later...
  }
}

// do same thing but for upgrades
function checkUpgradeList() {
  // situations:
  // 1 - new buildings are added
  // 2 - building characteristics are changed
  // 3 - base cps or cost are changed: requires recalculating total cps and next buy cost

  // part 1
  // let new_len = helper_list.length;
  // let old_len = helpers.length;
  
  // if (old_len < new_len) {
  //   for (let i = old_len; i < new_len; i++) {
  //     // to prevent my dumbassery of adding shit with the same name, which fucks up the buttons
  //     if (!helpers.some(obj => obj["name"] === helper_list.slice(i, i + 1)[0].name)) {
  //       helpers.push(helper_list.slice(i, i + 1)[0]);
  //     }
  //   }
  // }

  // // part 2
  // for (let i = 0; i < helpers.length; i++) {
  //   if (helpers[i].name !== helper_list[i].name) {
  //     helpers[i].name = helper_list[i].name;
  //   }
  //   if (helpers[i].icon !== helper_list[i].icon) {
  //     helpers[i].icon = helper_list[i].icon;
  //   }
  //   if (helpers[i].sound_path !== helper_list[i].sound_path) {
  //     helpers[i].sound_path = helper_list[i].sound_path;
  //   }
  //   if (helpers[i].sfx_quantity !== helper_list[i].sfx_quantity) {
  //     helpers[i].sfx_quantity = helper_list[i].sfx_quantity;
  //   }
  //   if (helpers[i].description !== helper_list[i].description) {
  //     helpers[i].description = helper_list[i].description;
  //   }
  //   if (helpers[i].total_farmed == undefined) {
  //     helpers[i].total_farmed = helper_list[i].total_farmed;
  //   }

  //   // do part 3 later...
  // }
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
        <button id="${helper.name}" class="hover-element">
          <img id="helper_icon" src="${helper.icon}" alt="${helper.name}">
          <span id="helper_name">${helper.name}</span>
          <span id="helper_cost">
            <img src="images/misc/favicon.ico" alt="amogus logo">
            ${formatNumber(Math.ceil(helper.cost))}
          </span>
          <span id="helper_quantity">${formatNumber(helper.quantity)}</span>
        </button>

        <div class="info-card">
          <img src="${helper.icon}" alt="${helper.name}">
          <h1>${helper.name}</h1>
          <p>owned: ${helper.quantity}</p>
          <img src="images/misc/favicon.ico" alt="amogus logo">
          <p>${formatNumber(parseInt(helper.cost))}</p>
          <ul class="helper-info-list">
            <li>
              <p>each ${helper.name} produces ${helper.sps} sus per second</p>
            </li>
            <li>
              <p>
                ${helper.quantity} ${formatPlural(helper.name)} producing 
                ${formatNumber(helper.quantity * helper.sps)} sus per second
                (${format1Dec(((helper.sps * helper.quantity) / sus_per_second) * 100)}% of total sus/s)
              </p>
            </li>
            <li>
              <p id="helper-${removeWhiteSpace(helper.name)}-prod">
                ${helper.name} has produced ${formatNumber(parseInt(helper.total_farmed))} sus so far
              </p>
            </li>
          </ul>
        </div>
      </div>
    `;
    // make case where building isn't owned yet

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
      if (upgrade.owned) return;

      current_building = helpers.find(helper => helper.name === upgrade.helper_name);
      if (current_building.quantity < 1 ||
        current_building.quantity < upgrade.requirement) return;

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
        
      list_item.style.border = `3px solid ${upgrade.color}`;
      list_item.style.boxShadow = `0 0 10px ${upgrade.color}`;
      upgrade_list.appendChild(list_item);
    });
  });
}


/*
 * Game functionality
 */

let sussy_button = document.getElementById("sussy_button");
sussy_button.addEventListener("click", function() {
  score += sus_per_click;
  game_total_farmed += sus_per_click;
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

function updateTotalFarmed() {
  // update each helper
  for (const helper of helpers) {
    if (helper.quantity <= 0) {
      break;
    }
    
    helper.total_farmed += helper.quantity * helper.sps;

    let total_prod_el = document.getElementById(`helper-${removeWhiteSpace(helper.name)}-prod`);
    total_prod_el.innerHTML = `${helper.name} has produced ${formatNumber(parseInt(helper.total_farmed))} sus so far`;
  }

  // update total
  game_total_farmed += sus_per_second;
}

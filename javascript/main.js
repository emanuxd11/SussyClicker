// sometimes useful to reset the game while testing
// localStorage.clear()

/*
 * Set initial game parameters
 */

// these are the default ones aka what it would look like at the start
// (can be needed if there are updates, when we use them to update the main list)
const default_helper_list = fetch_helper_list();
const default_upgrade_list = fetch_all_upgrades();

// these are the actual current game ones
const helpers = getHelpers();
const upgrades = getUpgrades();

// game params
let sus_per_click = getSusPerClick();
let score = getScore();
let sus_per_second = getSPS();
let game_total_farmed = getGameTotalFarmed();

checkHelperList();
checkUpgradeList();

displayScore();
displaySPS();
generateHelperList();
generateUpgradeList();

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
  let new_len = default_helper_list.length;
  let old_len = helpers.length;
  
  if (old_len < new_len) {
    for (let i = old_len; i < new_len; i++) {
      // to prevent my dumbassery of adding shit with the same name, which fucks up the buttons
      if (!helpers.some(obj => obj["name"] === default_helper_list.slice(i, i + 1)[0].name)) {
        helpers.push(default_helper_list.slice(i, i + 1)[0]);
      }
    }
  }

  // part 2
  for (let i = 0; i < helpers.length; i++) {
    if (helpers[i].name !== default_helper_list[i].name) {
      helpers[i].name = default_helper_list[i].name;
    }
    if (helpers[i].icon !== default_helper_list[i].icon) {
      helpers[i].icon = default_helper_list[i].icon;
    }
    if (helpers[i].sound_path !== default_helper_list[i].sound_path) {
      helpers[i].sound_path = default_helper_list[i].sound_path;
    }
    if (helpers[i].sfx_quantity !== default_helper_list[i].sfx_quantity) {
      helpers[i].sfx_quantity = default_helper_list[i].sfx_quantity;
    }
    if (helpers[i].description !== default_helper_list[i].description) {
      helpers[i].description = default_helper_list[i].description;
    }
    if (helpers[i].total_farmed == undefined) {
      helpers[i].total_farmed = default_helper_list[i].total_farmed;
    }

    // do part 3 later...
  }
}

// do same thing but for upgrades
function checkUpgradeList() {
  /* get the function references (they're not stored because of json. I guess 
  I *should* use classes, but I just don't really want to for some reason) */
  for (let i = 0; i < upgrades.length; i++) {
    for (let j = 0; j < upgrades[i].length; j++) {
      upgrades[i][j].action = default_upgrade_list[i][j].action;
    }
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
  const helper_list_div = document.getElementById("helper_list");

  helper_list_div.innerHTML = "";

  for (let i = 0; i < helpers.length; i++) {
    const helper = helpers[i];

    const list_item = document.createElement("li");
    list_item.innerHTML = `
      <div style="display: flex">
        <button id="${helper.name}" class="hover-element">
          <img id="helper_icon" src="${helper.icon}" alt="${helper.name}">
          <span id="helper_name">${helper.name}</span>
          <span class="helper-cost">
            <img src="images/misc/favicon.ico" alt="amogus logo">
            ${formatNumber(Math.ceil(helper.cost))}
          </span>
          <span id="helper_quantity">${formatNumber(helper.quantity)}</span>
        </button>

        <div class="info-card">
          <span class="helper-info-header">
            <img src="${helper.icon}" alt="${helper.name}" class="info-card-header-icon">
            <span class="helper-info-name-owned">
              <h1>${helper.name}</h1>
              <p class="helper-info-owned">owned: ${helper.quantity}</p>
            </span>
            <span class="info-helper-cost helper-cost">
              <div>
                <img src="images/misc/favicon.ico" alt="amogus logo">
                ${formatNumber(Math.ceil(helper.cost))}
              </div>
              
              <span class="time-worth">
                ${getTimeWorth(sus_per_second, score, helper.cost)}
              </span>
            </span>
          </span>

          <p class="helper-description">
            <q>${helper.description}</q>
          </p>
          
          <ul class="helper-info-list">
            <li>
              <p>
                each ${helper.name} produces 
                <span class="info-list-highlight">${formatNumber(helper.sps)} sus</span>
                per second
              </p>
            </li>
            <li>
              <p>
                ${helper.quantity} ${formatPlural(helper.name)} producing
                <span class="info-list-highlight">${formatNumber(helper.quantity * helper.sps)} sus </span>
                per second
                <span class="info-list-highlight">
                  (${format1Dec(((helper.sps * helper.quantity) / sus_per_second) * 100)}% 
                </span>
                of total sus/s)
              </p>
            </li>
            <li>
              <p id="helper-${removeWhiteSpace(helper.name)}-prod">
                <span class="info-list-highlight">${formatNumber(parseInt(helper.total_farmed))} sus </span>
                ${helper.verb} so far
              </p>
            </li>
          </ul>

          <p class="click-to-purchase">
            Click to purchase.
          </p>
        </div>
      </div>
    `;
    // make case where building isn't owned yet
    
    list_item.classList.add('helper-wrapper');
    helper_list_div.appendChild(list_item);

    document.getElementById(helper.name).addEventListener('click', function() {
      buyHelper(helper);
    });

    // add the mystery one in case the next isn't owned
    if (helper.quantity === 0 && i < helpers.length - 1) {
      const list_item = document.createElement("li");
      list_item.innerHTML = `
        <button id="mistery_helper">
          <img src="images/helpers/mistery.png" alt="mistery helper" id="helper_icon">
          <span id="helper_name">Unknown</span>
          <span class="helper-cost">
            <img src="images/misc/favicon.ico" alt="amogus logo">
            ???
          </span>
          <span id="helper_quantity">???</span>
        </button>
      `;
      helper_list_div.appendChild(list_item);

      break;
    }
  }

  setInfoCards();
}

function generateUpgradeList() {
  const default_upgrade_list = document.getElementById("upgrades");
  default_upgrade_list.innerHTML = "";
  
  upgrades.forEach(upgrade_class => {
    upgrade_class.forEach(upgrade => {
      if (upgrade.owned) return;

      current_building = helpers.find(helper => helper.name === upgrade.helper_name);
      if (current_building.quantity < 1 ||
        current_building.quantity < upgrade.requirement) return;

      const list_item = document.createElement("li");
      list_item.innerHTML = `
        <div style="display: flex">
          <img src="${upgrade.icon}" class="buyable_helper hover-element upgrade-square-icon" id="${upgrade.name}">
          
          <div class="info-card" style="border: 3px solid ${upgrade.color}; box-shadow: 0 0 10px ${upgrade.color}">
            <span class="upgrade-info-header">
              <img src="${upgrade.icon}" alt="${upgrade.name}" class="info-card-header-icon">
              <span class="upgrade-info-name-owned">
                <h1>${upgrade.name}</h1>
                <p class="upgrade-info-owned">Upgrade</p>
              </span>
              <span class="info-upgrade-cost helper-cost">
                <div>
                  <img src="images/misc/favicon.ico" alt="amogus logo">
                  ${formatNumber(Math.ceil(upgrade.cost))}
                </div>
                
                <span class="time-worth">
                  ${getTimeWorth(sus_per_second, score, upgrade.cost)}
                </span>
              </span>
            </span>

            <p class="upgrade-summary">
              ${upgrade.summary}
            </p>
            <p class="upgrade-description">
              <q>${upgrade.description}</q>
            </p>

            <p class="click-to-purchase">
              Click to purchase.
            </p>
            
          </div>
        </div>
      `;
      
      list_item.style.border = `3px solid ${upgrade.color}`;
      list_item.style.boxShadow = `0 0 10px ${upgrade.color}`;
      default_upgrade_list.appendChild(list_item);
      
      const upgradeDiv = document.getElementById(`${upgrade.name}`);
      upgradeDiv.addEventListener('click', () => {
        buyUpgrade(upgrade);
        console.log('Upgrade clicked:', upgrade.name);
      });
      
    });
  });

  setInfoCards();
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

function calcTotalSPS() {
  sus_per_second = helpers
    .filter((helper) => helper.quantity >= 0)
    .reduce((totalSPS, helper) => totalSPS + helper.sps * helper.quantity, 0);

  displaySPS();
  console.log("new sus per second: " + sus_per_second)
}

function updateSingleSPS(helper) {
  sus_per_second += helper.sps;
  displaySPS();
}

function increaseHelperCost(helper) {
  helper.cost *= 1.15
}

function buyHelper(helper) {
  if (score < helper.cost) return;

  score -= helper.cost;
  helper.quantity++;
  updateSingleSPS(helper);
  increaseHelperCost(helper);

  playBuySFX(helper);

  generateHelperList();
  generateUpgradeList();
  displayScore();

  console.log("Bought helper: " + helper.name)
}

function buyUpgrade(upgrade) {
  if (score < upgrade.cost || upgrade.owned) return;

  score -= upgrade.cost;
  upgrade.owned = true;
  upgrade.action(upgrade);
  // console.log(upgrade.action)
  // console.log(upgrade)
  calcTotalSPS();

  playBuySFX(upgrade);

  generateHelperList();
  generateUpgradeList();
  displayScore();

  console.log("Bought upgrade: " + upgrade.name)
  // console.log("helpers list after buying upgrade: " + helpers)
}

function updateTotalFarmed() {
  // update each helper
  for (const helper of helpers) {
    if (helper.quantity <= 0) {
      break;
    }
    
    helper.total_farmed += helper.quantity * helper.sps;

    let total_prod_el = document.getElementById(`helper-${removeWhiteSpace(helper.name)}-prod`);
    total_prod_el.innerHTML = `<span class="info-list-highlight">${formatNumber(parseInt(helper.total_farmed))} sus </span>${helper.verb} so far`;
  }

  // update total
  game_total_farmed += sus_per_second;
}

// do this when showing cards with javascript cause it doesn't make sense to calculate each second for every single one
// function updateTimeWorth() {
  
// }

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
let sus_per_second; calcTotalSPS(); /* maybe calculating it is just better to ensure it's correct */   /* getSPS(); */
let game_total_farmed = getGameTotalFarmed();

// store parameters (not saved between sessions)
let store_multiplier = 1; // not saving it on local storage for now (well, technically, neither does Cookie Clicker)
let store_buy = true;
let store_sell_all = false;

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
    document.title = formatNumber(Math.floor(score)) + " sus - Sussy Clicker";
  }
}, 5000);

// total farmed sus each second
setInterval(function() {
  updateTotalFarmed();
}, 1000);

// for updating the helper list when new helpers are added or something is modified
// THIS **ISN'T** AS BAD AS IT LOOKS, I PROMISE, OK?
function checkHelperList() {
  // situations:
  // -1 - calculate the total farmed from the total cost of onwned buildings
  // 0 - buildings are removed (list is smaller)
  // 1 - new buildings are added
  // 2 - building characteristics are changed
  // 3 - base cost is changed: requires recalculating next buy cost

  // part -1
  // this isn't really precise or pretty but it does do the trick so... can't really get any better than this
  // unless you have that crystal ball that hiruzen had in the beginning of naruto that was never shown again
  // in the series for some reason #borutoisntcanon
  if (!game_total_farmed || game_total_farmed < 0) {
    let estimate = score != undefined ? score : 0;
    for (const helper of helpers) {
      estimate += helper.base_cost * (Math.pow(1.15, helper.quantity) - Math.pow(1.15, 0)) / (1.15 - 1);
    } 
    game_total_farmed = estimate;
  }

  // part 0
  if (helpers.length > default_helper_list.length) {
    helpers.splice(default_helper_list.length, helpers.length - default_helper_list.length);
  }

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
  for (let i = 0; i < helpers.length && i < default_helper_list.length; i++) {
    if (helpers[i].name !== default_helper_list[i].name) {
      helpers[i].name = default_helper_list[i].name;
    }

    if (helpers[i].base_cost !== default_helper_list[i].base_cost) {
      helpers[i].base_cost = default_helper_list[i].base_cost;
      helpers[i].cost = helpers[i].base_cost * Math.pow(1.15, helpers[i].quantity);
      console.log(`updated price of ${helpers[i].name}: ${helpers[i].cost}`)
    }

    if (helpers[i].base_sps !== default_helper_list[i].base_sps) {
      calcTotalSPS(); // recalculates the current total sus per second
    }

    if (helpers[i].description !== default_helper_list[i].description) {
      helpers[i].description = default_helper_list[i].description;
    }

    if (!Number.isInteger(helpers[i].quantity)) {
      if (typeof Math.floor(+helpers[i].quantity) == "number" && Math.floor(+helpers[i].quantity) >= 0) {
        helpers[i].quantity = Math.floor(+helpers[i].quantity);
      } else {
        helpers[i].quantity = 0;
      }
    } else if (helpers[i].quantity < 0) {
      helpers[i].quantity = 0;
    }

    if (helpers[i].sfx_quantity !== default_helper_list[i].sfx_quantity) {
      helpers[i].sfx_quantity = default_helper_list[i].sfx_quantity;
    }

    if (helpers[i].total_farmed == undefined) {
      // this solution assumes that I've already implemented the calculation of total
      // sus farmed for older version compatibility
      helpers[i].total_farmed = (helpers[i].quantity * helpers[i].sps / sus_per_second) * game_total_farmed;
    }

    if (helpers[i].verb !== default_helper_list[i].verb) {
      helpers[i].verb = default_helper_list[i].verb;
    }

    if (default_helper_list[i].icon_number !== undefined && helpers[i].icon_number !== default_helper_list[i].icon_number) {
      helpers[i].icon_number = default_helper_list[i].icon_number;
    }

    if (default_helper_list[i].has_dynamic_content !== undefined && helpers[i].has_dynamic_content !== default_helper_list[i].has_dynamic_content) {
      helpers[i].has_dynamic_content = default_helper_list[i].has_dynamic_content;
    }

    if (helpers[i].icon !== default_helper_list[i].icon) {
      if (helpers[i].has_dynamic_content) {
        helpers[i].icon = default_helper_list[i].icon; // the icon path might be different if it was changed, so we need to make sure the base is the same
        helpers[i].icon_number = calculateHelperOwnedUpgrades(helpers[i]) + 1; // plus one since they technically begin at 1 (not technically, they really just begin at 1)
        helpers[i].icon = determineImageNumber(helpers[i].icon, helpers[i].icon_number);
        console.log(`owned upgrades for helper ${helpers[i].name}: ${calculateHelperOwnedUpgrades(helpers[i])}`) 
        console.log(`as such, the determined image path for ${helpers[i].name} is ${helpers[i].icon}`)
      } else {
      	helpers[i].icon = default_helper_list[i].icon;
      }
    }

    if (default_helper_list[i].sfx_number !== undefined && helpers[i].sfx_number !== default_helper_list[i].sfx_number) {
      if (helpers[i].has_dynamic_content) {
        helpers[i].sfx_number = calculateHelperOwnedUpgrades(helpers[i]) + 1;
      } else {
        helpers[i].sfx_number = default_helper_list[i].sfx_number;
      }
    }

    if (helpers[i].sound_path !== default_helper_list[i].sound_path) {
      helpers[i].sound_path = default_helper_list[i].sound_path;
    }
  }
}

// do same thing but for upgrades
function checkUpgradeList() {
  /* get the function references (they're not stored because of json) */
  for (let i = 0; i < upgrades.length; i++) {
    for (let j = 0; j < upgrades[i].length; j++) {
      upgrades[i][j].action = default_upgrade_list[i][j].action;
    }
  }
}


/*
 * Game functionality
 */

const sussy_button = document.getElementById("sussy_button");
sussy_button.addEventListener("click", function() {
  score += sus_per_click;
  game_total_farmed += sus_per_click;
  displayScore();
  playAudio('sound/general/clickboom.mp3');
});

// handles the logic and visuals of the store options, not the best code maybe but does the job
function updateStoreOptions(option) {
  let mult_value = parseInt(option.innerHTML);
  if (!Number.isNaN(mult_value)) {
    store_multiplier = mult_value;
    if (store_sell_all) store_sell_all = false;
  } else if (option.id == "storeSellAll") {
    store_sell_all = true;
  } else if (option.id == "storeBuy") {
    store_sell_all = false;
    store_buy = true;
    document.getElementById("storeSellAll").hidden = true;
  } else if (option.id == "storeSell") {
    store_buy = false;
    document.getElementById("storeSellAll").removeAttribute("hidden");
  }

  document.querySelectorAll(".modifier-opt-selected").forEach(function(el) {
    el.classList.remove("modifier-opt-selected");
  });

  if (store_buy) {
    document.getElementById("storeBuy").classList.add("modifier-opt-selected");
  } else {
    document.getElementById("storeSell").classList.add("modifier-opt-selected");
  }

  if (!store_buy && store_sell_all) {
    document.getElementById("storeSellAll").classList.add("modifier-opt-selected");
  } else {
    document.getElementById(`store${store_multiplier}x`).classList.add("modifier-opt-selected");
  }

  generateHelperList();
}

function setStoreOptEventListeners() {
  const store_options = document.querySelectorAll(".helper-modifier-option");
  
  store_options.forEach(function(option) {
    if (option.id != "storeSell") {
      option.addEventListener('click', function() {
        updateStoreOptions(option);
      });
    } // locking sell for now, since it's not implemented and it doesn't make sense to implement at the moment
  });
}
setStoreOptEventListeners();

function calcTotalSPS() {
  sus_per_second = helpers
    .filter((helper) => helper.quantity >= 0)
    .reduce((totalSPS, helper) => totalSPS + helper.sps * helper.quantity, 0);

  displaySPS();
}

function updateSingleSPS(helper) {
  sus_per_second += helper.sps;
  displaySPS();
}

// this function calculates the cost of buying based on the multiplier (can be ignored if it's 1)
function helperBuyCost(helper) {
  if (store_multiplier == 1 || (store_multiplier != 10 && store_multiplier != 100)) {
    return helper.cost;
  }

  const base_cost = helper.base_cost;
  const quantity = helper.quantity;
  const multiplier = 1.15;

  // Calculate the cost using a geometric series sum formula
  const total_cost = base_cost * (Math.pow(multiplier, quantity + store_multiplier) - Math.pow(multiplier, quantity)) / (multiplier - 1);

  return total_cost;
}


function buyHelper(helper) {
  const price = helperBuyCost(helper); // calculates based on the modifer set by the player
  if (Number.parseFloat(score) < Number.parseFloat(price)) return;

  score -= price;
  helper.quantity += store_multiplier;
  helper.cost = helper.base_cost * (1.15 ** helper.quantity)
  calcTotalSPS();

  playBuySFX(helper);

  updateHelperView(helper);
  displayScore();
}

function buyUpgrade(upgrade) {
  if (score < upgrade.cost || upgrade.owned) return;

  score -= upgrade.cost;
  upgrade.owned = true;
  upgrade.action(upgrade);

  calcTotalSPS();

  playBuySFX(upgrade);

  updateHelperView(helpers.find(helper => helper.name === upgrade.helper_name));
	deleteUpgradeView(upgrade);
  displayScore();
}

function updateTotalFarmed() {
  // update each helper
  for (const helper of helpers) {
    if (helper.quantity <= 0) {
      break;
    }
    
    helper.total_farmed += helper.quantity * helper.sps;

    const total_prod_el = document.getElementById(`helper-${removeWhiteSpace(helper.name)}-prod`);
    total_prod_el.innerHTML = `<span class="info-list-highlight">${formatNumber(helper.total_farmed)} sus </span>${helper.verb} so far`;
  }

  // update total
  game_total_farmed += sus_per_second;
}

// do this when showing cards with javascript cause it doesn't make sense to calculate each second for every single one
function updateTimeWorth(buyable) {
  const time_worth_el = document.getElementById(`${removeWhiteSpace(buyable.name)}Time`);
	if (time_worth_el) {
    if (typeof buyable.quantity !== "undefined") { // shitty fucking way of determining that a buyable is a helper (I really should have used
      // classes from the start lmao, but on the other hand if I add other buyables that can have 
      // multiple quantities this becomes 200iq all of a sudden (jk im dum))
      time_worth_el.innerHTML = `${getTimeWorth(sus_per_second, score, helperBuyCost(buyable))}`;
    } else {
      time_worth_el.innerHTML = `${getTimeWorth(sus_per_second, score, buyable.cost)}`;
    }
	}
}

function updateHelperSPSPercent(helper) {
  const percent_el = document.getElementById(`${removeWhiteSpace(helper.name)}Percent`);
	if (percent_el) {
  	percent_el.innerHTML = `${helperSPSPercent(helper)}`;
	}
}

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
let display_score = score; // this score is for the fast rolling numbers display
let sus_per_second; calcTotalSPS(); /* maybe calculating it is just better to ensure it's correct */   /* getSPS(); */
let game_total_farmed = getGameTotalFarmed();

// store parameters (not saved between sessions)
let store_multiplier = 1; // not saving it on local storage for now (well, technically, neither does Cookie Clicker)
let store_buy = true;
let store_sell_all = false;

// makes sure everything is correct and up to date
checkHelperList();
checkUpgradeList();

// visuals
displayScore();
displaySPS();
generateHelperList();
generateUpgradeList();

// handles the backend of updating the score
// also resets the display_score to be like the actual score
setInterval(function() {
  score += sus_per_second;
  display_score = score;
}, 1000);

// updates the score display with a faster interval so it looks flashier
// this interval is so short that it doesn't even run if the tab is minimized
// so it works out I guess
setInterval(function() {
  display_score = display_score + sus_per_second / 100;
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

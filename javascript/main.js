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
			if (helpers[i].name !== "Mr.Incredible") // get rid of this later when doing proper storage code and define function to calculate correct image 
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
  I *should* probably use classes, but I just don't really want to for some reason) */
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

function increaseHelperCost(helper) {
  helper.cost *= 1.15
}

function buyHelper(helper) {
  if (score < helper.cost) return;

  score -= helper.cost;
  helper.quantity++;
	// testing this out with calculating total to ensure it's 
	// always the correctv value (or at least every time a helper is bought)
  // updateSingleSPS(helper);
	calcTotalSPS();
  increaseHelperCost(helper);

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
		// console.log(`new time worth for ${buyable.name} = ` + getTimeWorth(sus_per_second, score, buyable.cost))
  	time_worth_el.innerHTML = `${getTimeWorth(sus_per_second, score, buyable.cost)}`;
	}
}

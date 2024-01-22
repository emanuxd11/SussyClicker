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
 * Display functions
 */

function displayScore() {
  document.getElementById("score").textContent = "Sussy Meter: " + formatNumber(Math.floor(score));
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

    // regular helper view
    createHelperView(helper, helper_list_div);

    // add the mystery one in case the next isn't owned
    if (helper.quantity === 0 && i < helpers.length - 1) {
      createMysteryHelperView(helper_list_div);
      break;
    }
  }
}

function createMysteryHelperView(helper_list_div) {
  const list_item = document.createElement("li");
  list_item.id = "mysteryHelperWrapper";
  list_item.innerHTML = helperLiMysteryTemplate();
  helper_list_div.appendChild(list_item);
}

function createHelperView(helper, helper_list_div) {
  const list_item = document.createElement("li");
  list_item.innerHTML = helperLiTemplate(helper);
  // TODO: make case where building isn't owned yet
  
  list_item.classList.add('helper-wrapper');
  list_item.id = `${removeWhiteSpace(helper.name)}Wrapper`;
  helper_list_div.appendChild(list_item);

  document.getElementById(`${removeWhiteSpace(helper.name)}BuyButton`).addEventListener('click', function() {
    buyHelper(helper);
  });

  const button = document.getElementById(`${removeWhiteSpace(helper.name)}BuyButton`);
  setInfoCard(button, helper);
}

function updateHelperView(helper) {
  const list_item = document.getElementById(`${removeWhiteSpace(helper.name)}Wrapper`);
  list_item.innerHTML = helperLiTemplate(helper);
  
  const button = document.getElementById(`${removeWhiteSpace(helper.name)}BuyButton`);

  button.addEventListener('click', function() {
    buyHelper(helper);
  });

  setInfoCard(button, helper);

  // (ok this code isn't pretty but it does the trick for now)
  // check if it's the first buy (that unlocks a new helper)
  if (helper.quantity == 1) {
    let nextHelper;
    const nextHelperIdx = helpers.findIndex(_helper => _helper.name === helper.name) + 1;
    if (nextHelperIdx < helpers.length) {
      nextHelper = helpers[nextHelperIdx];
      console.log("next helper: " + nextHelper.name)

      // check it the next element already exists 
      // (since it might be updated because of buying an upgrade and not a new helper)
      if (!document.getElementById(`${removeWhiteSpace(nextHelper.name)}Wrapper`)) {

        // delete previous mystery helper
        const previousMystery = document.getElementById('mysteryHelperWrapper');
        if (previousMystery) {
          previousMystery.parentNode.removeChild(previousMystery);
          console.log("removed mystery helper");
        }

        // add new helper LIs
        const helper_list_div = document.getElementById("helper_list");
        createHelperView(nextHelper, helper_list_div);
        createMysteryHelperView(helper_list_div);
      }
    }
  }

  // update also the upgrade list if there are new upgrade unlocks
	for (const upgrade_type of upgrades) {
		for (const upgrade of upgrade_type) {
			// search for upgrade type that matches the helper class
			if (upgrade.helper_name !== helper.name) {
				break;
			}

			// check if requirements are met
			if (upgrade.owned || upgrade.requirement > helper.quantity) {
				continue;
			}

			// check if the element already exists in html
			const upgradeWrapperId = `${removeWhiteSpace(upgrade.name)}Wrapper`;
			if (document.getElementById(upgradeWrapperId)) {
				console.log("upgrades can be bought but already exist");
				continue;
			}

			// if it doesn't exist, create it
			const upgrade_list_div = document.getElementById("upgrades");
			createUpgradeView(upgrade, upgrade_list_div);
		}
	}
}

function generateUpgradeList() {
  const upgrade_list_div = document.getElementById("upgrades");
  upgrade_list_div.innerHTML = "";
  
  upgrades.forEach(upgrade_class => {
    upgrade_class.forEach(upgrade => {
      if (upgrade.owned) return;

      current_building = helpers.find(helper => helper.name === upgrade.helper_name);
      if (current_building.quantity < upgrade.requirement) return;

      createUpgradeView(upgrade, upgrade_list_div);
    });
  });
}

function createUpgradeView(upgrade, upgrade_list_div) {
	const div_id = `${removeWhiteSpace(upgrade.name)}Wrapper`;
	const list_item = document.createElement("li");
	list_item.id = div_id;

	list_item.innerHTML = upgradeLiTemplate(upgrade);
	
	list_item.style.border = `3px solid ${upgrade.color}`;
	list_item.style.boxShadow = `0 0 10px ${upgrade.color}`;
	upgrade_list_div.appendChild(list_item);
	
	const upgradeDiv = document.getElementById(div_id);
	upgradeDiv.addEventListener('click', () => {
		buyUpgrade(upgrade);
		console.log('Upgrade clicked:', upgrade.name)
	});

	const button = document.getElementById(`${removeWhiteSpace(upgrade.name)}BuyButton`);
  setInfoCard(button, upgrade);
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

  // generateHelperList();
  // generateUpgradeList();
  updateHelperView(helper);
  displayScore();

  // console.log("Bought helper: " + helper.name)
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

  updateHelperView(helpers.find(helper => helper.name === upgrade.helper_name));
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

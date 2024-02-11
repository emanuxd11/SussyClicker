/*
 * Handle local storage
 */

function setLocalStorage(name, value) {
	localStorage.setItem(name, value);
}

function getScore() {
	return +localStorage.getItem("score") || 0;
}

function getSPS() {
	return +localStorage.getItem("sps") || 0;
}

function getSusPerClick() {
	return +localStorage.getItem("sus_per_click") || 1;
}

function getGameTotalFarmed() {
	// this requires implementing a function to calculate total sus farmed from:
	// - current sus
	// - sum of the cost of buying the current number of each helper so far
	// this is for integrating with "legacy" pre alpha versions that didn't count the total sus
	return +localStorage.getItem("game_total_farmed") || 0;
}

function getHelpers() {
	return JSON.parse(localStorage.getItem("helpers")) || default_helper_list;
}

function getUpgrades() {
	return JSON.parse(localStorage.getItem("upgrades")) || default_upgrade_list;
}

function updateLocalStorage() {
	setLocalStorage("score", score);
	setLocalStorage("game_total_farmed", game_total_farmed);
	setLocalStorage("sus_per_click", sus_per_click);
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


/* Checking integrity of helper and upgrade lists */

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
  for (let i = 0; i < upgrades.length; i++) {
    for (let j = 0; j < upgrades[i].length; j++) {
      upgrades[i][j].helper_name = default_upgrade_list[i][j].helper_name;
      upgrades[i][j].name = default_upgrade_list[i][j].name;
      upgrades[i][j].base_cost = default_upgrade_list[i][j].base_cost;
      upgrades[i][j].cost = default_upgrade_list[i][j].cost;
      upgrades[i][j].requirement = default_upgrade_list[i][j].requirement;
      upgrades[i][j].action = default_upgrade_list[i][j].action; /* this is actually important to do every time */
      upgrades[i][j].summary = default_upgrade_list[i][j].summary;
      upgrades[i][j].description = default_upgrade_list[i][j].description;
      upgrades[i][j].icon = default_upgrade_list[i][j].icon;
      upgrades[i][j].sound_path = default_upgrade_list[i][j].sound_path;
      upgrades[i][j].sfx_quantity = default_upgrade_list[i][j].sfx_quantity;
      upgrades[i][j].sfx_number = default_upgrade_list[i][j].sfx_number;
      upgrades[i][j].color = default_upgrade_list[i][j].color;
      upgrades[i][j].c_filter = default_upgrade_list[i][j].c_filter;
    }
  }
}


/* Handling Game Saves */

const save_game_button = document.getElementById("saveGame");
const upload_save_button = document.getElementById('uploadSave');
const delete_save_button = document.getElementById('deleteSave');


save_game_button.addEventListener("click", downloadLocalStorage);

upload_save_button.addEventListener('change', function() {
  loadJsonFromFile(this);
});

delete_save_button.addEventListener('click', function() {
  location.reload();
  localStorage.clear();
});

// yes, saves are """encrypted""". I don't care if this isn't actually secure 
// ofc the player can look at the source code and see the key easily
// but if they were to do that, they might as well use the console,
// so at that point it doesn't matter
function downloadLocalStorage() {
	updateLocalStorage(); // make sure it's up to date before downloading

  const localStorageData = { ...localStorage };
  const jsonData = JSON.stringify(localStorageData, null, 2);
  
  const encryptedData = encryptData(jsonData, 'susanus clickus');
  
  const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
  const filename = "SussyClickerSave"

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}

function loadJsonFromFile(inputElement) {
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    console.error('File API not supported');
    return;
  }

  const file = inputElement.files[0];
  if (!file) {
    console.error('No file selected');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const encryptedData = event.target.result;
      const jsonData = encryptData(encryptedData, 'susanus clickus');
      
      if (!jsonData) {
        console.error('Decryption failed');
        return;
      }
      
      const parsedData = JSON.parse(jsonData);
      
      if (!isValidSave(parsedData)) {
        console.log("Corrupted save file!")
        // make function to show error message
        return;
      }

      for (const key in parsedData) {
        if (parsedData.hasOwnProperty(key)) {
          localStorage.setItem(key, parsedData[key]);
        }
      }

    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  };

  reader.readAsText(file);
  location.reload();
}

function isValidSave(jsonData) {
	let valid = true;
	["sus_per_click", "sps", "helpers", "upgrades", 
	"volume_level", "game_total_farmed", "score", 
	"volume_mute"].forEach(function (param) {
		if (!(param in jsonData)) {
			valid = false;
			return;
		}
	});
  return valid;
}

// save files are "encrypted" ( ͠° ͟ʖ ͡°)
// encrypts/decrypts
function encryptData(data, key) {
  let encryptedData = '';
  for (let i = 0; i < data.length; i++) {
    encryptedData += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return encryptedData;
}

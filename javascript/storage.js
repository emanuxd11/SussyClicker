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

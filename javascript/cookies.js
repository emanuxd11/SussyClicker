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


// Function to encode localStorage content
function encodeLocalStorage() {
	var encodedData = '';
	for (var i = 0; i < localStorage.length; i++) {
		var key = localStorage.key(i);
		var encodedKey = encodeString(key);
		var value = localStorage.getItem(key);
		var encodedValue = encodeString(value);
		encodedData += encodedKey + ':' + encodedValue + ';';
	}
	return encodedData;
}

/* Testing */

// Function to encode a string
function encodeString(str) {
	var encodedStr = '';
	for (var i = 0; i < str.length; i++) {
		var charCode = str.charCodeAt(i);
		encodedStr += String.fromCharCode(charCode + 1); // Shift each character by 1
	}
	return encodedStr;
}

setInterval(updateLocalStorage, 2 * 60 * 1000);

window.addEventListener("beforeunload", function() {
	updateLocalStorage();
});


// /* Testing */

// // Function to download encoded localStorage content
// function downloadEncodedLocalStorage() {
//     var encodedData = encodeLocalStorage();

//     // Create a Blob with the encoded data
//     var blob = new Blob([encodedData], { type: 'text/plain' });

//     // Create a temporary URL to the Blob
//     var url = window.URL.createObjectURL(blob);

//     // Create an anchor element to trigger the download
//     var a = document.createElement('a');
//     a.href = url;
//     a.download = 'encodedLocalStorage.txt'; // Set the filename
//     document.body.appendChild(a);

//     // Trigger the click event on the anchor element
//     a.click();

//     // Remove the anchor element from the document
//     document.body.removeChild(a);

//     // Revoke the URL
//     window.URL.revokeObjectURL(url);
// }

// // Usage: Call the function to download the entire localStorage data with encoding
// // downloadEncodedLocalStorage();

// // Function to decode a string
// function decodeString(encodedStr) {
//     var decodedStr = '';
//     for (var i = 0; i < encodedStr.length; i++) {
//         var charCode = encodedStr.charCodeAt(i);
//         decodedStr += String.fromCharCode(charCode - 1); // Reverse the character shift
//     }
//     return decodedStr;
// }

// // Function to decrypt localStorage content and return as JSON
// function decodeLocalStorage(encodedData) {
//     var decodedData = {};
//     var pairs = encodedData.split(';'); // Split the encoded data into key-value pairs

//     // Decode each key-value pair and store them in the decodedData object
//     pairs.forEach(function(pair) {
//         if (pair) { // Skip empty pairs
//             var keyValue = pair.split(':');
//             var decodedKey = decodeString(keyValue[0]);
//             var decodedValue = decodeString(keyValue[1]);
//             decodedData[decodedKey] = decodedValue;
//         }
//     });

//     return JSON.stringify(decodedData); // Return the decoded data as JSON string
// }

// // missing escaping certain characters on the upper one bruih
// // Usage: Call the function to decode the encoded localStorage data
// var encodedData = ""; // Provide the encoded data here
// var decodedData = decodeLocalStorage(encodedData);
// console.log(decodedData); // Output the decoded data as JSON

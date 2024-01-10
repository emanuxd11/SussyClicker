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

function getSusPerClick() {
    return parseFloat(localStorage.getItem("sus_per_click")) || 1;
}

function getGameTotalFarmed() {
    // this requires implementing a function to calculate total sus farmed from:
    // - current sus
    // - sum of the cost of buying the current number of each helper so far
    // this is for integrating with "legacy" pre alpha versions that didn't count the total sus
    return parseFloat(localStorage.getItem("game_total_farmed")) || 0;
}

function getHelpers() {
    return JSON.parse(localStorage.getItem("helpers")) || helper_list;
}

function getUpgrades() {
    return JSON.parse(localStorage.getItem("upgrades")) || upgrade_list;
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

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

	list_item.classList.add('helper-wrapper');
	list_item.id = `${removeWhiteSpace(helper.name)}Wrapper`;
	helper_list_div.appendChild(list_item);

	document.getElementById(`${removeWhiteSpace(helper.name)}BuyButton`).addEventListener('click', function() {
		buyHelper(helper);
	});

	const button = document.getElementById(`${removeWhiteSpace(helper.name)}BuyButton`);
	setInfoCard(button, helper);

	adjustHelperNameFontSize();
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
	// UPDATE: this code just became even uglier after adding store_multiplier,
	// maybe in future update future helpers based on score instead of previous helper,
	// which would allow potentially leaping forward and skippping some helpers
	// (which realistically doesn't matter unless the player's cheating with the console)
	if (helper.quantity == store_multiplier) {
		let nextHelper;
		const nextHelperIdx = helpers.findIndex(_helper => _helper.name === helper.name) + 1;
		if (nextHelperIdx < helpers.length) {
			nextHelper = helpers[nextHelperIdx];

			// check it the next element already exists 
			// (since it might be updated because of buying an upgrade and not a new helper)
			if (!document.getElementById(`${removeWhiteSpace(nextHelper.name)}Wrapper`)) {

				// delete previous mystery helper
				const previousMystery = document.getElementById('mysteryHelperWrapper');
				if (previousMystery) {
					previousMystery.parentNode.removeChild(previousMystery);
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
				continue;
			}

			// if it doesn't exist, create it
			const upgrade_list_div = document.getElementById("upgrades");
			createUpgradeView(upgrade, upgrade_list_div);
		}
	}

	adjustHelperNameFontSize();
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
	});

	const button = document.getElementById(`${removeWhiteSpace(upgrade.name)}BuyButton`);
	setInfoCard(button, upgrade);
}

function deleteUpgradeView(upgrade) {
	const upgrade_li = document.getElementById(`${removeWhiteSpace(upgrade.name)}Wrapper`);
	if (upgrade_li) {
		upgrade_li.parentNode.removeChild(upgrade_li);
	}
}

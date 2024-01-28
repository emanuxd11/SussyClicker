function helperLiTemplate(helper) {
	return `
		<div style="display: flex">
			<button id="${removeWhiteSpace(helper.name)}BuyButton" class="hover-element">
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
						
						<span class="time-worth" id="${removeWhiteSpace(helper.name)}Time">
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
						per second (<span class="info-list-highlight" id="${removeWhiteSpace(helper.name)}Percent">${helperSPSPercent(helper)}</span>
						of total sus/s)
					</p>
				</li>
				<li>
					<p id="helper-${removeWhiteSpace(helper.name)}-prod">
						<span class="info-list-highlight">${formatNumber(helper.total_farmed)} sus </span>
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
}

function helperLiMysteryTemplate() {
	return `
		<div style="display: flex">
			<button id="mysteryHelper" class="hover-element">
				<img id="helper_icon" src="images/helpers/mystery.png" alt="mystery helper">
				<span id="helper_name">Unknown</span>
				<span class="helper-cost">
					<img src="images/misc/favicon.ico" alt="amogus logo">
					???
				</span>
				<span id="helper_quantity">???</span>
			</button>
		</div>
	`;
}

function upgradeLiTemplate(upgrade) {
	return `
		<div style="display: flex">
			<img src="${upgrade.icon}" id="${removeWhiteSpace(upgrade.name)}BuyButton" class="buyable_helper hover-element upgrade-square-icon"}">
			
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
						
						<span class="time-worth" id="${removeWhiteSpace(upgrade.name)}Time">
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
}

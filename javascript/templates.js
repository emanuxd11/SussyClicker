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
				per second
				<span class="info-list-highlight">
					(${format1Dec(((helper.sps * helper.quantity) / sus_per_second) * 100)}% 
				</span>
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
		<button id="mysteryHelper">
			<img src="images/helpers/mystery.png" alt="mystery helper" id="helper_icon">
			<span id="helper_name">Unknown</span>
			<span class="helper-cost">
				<img src="images/misc/favicon.ico" alt="amogus logo">
				???
			</span>
			<span id="helper_quantity">???</span>
		</button>
	`;
}

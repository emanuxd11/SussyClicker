document.addEventListener('DOMContentLoaded', function () {
	loadInfoPopup();
	
	const infoButton = document.getElementById('infoButton');
	const infoPopup = document.getElementById('infoPopup');
	const closeInfoButton = document.getElementById('closeInfoButton');
	const body = document.body;

	infoButton.addEventListener('click', function () {
		infoPopup.style.display = 'block';
		body.classList.add('popup-open');
	});

	closeInfoButton.addEventListener('click', function () {
		infoPopup.style.display = 'none';
		body.classList.remove('popup-open');
	});
});

const infoPopup = `
	<div id="infoContent">
		<h2>Alpha 1.0</h2>
		<h4>Added Features:</h4>
		<ul>
			<li>
				<p>Improved UI</p>
				<ul>
					<li>
						<p>Tooltips with rich information about helpers and upgrades</p>
					</li>
				</ul>
			</li>
			<li>
				<p>Added more helpers</p>
			</li>
			<li>
				<p>Added upgrades for each helper</p>
			</li>
		</ul>

		<h4 id="githubTitle">View source code/contribute:</h4>
		<a class="github-link" href="https://github.com/emanuxd11/SussyClicker" target="_blank">
			<i class="fab fa-github"> GitHub</i>
		</a>
	</div>

	<button id="closeInfoButton">Close</button>
`;

function loadInfoPopup() {
	const popup_el = document.getElementById('infoPopup');
	popup_el.innerHTML = infoPopup;
}

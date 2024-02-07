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
    <h1>WARNING</h1>
    <p>
      This version of Sussy Clicker is in very early stages of development! 
      A lot of features may be unfinished or not implemented at all yet, so don't
      come in with high expectations.
    </p>
    <p>
      On top of being unfinished, this game is being developed with the sole objective of
      dematerializing the player's brain cells.
    </p>
    <p>
      Consider yourself warned and play at your own discretion.
    </p>

		<h2>Alpha 1.0</h1>
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


/* for options menu */

document.addEventListener('DOMContentLoaded', function () {
	const optionsButton = document.getElementById('optionsButton');
	const optionsPopup = document.getElementById('optionsCard');
	const closeOptButton = document.getElementById('closeOptButton');
	const body = document.body;

	optionsButton.addEventListener('click', function () {
    optionsPopup.style.display = 'block';
		body.classList.add('popup-open');
	});

	closeOptButton.addEventListener('click', function () {
		optionsPopup.style.display = 'none';
		body.classList.remove('popup-open');
	});
});

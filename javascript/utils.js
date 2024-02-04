// useful for event listeners
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function formatPlural(str) {
	if (str.endsWith('s') || str.endsWith('x') || str.endsWith('z') || str.endsWith('ch') || str.endsWith('sh')) {
		return str + 'es';
	} else if (str.endsWith('y') && !'aeiou'.includes(str[str.length - 2])) {
		return str.slice(0, -1) + 'ies';
	} else {
		return str + 's';
	}
}

function formatNumber(number) {
  const suffixes = [
    "", "", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion",
    "septillion", "octillion", "nonillion", "decillion", "undecillion", "duodecillion",
    "tredecillion", "quatturodecillion", "quindecillion", "sexdecillion", "septendecillion",
    "octodecillion", "novemdecillion", "vigintillion", "unvigintillion", "duovigintillion", 
    "tresvigintillion", "quattuorvigintillion", "sexavigintillion", "septavigintillion", "octovigintillion",
    "novigintillion"
  ];
  let suffix_index = 0;

  // .toPrecision is important because >flõtz<
  if (Number.parseFloat(number).toPrecision(1) >= 1000000) {
    while (Number.parseFloat(number).toPrecision(1) >= 1000) {
      number /= 1000;
      suffix_index++;
    }
    number = (Number.parseFloat(number * 1000) / 1000).toFixed(3);
  } else {
    number = number.toLocaleString();
  }

  return number + " " + suffixes[suffix_index];
}

function format1Dec(number) {
  if (typeof number !== 'number' || isNaN(number) || number == undefined) {
    return 0;
  }
	
	let result = number.toFixed(1);
	if (result == 0) {
		return 0;
	} else {
		return result;
	}
}

function removeWhiteSpace(str) {
  return str.replace(/\s/g, '');
}

function wrapInSpace(str) {
  return ` ${str} `;
}

function getTimeWorth(currentSPS, currentSUS, cost) {
  // console.log("Getting time worth of " + cost + " sus")
  if (currentSPS == 0) {
    return "";
  }

  if (currentSPS >= cost) return "worth <1 second";

  let diff = currentSUS - cost;

  if (diff < 0) {
    let time = formatTime(-diff/currentSPS);
    return `in ${time}`;
  } else {
    let time = formatTime(cost/currentSPS);
    return `worth ${time}`;
  }
}

function formatTime(seconds) {
  if (seconds < 60) {
    return `${formatNumber(Math.round(seconds))} second${seconds !== 1 ? 's' : ''}`;
  }
  
  if (seconds < 3600) {
    const minutes = Math.round(seconds / 60);
    return `${formatNumber(Math.ceil(minutes)).trim()} minute${minutes !== 1 ? 's' : ''}`;
  } 
  
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.round((seconds % 3600) / 60);
    const hoursString = hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''}` : '';
    const minutesString = remainingMinutes > 0 ? `and ${formatNumber(Math.ceil(remainingMinutes)).trim()} minute${remainingMinutes !== 1 ? 's' : ''}` : '';
    return `${hoursString} ${minutesString}`.trim();
  }

  const days = Math.floor(seconds / 86400);
  return `${formatNumber(Math.ceil(days)).trim()} day${days !== 1 ? 's' : ''}`;
}

function helperSPSPercent(helper) {
  return `${format1Dec(((helper.sps * helper.quantity) / sus_per_second) * 100)}%`;
}


/*
 * For setting the info cards.
 */

// this one might actually not be needed anymore so I might remove it
function setAllInfoCards() {
  const hoverElements = document.querySelectorAll('.hover-element');

  hoverElements.forEach((element, index) => {
    setInfoCard(element, helpers[index]);
  });
}

function vPositionCard(event, element, infoCard) {
  const parentDim = element.getBoundingClientRect();
  const infoCardDim = infoCard.getBoundingClientRect();

  const parentHeight = parentDim.height;
  const infoCardHeight = infoCardDim.height;

  let newTop;

  if ((event.clientY - 32) + infoCardHeight > window.innerHeight) {
    newTop = window.innerHeight - infoCardHeight - 10;
  } else {
    const mouseOffset = parentHeight / 2 + 10;
    newTop = event.clientY - mouseOffset;
  }

  if (parseInt(infoCard.style.top, 10) !== newTop) {
    return `${newTop}px`;
  }
}

function setInfoCard(element, helper=undefined) {
  const infoCard = element.parentElement.querySelector('.info-card');
  // const timeWorth = infoCard.querySelector("time-worth"); // feeling useless, might delete
  let worthIntervalId;
  let isHovered = false;

  document.addEventListener('mousemove', throttle((event) => {
    if (!isHovered) return;

    infoCard.style.top = vPositionCard(event, element, infoCard);
  }, 8)); // throttle for ~120fps feel and better efficiency

  element.addEventListener('mouseover', () => {
    isHovered = true;
    infoCard.style.display = 'block';
    infoCard.style.zIndex = '99';
    infoCard.style.right = '326px';
    infoCard.style.top = vPositionCard(event, element, infoCard);

		// console.log("hovering on " + helper.name)
    
    // update helper's SPS percentage when hovering for accuracy
    updateHelperSPSPercent(helper);

		// update it immediately
		updateTimeWorth(helper);
    // and then update it every 1s
    worthIntervalId = setInterval(() => {
      updateTimeWorth(helper);
    }, 1000);

    // just to test this function
    helperBuyCost(helper);
  });

  element.addEventListener('mouseout', () => {
    isHovered = false;
    infoCard.style.display = 'none';

    // disable interval when the card is not being shown
    clearInterval(worthIntervalId);
  });
}

function adjustHelperNameFontSize() {
  document.querySelectorAll(".helper-name").forEach(function(name_container) {
    const name = name_container.innerHTML;
    if (name.length >= 15) {
      name_container.style.fontSize = "23px";
    } else if (name.length >= 14) {
      name_container.style.fontSize = "25px";
    } else if (name.length > 12) {
      name_container.style.fontSize = "27px";
    }
  });
}

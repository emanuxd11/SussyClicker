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
  let suffixes = [
    "", "", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion",
    "septillion", "octillion", "nonillion", "decillion", "undecillion", "duodecillion",
    "tredecillion", "quatturodecillion", "quindecillion", "sexdecillion", "septendecillion",
    "octodecillion", "novemdecillion", "vigintillion", "duovigintillion", "tresvigintillion",
    "quattuorvigintillion", "sexavigintillion", "septavigintillion", "octovigintillion",
    "novigintillion"
  ];
  let suffix_index = 0;

  if (number >= 1000000) {
    while (number >= 1000) {
      number /= 1000;
      suffix_index++;
    }
    number = (Math.round(number * 1000) / 1000).toFixed(3);
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
  if (currentSPS == 0) {
    return "";
  }

  if (currentSPS > cost) return "worth <1 second";

  let diff = currentSUS - cost;

  if (diff < 0) {
    let time = formatTime(Math.abs(diff/currentSPS));
    return `in ${time}`;
  } else {
    let time = formatTime(Math.abs(cost/currentSPS));
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

/* Position cards correctly (so they don't go below the screen and are in the correct height always) */

document.addEventListener('DOMContentLoaded', () => {
  const hoverElements = document.querySelectorAll('.hover-element');

  hoverElements.forEach((element) => {
    const infoCard = element.parentElement.querySelector('.info-card');
    let isHovered = false;

    document.addEventListener('mousemove', throttle((event) => {
      if (!isHovered) return;

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
        infoCard.style.top = `${newTop}px`;
      }
    }, 8)); // throttle for ~120fps feel and better efficiency

    element.addEventListener('mouseover', () => {
      isHovered = true;
      infoCard.style.display = 'block';
      infoCard.style.zIndex = '99';
      infoCard.style.right = '326px';
    });

    element.addEventListener('mouseout', () => {
      isHovered = false;
      infoCard.style.display = 'none';
    });
  });
});

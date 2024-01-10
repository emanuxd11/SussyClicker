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
  if (typeof number !== 'number' || isNaN(number)) {
    return 'Invalid input';
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
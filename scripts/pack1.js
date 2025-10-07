const objBallColors = ["#000", "#FF0", "#00F", "#F00", "#808", "#F80", "#0C0", "#840"];

// 9-Ball functions
function makeAll9Balls() {
	var nineBcollection = document.getElementsByClassName("nbBreak");
	
	for (var n in nineBcollection) {
		if (nineBcollection[n].className == "nbBreak" && nineBcollection[n].id.endsWith("nbK")) {
			var baseId = nineBcollection[n].id.substr(0,nineBcollection[n].id.length-3);
			
			build9Ball(baseId);
		}
	}
}

function isNumberPrime(numeral) {
	for (var n = 2; n <= Math.sqrt(numeral); n++) {
		if (numeral % n == 0) {
			return false;
		}
	}
	
	return true;
}

function build9Ball(readId) {
	var ballRack = [false, true, false, false, false, false, false, false, false, true];
	var breakRack = "";
	var breakDiv = document.getElementById(readId+"nbK");
	
	for (var b = 0; b < 9; b++) {
		var activeBall = readId+"nbO"+b;
		var activeLabel = readId+"nbL"+b;
		var rollBall;
		
		switch (b) {
			case 8:
				paint9Ball(activeBall, activeLabel, 1);
				if (!lastDigitEven()) {
					breakRack += "8";
				}
				break;
				
			case 4:
				paint9Ball(activeBall, activeLabel, 9);
				break;
				
			default:
				do {
					rollBall = irandom(2,8);
				} while (ballRack[rollBall]);
				ballRack[rollBall] = true;
				
				paint9Ball(activeBall, activeLabel, rollBall);
				
				/*
				 * Ball 0 needs to be greater than 5
				 * Ball 1 needs to be less than Ball 0
				 * Ball 2 needs to be greater than the last serial digit
				 * Ball 3 needs to be a prime number
				 */
				if ((b == 0 && rollBall > 5) || 
					(b == 1 && rollBall < get9Ball(readId+"nbL0")) ||
					(b == 2 && rollBall > getLastDigit()) ||
					(b == 3 && isNumberPrime(rollBall))) {
					breakRack += b.toString();
				}
				break;
		}
	}
	
	// Either adjacent random ball is one diff in value to this ball
	if (Math.abs(get9Ball(readId+"nbL5") - get9Ball(readId+"nbL2")) == 1 || Math.abs(get9Ball(readId+"nbL5") - get9Ball(readId+"nbL7")) == 1) {
		breakRack += "5";
	}

	// Difference between the two adjacent random balls exceeds 2
	if (Math.abs(get9Ball(readId+"nbL3") - get9Ball(readId+"nbL7")) > 2) {
		breakRack += "6";
	}

	// Neither adjacent random ball can be greater than 6
	if (get9Ball(readId+"nbL5") <= 6 && get9Ball(readId+"nbL6") <= 6) {
		breakRack += "7";
	}
	
	breakDiv.innerHTML = breakRack;
}

function paint9Ball(readBall, readLabel, numeral) {
	var ballObj = document.getElementById(readBall);
	var labelObj = document.getElementById(readLabel);
	
	labelObj.innerHTML = numeral;
	
	ballObj.style.borderColor = objBallColors[numeral % 8];
	ballObj.style.visibility = "";
}

function get9Ball(readId) {
	return parseInt(document.getElementById(readId).innerHTML);
}

function check9Bobjs(readObj) {
	var baseId = readObj.id;
	var breakBalls = 0;
	var totalBalls = 0;

	var breakDiv = document.getElementById(baseId+"nbK").innerHTML;
	for (var a = 0; a < 9; a++) {
		var workObj = document.getElementById(baseId+"nbO"+a);
		var workObjLabel = document.getElementById(baseId+"nbL"+a).innerHTML;
		if (workObj.style.visibility != "hidden") {
			totalBalls++;
			
			if (breakDiv.search(a) >= 0) {
				breakBalls++;
			}
		}
	}
	
	if (totalBalls <= 0) {
		console.log("All object balls have been potted.")
		solveModule(readObj, true, false, 0);
	}
	
	return breakBalls;
}

function pot9Ball(readObj, localObj) {
	var baseId = readObj.id;
	var readBall = parseInt(localObj.id.slice(-1));
	var readValue = parseInt(document.getElementById(baseId+"nbL"+readBall).innerHTML);
	var breakDiv = document.getElementById(baseId+"nbK").innerHTML;
	
	if (gameActive) {
		if (breakDiv.search(readBall) >= 0) {
			localObj.style.visibility = "hidden";
			console.log("The "+readValue+"-ball was potted correctly during break.")
			
			if (check9Bobjs(readObj) <= 0) {
				console.log("All required object balls have been potted during break.")
			}
		} else if (check9Bobjs(readObj) > 0) {
			var breakHint;
			
			switch (readBall) {
				case 0:
					breakHint = "This ball must be greater than 5"
					break;
				case 1:
					breakHint = "This ball must be less than the back-most ball"
					break;
				case 2:
					breakHint = "This ball must be greater than the bomb's right-most serial number"
					break;
				case 3:
					breakHint = "This ball must be a prime number"
					break;
				case 4:
					breakHint = "This ball may never be potted"
					break;
				case 5:
					breakHint = "This ball must have an adjacent ball in value (not including the 9-ball)"
					break;
				case 6:
					breakHint = "The difference between the two adjacent random balls must exceed 2"
					break;
				case 7:
					breakHint = "None of the adjacent balls (except the 9-ball) may exceed 6"
					break;
				case 8:
					breakHint = "The bomb's right-most serial number must be odd"
					break;
			}
			
			console.warn("The "+readValue+"-ball was potted incorrectly during break! "+breakHint+" during the break.")
			solveModule(readObj, false, false);
			if (life > 0) {
				build9Ball(baseId);
			}
		} else {
			var legalBall = 9;
			
			for (var c = 0; c < 9; c++) {
				var workObj = document.getElementById(baseId+"nbO"+c);
				var workObjLabel = document.getElementById(baseId+"nbL"+c).innerHTML;
				if (workObj.style.visibility != "hidden") {
					legalBall = Math.min(legalBall, workObjLabel);
				}	
			}
			
			if (readValue <= legalBall) {
				localObj.style.visibility = "hidden";
				console.log("The "+readValue+"-ball was potted correctly.");
				check9Bobjs(readObj);
			} else {
				console.warn("The "+readValue+"-ball was potted incorrectly! The "+legalBall+"-ball was the required ball.")
				solveModule(readObj, false, false);
				if (life > 0) {
					build9Ball(baseId);
				}
			}
		}
	}
	
	playSound(potBallSnd);
}

// Adjacent Letters functions
function toggleAdjLetter(readObj, localObj) {
	if (gameActive && readObj.style.borderColor != solveColor) {
		if (localObj.className.endsWith("adjLetPressed")) {
			localObj.className = "adjacentLetter";
			playSound(buttonSnds[1]);
		} else {
			localObj.className = "adjacentLetter adjLetPressed";
			playSound(buttonSnds[0]);
		}
	}
}

function submitAdjLetters(readObj) {
	var baseId = readObj.id;
	var allCorrect = true;
	
	if (gameActive && readObj.style.borderColor != solveColor) {
		for (var l = 0; l < 12; l++) {
			allCorrect = (checkAdjLetters(baseId,l,false) && allCorrect);
		}
		
		solveModule(readObj, allCorrect, false, 25);
		if (allCorrect) {
			console.log("Adjacent Letters was submitted correctly.");
		} else {
			console.warn("Adjacent Letters was submitted incorrectly!");
		}
		
		if (life <= 0) {
			getAdjSolution(baseId);
		}
		
		playSound(buttonSnds[0]);
	}
}

function checkAdjLetters(readId, readPos, getSolution) {
	var getLetter = getAdjLetter(readId, readPos);
	var letterPressed = (getSolution || document.getElementById(readId+"adjLet"+readPos).className.endsWith("adjLetPressed"));
	var horiBank, vertBank, getPeer;
	var pressNeeded = false;
	
	switch (getLetter) {
		case "A":
			horiBank = "GJMOY";
			vertBank = "HKPRW";
			break;
		case "B":
			horiBank = "IKLRT";
			vertBank = "CDFYZ";
			break;
		case "C":
			horiBank = "BHIJW";
			vertBank = "DEMTU";
			break;
		case "D":
			horiBank = "IKOPQ";
			vertBank = "CJTUW";
			break;
		case "E":
			horiBank = "ACGIJ";
			vertBank = "KSUWZ";
			break;
		case "F":
			horiBank = "CERVY";
			vertBank = "AGJPQ";
			break;
		case "G":
			horiBank = "ACFNS";
			vertBank = "HOQYZ";
			break;
		case "H":
			horiBank = "LRTUX";
			vertBank = "DKMPS";
			break;
		case "I":
			horiBank = "DLOWZ";
			vertBank = "EFNUV";
			break;
		case "J":
			horiBank = "BQTUW";
			vertBank = "EHIOS";
			break;
		case "K":
			horiBank = "AFPXY";
			vertBank = "DIORZ";
			break;
		case "L":
			horiBank = "GKPTZ";
			vertBank = "ABRVX";
			break;
		case "M":
			horiBank = "EILQT";
			vertBank = "BFPWX";
			break;
		case "N":
			horiBank = "PQRSV";
			vertBank = "AFGHL";
			break;
		case "O":
			horiBank = "HJLUZ";
			vertBank = "IQSTX";
			break;
		case "P":
			horiBank = "DMNOX";
			vertBank = "CFHKR";
			break;
		case "Q":
			horiBank = "CEOPV";
			vertBank = "BDIKN";
			break;
		case "R":
			horiBank = "AEGSU";
			vertBank = "BNOXY";
			break;
		case "S":
			horiBank = "ABEKQ";
			vertBank = "GMVYZ";
			break;
		case "T":
			horiBank = "GVXYZ";
			vertBank = "CJLSU";
			break;
		case "U":
			horiBank = "FMVXZ";
			vertBank = "BILNY";
			break;
		case "V":
			horiBank = "DHMNW";
			vertBank = "AEJQX";
			break;
		case "W":
			horiBank = "DFHMN";
			vertBank = "GLQRT";
			break;
		case "X":
			horiBank = "BDFKW";
			vertBank = "AJNOV";
			break;
		case "Y":
			horiBank = "BCHSU";
			vertBank = "EGMTW";
			break;
		case "Z":
			horiBank = "JNRSY";
			vertBank = "CLMPV";
			break;
	}
	
	if (readPos % 4 > 0) {
		getPeer = getAdjLetter(readId, readPos-1);
		if (horiBank.search(getPeer) >= 0) {
			pressNeeded = true;
		}
	}
	
	if (readPos % 4 < 3) {
		getPeer = getAdjLetter(readId, readPos+1);
		if (horiBank.search(getPeer) >= 0) {
			pressNeeded = true;
		}
	}
	
	if (readPos >= 4) {
		getPeer = getAdjLetter(readId, readPos-4);
		if (vertBank.search(getPeer) >= 0) {
			pressNeeded = true;
		}
	}
	
	if (readPos < 8) {
		getPeer = getAdjLetter(readId, readPos+4);
		if (vertBank.search(getPeer) >= 0) {
			pressNeeded = true;
		}
	}
	
	return (letterPressed == pressNeeded);
}

function getAdjLetter(fetchId, fetchPos) {
	return document.getElementById(fetchId+"adjLet"+fetchPos).innerHTML;
}

function getAdjSolution(readId) {
	var solution = "";
	
	for (var l = 0; l < 12; l++) {
		if (checkAdjLetters(readId,l, true)) {
			solution += getAdjLetter(readId,l);
		} else {
			solution += "_";
		}
		
		if (l % 4 == 3) {
			solution += "\n";
		}
	}
	
	console.warn("The correct solution for Adjacent Letters:\n"+solution);
}

// Modulo functions
function makeAllModulos() {
	var moduloCollection = document.getElementsByClassName("moduloDivisor");
	
	for (var m in moduloCollection) {
		if (moduloCollection[m].className == "moduloDivisor" && moduloCollection[m].id.endsWith("xmV")) {
			var baseId = moduloCollection[m].id.substr(0,moduloCollection[m].id.length-3);
			
			buildModulo(baseId);
		}
	}
}

function buildModulo(readId) {
	var newDivisor = irandom(3,Math.min(15+Math.floor(score/25),29));
	var newDividend = irandom(50,Math.min(999+Math.floor(score/50)*1000,9999));
	var newExponent = 1;
	if (missionFile == "cruelModulo" || (score >= 50 && irandom(1,10) <= 1)) {
		// Upgrade to Cruel Modulo, if certain conditions are met
		newDivisor = irandom(10,Math.min(19+Math.floor(score/25),49));
		newDividend = irandom(50,999);
		newExponent = irandom(10,15+Math.floor(score/25));
	} else {
		document.getElementById(readId+"xmE").style.visibility = "hidden";
	}
	
	document.getElementById(readId+"xmV").innerHTML = newDivisor;
	document.getElementById(readId+"xmD").innerHTML = newDividend;
	document.getElementById(readId+"xmE").innerHTML = newExponent;
	clearModulo(document.getElementById(readId), false);
}

function inputModDigit(readObj, localObj) {
	var actualObj = document.getElementById(readObj.id+"xmI");
	var curVal = actualObj.innerHTML;
	var newDigit = localObj.innerHTML;

	if (readObj.style.borderColor != solveColor) {
		if (curVal == "") {
			actualObj.innerHTML = newDigit;
		} else {
			actualObj.innerHTML = parseInt(curVal) + newDigit;
		}
	}
	
	playSound(buttonSnds[0]);
}

function submitModulo(readObj) {
	var baseId = readObj.id;
	
	var getDivisor = BigInt(document.getElementById(baseId+"xmV").innerHTML);
	var getDividend = BigInt(document.getElementById(baseId+"xmD").innerHTML);
	var getExponent = BigInt(document.getElementById(baseId+"xmE").innerHTML);
	var calcSolution = (getDividend ** getExponent) % getDivisor;
	var getRemainder = document.getElementById(baseId+"xmI").innerHTML;
	
	if (gameActive && readObj.style.borderColor != solveColor) {
		var txtExpression = "Cruel Modulo "+getDividend+"^"+getExponent+" % "+getDivisor;
		if (getExponent == 1) {
			txtExpression = "Modulo "+getDividend+" % "+getDivisor;
		}
		
		if (getRemainder != "" && parseInt(getRemainder) == calcSolution) {
			console.log(txtExpression+" was solved correctly. ("+calcSolution+")");
			solveModule(readObj, true, false, 0);
		} else {
			console.warn(txtExpression+" was solved incorrectly! Your answer was "+getRemainder+". The correct answer was "+calcSolution+".");
			solveModule(readObj, false, false);
			buildModulo(baseId);
		}
	}
	
	playSound(buttonSnds[0]);
}

function clearModulo(readObj, playSnd) {
	if (readObj.style.borderColor != solveColor) {
		document.getElementById(readObj.id+"xmI").innerHTML = "";
	}
	
	if (playSnd) {
		playSound(buttonSnds[0]);
	}
}

// Switches functions
function validateSwitches(readObj, localObj) {
	var baseId = readObj.id;
	var solution = 0;
	var answer = 0;
	
	if (gameActive && readObj.style.borderColor != solveColor) {
		for (var s = 0; s < 5; s++) {
			var solObj = document.getElementById(baseId+"swT"+s);
			var ansObj = document.getElementById(baseId+"swF"+s);
			
			if (solObj.className.endsWith("led")) {
				solution += 2 ** (4 - s);
			}
			
			if (ansObj.checked) {
				answer += 2 ** (4 - s);
			}
		}
		
		if (!switchesValid(answer)) {
			console.warn("Switches had reached an illegal combination! ("+getSwitchBinary(answer)+" is invalid)");
			localObj.checked = (!localObj.checked);
			solveModule(readObj, false, false);
		} else if (answer == solution) {
			console.log("Switches was solved.");
			solveModule(readObj, true, false, 0);
		}
		
		playSound(buttonSnds[0]);
	} else {
		localObj.checked = (!localObj.checked);
	}
}

function switchesValid(inVal) {
	return (inVal != 4 && inVal != 7 && inVal != 15 && inVal != 18 && inVal != 19 &&
		inVal != 23 && inVal != 24 && inVal != 26 && inVal != 28 && inVal != 30);
}

function getSwitchBinary(inVal) {
	return ((inVal + 32) >>> 0).toString(2).slice(-5);
}

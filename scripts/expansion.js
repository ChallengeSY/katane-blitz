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
	if (moduleFile == "cruelModulo" || (score >= 50 && irandom(1,10) <= 1)) {
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

/* ------------------------------------------------------------------------ */

const alphaTable = ["argf", "irnm", "jqxz", "okbv", "pqjs", "qydx",
	"dfw", "hdu", "lxe", "pkd", "qew", "tjl", "vcn", "vsi", "ykq", "zny",
	"ac", "gs", "jr", "op"];
	
const colKeyWords = ["red", "green", "blue", "yellow", "purple", "white"];
const colKeyColors = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 255, 0)", "rgb(255, 0, 255)", "rgb(255, 255, 255)"];
	
const numButTable = [[1,6,14,17,23,31,32,39,45,58,61,66],
	[7,11,21,25,36,41,59,60,76,77,78,82],
	[2,4,9,15,19,24,28,35,42,56,63,69],
	[13,16,18,22,27,30,33,37,51,55,62,74],
	[3,8,12,19,25,32,47,49,63,74,82,85],
	[5,13,21,32,41,42,59,64,72,76,84,85],
	[6,15,16,23,34,37,41,63,71,73,91,99],
	[8,9,14,17,21,25,43,55,75,81,83,88],
	[10,24,36,48,53,61,64,77,80,87,92,95],
	[4,8,15,25,26,31,44,68,73,81,95,97],
	[7,17,35,42,54,67,69,72,86,92,96,100],
	[5,14,22,26,34,48,55,57,86,87,94,96],
	[18,23,32,47,56,63,79,80,91,94,97,100],
	[9,11,17,25,29,37,48,50,63,71,77,80],
	[1,7,12,18,21,25,32,45,57,62,81,96],
	[4,12,25,37,42,59,61,71,84,88,97,98]];

// Alphabet functions

function checkABCsolution(inWord) {
	var finalWord = null;
	
	for (var b = 0; b < alphaTable.length; b++) {
		var hitsFound = 0;
		
		for (var a = 0; a < inWord.length; a++) {
			if (alphaTable[b].search(inWord.charAt(a)) >= 0) {
				hitsFound++;
			}
		}
		
		if (hitsFound == alphaTable[b].length) {
			finalWord = alphaTable[b];
			break;
		}
	}
	
	if (hitsFound < 4) {
		for (var c = 0; c < masterLetterBank.length; c++) {
			if (inWord.search(masterLetterBank.charAt(c)) >= 0 && finalWord.search(masterLetterBank.charAt(c)) < 0) {
				finalWord = finalWord + masterLetterBank.charAt(c);
			}
		}
	}
	
	return finalWord;
}

function pressABCbutton(readObj, keyObj) {
	if (gameActive && keyObj.style.backgroundColor != solveColor) {
		keyPress = parseInt(keyObj.id.slice(-1));
		
		correctPress = true;
		
		for (var q = 0; q < keyPress; q++) {
			compareObj = document.getElementById(readObj.id+"aB"+q);
			
			if (compareObj && compareObj.style.backgroundColor != solveColor) {
				correctPress = false;
				break;
			}
		}
		
		if (correctPress) {
			console.log("Alphabet " + keyObj.innerHTML + " was pressed correctly.")
			keyObj.style.backgroundColor = solveColor;
		} else {
			console.warn("Alphabet " + keyObj.innerHTML + " was pressed incorrectly!")
			keyObj.style.backgroundColor = strikeColor;
			solveModule(readObj, false, false);
		}
	}
	
	allSolved = true;
	
	for (var r = 0; r < 4; r++) {
		compareObj = document.getElementById(readObj.id+"aB"+r);
		
		if (compareObj && compareObj.style.backgroundColor != solveColor) {
			allSolved = false;
			break;
		}
	}
	
	if (allSolved) {
		solveModule(readObj, true, false, 0);
	}
	
	playSound(buttonSnds[0]);
}

// Colored Keys functions

function makeAllColKeys() {
	coloCollection = document.getElementsByClassName("colKeyFrame");
	
	for (var c in coloCollection) {
		if (coloCollection[c].className == "colKeyFrame") {
			makeColKey(coloCollection[c]);
		}
	}
}

function prepColKey(readObj) {
	for (var k = 0; k < 4; k++) {
		document.getElementById(readObj.id+"cK"+k).disabled = true;
	}
	
	setTimeout(function() {makeColKey(readObj)}, 4000);
}

function makeColKey(readObj) {
	var workObj = document.getElementById(readObj.id+"cD");
	
	workObj.style.color = colKeyColors[irandom(0,5)];
	workObj.innerHTML = colKeyWords[irandom(0,5)];

	for (var k = 0; k < 4; k++) {
		workObj = document.getElementById(readObj.id+"cK"+k);
		
		workObj.innerHTML = masterLetterBank[irandom(0,25)];
		workObj.style.backgroundColor = colKeyColors[irandom(0,5)];
		workObj.disabled = false;
	}
}

function colOneToOne(keyColor, labelWord) {
	for (var p = 0; p < 6; p++) {
		if (keyColor == colKeyColors[p] && labelWord == colKeyWords[p]) {
			return true;
		}
	}
	
	return false;
}

function countColKeyHighest(readStyles) {
	var comboFound = [1,1];
	
	for (a = 0; a < 3; a++) {
		comboFound[0] = Math.max(comboFound[0], comboFound[1]);
		comboFound[1] = 1;
		
		for (b = a+1; b < 4; b++) {
			if (readStyles[a] == readStyles[b]) {
				comboFound[1]++;
			}
		}
	}
	
	return comboFound[0];
}

function pressColKey(readObj, readButton) {
	if (gameActive && readObj.style.borderColor != solveColor) {
		var getSlot = readButton.id.slice(-1);
		var getNum = parseInt(getSlot);
		
		var labelTxt = document.getElementById(readObj.id+"cD").innerHTML;
		var labelCol = document.getElementById(readObj.id+"cD").style.backgroundColor;
		
		var slotScore = [0, 0, 0, 0, 0];	
		var correctSlot = -1;
		
		var localLetters = [];
		var localStyles = [];
		var highestColorCount = 1;

		for (var m = 0; m < 3; m++) {
			for (var n = 0; n < 4; n++) {
				
				var workObj = document.getElementById(readObj.id+"cK"+n);
				if (m == 0) {
					localLetters[n] = workObj.innerHTML;
					localStyles[n] = workObj.style.backgroundColor;
				} else if (m == 1) {
					switch (n) {
						case 0:
							if (hasLitIndicator("MSA", true)) {
								slotScore[n]++;
							}
							if (hasLitIndicator("CAR", false)) {
								slotScore[n]++;
							}
							if (getBatteryHolders() % 2 != 0) {
								slotScore[n]++;
							}
							if (getBombPorts("RJ-45") > 0) {
								slotScore[n]++;
							}
							if (localStyles[0] == localStyles[1] || localStyles[0] == localStyles[2] || localStyles[0] == localStyles[3]) {
								slotScore[n]++;
							}
							
							highestColorCount = countColKeyHighest(localStyles);
							break;
							
						case 1:
							if (hasLitIndicator("SIG", true)) {
								slotScore[n]++;
							}
							if (hasLitIndicator("SND", false)) {
								slotScore[n]++;
							}
							if (getBatteries() > 3) {
								slotScore[n]++;
							}
							if (getBombPorts("DVI-D") + getBombPorts("Parallel") > 0) {
								slotScore[n]++;
							}
							if (highestColorCount >= 2) {
								slotScore[n]++;
							}
							break;
							
						case 2:
							if (hasLitIndicator("NSA", true)) {
								slotScore[n]++;
							}
							if (hasLitIndicator("TRN", false)) {
								slotScore[n]++;
							}
							if (getBatteries() <= 0) {
								slotScore[n]++;
							}
							if (getBombPorts("PS/2") + getBombPorts("Serial") > 0) {
								slotScore[n]++;
							}
							if (highestColorCount >= 3) {
								slotScore[n]++;
							}
							break;
							
						case 3:
							if (hasLitIndicator("CLR", true)) {
								slotScore[n]++;
							}
							if (hasLitIndicator("BOB", false)) {
								slotScore[n]++;
							}
							if (getBatteries() % 2 == 0) {
								slotScore[n]++;
							}
							if (getBombPorts("Stereo") > 0) {
								slotScore[n]++;
							}
							if (highestColorCount < 2) {
								slotScore[n]++;
							}
							break;
					}

					if (colOneToOne(localStyles[n], labelTxt)) {
						slotScore[n]++;
					}
					if (localStyles[n] == labelCol) {
						slotScore[n]++;
					}
					if (labelTxt.search(localLetters[n]) >= 0) {
						slotScore[n]++;
					}
					if (getSerial().search(localLetters[n].toUpperCase()) >= 0) {
						slotScore[n]++;
					}
				} else {
					if (slotScore[n] > slotScore[4] || n == 0) {
						slotScore[4] = slotScore[n];
						correctSlot = n;
					}
				}
			}
		}
		
		if (getNum == correctSlot) {
			console.log("Colored Keys solved. The highest score was "+slotScore[4]+" conditions.");
			solveModule(readObj, true, false, 25);
		} else {
			console.warn("Colored Keys striked! Button "+getNum+" had only "+slotScore[getNum]+" conditions. Button "+correctSlot+" has the highest score of "+slotScore[4]+" conditions.");
			solveModule(readObj, false, false);
			if (life > 0) {
				prepColKey(readObj);
			}
		}
	}

	playSound(buttonSnds[0]);
}

// Coprime Checker functions

function makeAllCoprimes() {
	copCollection = document.getElementsByClassName("coprimeFrame");
	
	for (var c in copCollection) {
		if (copCollection[c].className == "coprimeFrame") {
			makeCoprimeStage(copCollection[c]);
		}
	}
}

function makeCoprimeStage(readObj) {
	var stagesFinished = 0;
	for (var s = 1; s <= 3; s++) {
		stageObj = document.getElementById(readObj.id+"cS"+s);
		if (stageObj.style.backgroundColor == stageColor) {
			stagesFinished++;
		}
	}

	if (stagesFinished >= 3) {
		solveModule(readObj, true, false, 0);
	} else if (gameActive) {
		var newInts = [0, 0];
		var copCap = 999 + Math.floor(score / 25) * 200;
		
		var genSol = (irandom(0,1) < 1);
		
		// Protect against infinite loops
		for (var t = 0; t < 64; t++) {
			var numsCoprime = true;
			do {
				newInts = [irandom(2,copCap), irandom(2,copCap)];
			} while (newInts[0] == newInts[1]);
			
			for (var n = 2; n <= Math.min(Math.sqrt(newInts[0]),Math.sqrt(newInts[1])); n++) {
				if (newInts[0] % n == 0 && newInts[1] % n == 0) {
					numsCoprime = false;
					break;
				}
			}
			
			if (numsCoprime == genSol) {
				// Solution found, end the sequence
				break;
			}
		}
		
		document.getElementById(readObj.id+"cT").innerHTML = newInts[0];
		document.getElementById(readObj.id+"cB").innerHTML = newInts[1];
	}
}

function pressCoprimeButton(readObj, flagId) {
	if (gameActive && readObj.style.borderColor != solveColor) {
		var readNums = [parseInt(document.getElementById(readObj.id+"cT").innerHTML), parseInt(document.getElementById(readObj.id+"cB").innerHTML)];
		var numsCoprime = true;
		var getFlag = (flagId.id.slice(-1) == 1);
		
		for (var n = 2; n <= Math.min(Math.sqrt(readNums[0]),Math.sqrt(readNums[1])); n++) {
			if (readNums[0] % n == 0 && readNums[1] % n == 0) {
				numsCoprime = false;
				break;
			}
		}
		
		var stageNum = 1;
		for (var s = 1; s <= 3; s++) {
			stageObj = document.getElementById(readObj.id+"cS"+s);
			if (stageObj.style.backgroundColor == stageColor) {
				stageNum++;
			}
		}

		var pressedCorrect = (getFlag == numsCoprime);
		
		if (pressedCorrect) {
			console.log("Coprime stage "+stageNum+" correct. The correct flag is "+numsCoprime+".")
			
			document.getElementById(readObj.id+"cS"+stageNum).style.backgroundColor = stageColor;
		} else {
			console.warn("Coprime stage "+stageNum+" striked! The correct flag is "+numsCoprime+".")
			solveModule(readObj, false, false);
		}
		
		makeCoprimeStage(readObj);
	}

	playSound(buttonSnds[0]);
}

// Numbered Buttons functions

function makeAllNumButtons() {
	copCollection = document.getElementsByClassName("numButFrame");
	
	for (var c in copCollection) {
		if (copCollection[c].className == "numButFrame") {
			var workId = copCollection[c].id;
			var baseObj = document.getElementById(workId.substring(0,workId.length-3));
			
			makeNumButton(baseObj);
		}
	}
}

function prepNumButton(readObj) {
	setTimeout(function() {makeNumButton(readObj)}, 2000);
}

function makeNumButton(readObj) {
	var guaranRoll = irandom(0,15);
	for (var n = 0; n < 16; n++) {
		stageObj = document.getElementById(readObj.id+"nb"+n);
		
		stageObj.style.backgroundColor = "";
		if (n == guaranRoll) {
			stageObj.innerHTML = numButTable[n][irandom(0,11)];
		} else {
			stageObj.innerHTML = irandom(1,100);
		}
	}
}

function pressNumberedButton(readObj, readButton) {
	if (gameActive && readObj.style.borderColor != solveColor) {
		var getSlot = readButton.id.slice(-2);
		if (getSlot.startsWith("b")) {
			getSlot = parseInt(readButton.id.slice(-1));
		} else {
			getSlot = parseInt(getSlot);
		}
		var getNum = parseInt(readButton.innerHTML);
		var debounceClick = false;
		
		for (var i = 0; i < 16; i++) {
			if (document.getElementById(readObj.id+"nb"+i).style.backgroundColor == strikeColor) {
				debounceClick = true;
			}
		}
		
		if (!debounceClick && readButton.style.backgroundColor != solveColor) {
			var pressedCorrect = false;

			for (var s = 0; s < numButTable[getSlot].length; s++) {
				if (getNum == numButTable[getSlot][s]) {
					pressedCorrect = true;
					break;
				}
			}
			
			var dispPress = getSlot + 1;
			
			if (pressedCorrect) {
				console.log("Numbered Button #"+dispPress+" correct.")
				readButton.style.backgroundColor = solveColor;
				if (checkNumButSols(readObj)) {
					console.log("All required buttons pressed! Numbered Buttons solved.")
					solveModule(readObj, true, false);
				}
			} else {
				console.warn("Numbered Button #"+dispPress+" striked! "+getNum+" was not in the list of accepted integers.")
				readButton.style.backgroundColor = strikeColor;
				solveModule(readObj, false, false);
				if (life > 0) {
					prepNumButton(readObj);
				}
			}
		}
	}

	playSound(buttonSnds[0]);
}

function checkNumButSols(readObj) {
	for (var n = 0; n < 16; n++) {
		stageObj = document.getElementById(readObj.id+"nb"+n);
		
		var solFound = false;
		for (var s = 0; s < numButTable[n].length; s++) {
			if (stageObj.innerHTML == numButTable[n][s]) {
				solFound = true;
				break;
			}
		}
		
		if (stageObj.style.backgroundColor != solveColor && solFound) {
			return false;
		}
	}
	
	return true;
}

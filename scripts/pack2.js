// Constants used throughout this pack

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

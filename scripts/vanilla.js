var simonFlasher = -1;

const buttonLabels = ["Abort", "Detonate", "Hold", "Press"];
const defaultColors = ["rgb(0, 0, 0)", "rgb(0, 0, 255)", "rgb(255, 0, 0)",
	"rgb(255, 255, 255)", "rgb(255, 255, 0)"];
	
const keypadTable = [["&#984;", "Ѧ", "&lambda;", "&#990;", "Ѭ", "&#983;", "&#1023;"],
	["Ӭ", "&#984;", "&#1023;", "Ҩ", "&star;", "&#983;", "¿"],
	["&copy;", "Ѽ", "Ҩ", "&#1046;", "Ԇ", "&lambda;", "&star;"],
	["&#1004;", "&para;", "Ҍ", "Ѭ", "&#1046;", "¿", "ټ"],
	["&psi;", "ټ", "Ҍ", "&#1022;", "&para;", "Ѯ", "&starf;"],
	["&#1004;", "Ӭ", "҂", "&aelig;", "&psi;", "Ҋ", "&Omega;"]];
	
const validMorseFreqs = [505, 515, 522, 532, 535, 542, 545,
	552, 555, 565, 572, 575, 582, 592, 595, 600];
		
const validPasswords = ["about", "after", "again", "below", "could",
	"every", "first", "found", "great", "house",
	"large", "learn", "never", "other", "place",
	"plant", "point", "right", "small", "sound",
	"spell", "still", "study", "their", "there",
	"these", "thing", "think", "three", "water",
	"where", "which", "world", "would", "write"];

const simonColors = [{letter: "B", backLo: "rgb(0, 0, 192)"},
	{letter: "Y", backLo: "rgb(192, 192, 0)"},
	{letter: "R", backLo: "rgb(192, 0, 0)"},
	{letter: "G", backLo: "rgb(0, 192, 0)"}];

const whoseLabels = ["Ur", //Top left
	"First", "Okay", "C", //Top right
	"Yes", "Nothing", "Led", "They Are", //Middle left
	"Blank", "Read", "Red", "You", "Your", "You're", "Their", //Middle right
	"&nbsp;", "Reed", "Leed", "They're", //Bottom left
	"Display", "Says", "No", "Lead", "Hold on", "You are", "There", "See", "Cee"]; //Bottom right

const whoseButtons = [["Ready", "First", "No", "Blank", "Nothing", "Yes", "What",
	"Uhhh", "Left", "Right", "Middle", "Okay", "Wait", "Press"],
	["You", "You are", "Your", "You're", "Ur", "U", "Uh huh",
	"Uh uh", "What?", "Done", "Next", "Hold", "Sure", "Like"]];

// The Button functions

function prepLight(readId) {
	buttonLight = setTimeout(function() {activateLight(readId)}, 500);
	
	playSound(buttonSnds[0]);
}

function activateLight(readId) {
	document.getElementById(readId).style.backgroundColor = defaultColors[irandom(1,4)];
}

function validateButtonPress(readObj) {
	buttonObj = document.getElementById(readObj.id+"b");
	lightObj = document.getElementById(readObj.id+"l");
	clearTimeout(buttonLight);
	
	readColor = lightObj.style.backgroundColor;
	if (readColor == defaultColors[1]) {
		reqTime = 4;
	} else if (readColor == defaultColors[4]) {
		reqTime = 5;
	} else if (readColor == defaultColors[0]) {
		reqTime = NaN;
	} else {
		reqTime = 1;
	}
	timeLeft = document.getElementById("bombTime").innerHTML;
	lightObj.style.backgroundColor = defaultColors[0];
	
	console.log("Big Button was released at "+timeLeft+" remaining. Light indicator required a "+reqTime);
	
	if (buttonObj.innerHTML == buttonLabels[0] && buttonObj.style.backgroundColor == defaultColors[1]) {
		// Blue Abort button
		solveModule(readObj, timeLeft.search(reqTime.toString()) >= 0, false);
	} else if (buttonObj.innerHTML == buttonLabels[1] && getBatteries() > 1) {
		// Detonate button with 2 or more batteries
		solveModule(readObj, isNaN(reqTime), false);
	} else if (buttonObj.style.backgroundColor == defaultColors[3] && hasLitIndicator("CAR",true)) {
		// White button and lit CAR indicator
		solveModule(readObj, timeLeft.search(reqTime.toString()) >= 0, false);
	} else if ((getBatteries() > 2 && hasLitIndicator("FRK",true)) ||
		(buttonObj.innerHTML == buttonLabels[2] && buttonObj.style.backgroundColor == defaultColors[2])) {
		// lit FRK indicator and 3+ batteries; OR Red Hold button
		solveModule(readObj, isNaN(reqTime), false);
	} else {
		// All conditions exhausted
		solveModule(readObj, timeLeft.search(reqTime.toString()) >= 0, false);
	}
	
	playSound(buttonSnds[1]);
}

// Keypad functions

function validateKeypad(readObj, keyObj) {
	if (gameActive && keyObj.style.backgroundColor != solveColor) {
		keyPress = parseInt(keyObj.id.slice(-1));
		
		correctPress = true;
		
		for (var q = 0; q < keyPress; q++) {
			compareObj = document.getElementById(readObj.id+"k"+q);
			
			if (compareObj && compareObj.style.backgroundColor != solveColor) {
				correctPress = false;
				break;
			}
		}
		
		if (correctPress) {
			console.log(keyObj.innerHTML + " was pressed correctly.")
			keyObj.style.backgroundColor = solveColor;
		} else {
			console.warn(keyObj.innerHTML + " was pressed incorrectly!")
			keyObj.style.backgroundColor = strikeColor;
			solveModule(readObj, false, false);
		}
	}
	
	allSolved = true;
	
	for (var r = 0; r < 7; r++) {
		compareObj = document.getElementById(readObj.id+"k"+r);
		
		if (compareObj && compareObj.style.backgroundColor != solveColor) {
			allSolved = false;
			break;
		}
	}
	
	if (allSolved) {
		solveModule(readObj, true, false);
	}
	
	playSound(buttonSnds[0]);
}

// Maze functions

function coordinate(newX, newY) {
	this.x = newX;
	this.y = newY;
	
	this.toString = function() {
		return "("+this.x+","+this.y+")";
	}
}

function makeAllMazes() {
	var mazeCollection = document.getElementsByClassName("mazeButtonX");
	
	for (var m in mazeCollection) {
		if (mazeCollection[m].className == "mazeButtonX" && mazeCollection[m].id.endsWith("mT")) {
			var baseId = mazeCollection[m].id.substr(0,mazeCollection[m].id.length-2)+"m";
			
			buildMaze(baseId, irandom(1,9));
		}
	}
}

function buildMaze(readId, layout) {
	// WIP
	generateMazePoints(readId);
	
	switch (layout) {
		case 1:
			highlightMazeSlot(readId, 1, 2);
			highlightMazeSlot(readId, 6, 3);

			buildMazeWallR(readId, 3, 1);
			buildMazeWallR(readId, 1, 2);
			buildMazeWallR(readId, 3, 2);
			buildMazeWallR(readId, 1, 3);
			buildMazeWallR(readId, 3, 3);
			buildMazeWallR(readId, 1, 4);
			buildMazeWallR(readId, 4, 4);
			buildMazeWallR(readId, 3, 5);
			buildMazeWallR(readId, 5, 5);
			buildMazeWallR(readId, 2, 6);
			buildMazeWallR(readId, 4, 6);

			buildMazeWallB(readId, 2, 1);
			buildMazeWallB(readId, 5, 1);
			buildMazeWallB(readId, 6, 1);
			buildMazeWallB(readId, 3, 2);
			buildMazeWallB(readId, 4, 2);
			buildMazeWallB(readId, 5, 2);
			buildMazeWallB(readId, 2, 3);
			buildMazeWallB(readId, 5, 3);
			buildMazeWallB(readId, 2, 4);
			buildMazeWallB(readId, 3, 4);
			buildMazeWallB(readId, 4, 4);
			buildMazeWallB(readId, 5, 4);
			buildMazeWallB(readId, 2, 5);
			buildMazeWallB(readId, 5, 5);
			break;
			
		case 2:
			highlightMazeSlot(readId, 5, 2);
			highlightMazeSlot(readId, 2, 4);
			
			buildMazeWallR(readId, 3, 1);
			buildMazeWallR(readId, 2, 2);
			buildMazeWallR(readId, 4, 2);
			buildMazeWallR(readId, 1, 3);
			buildMazeWallR(readId, 3, 3);
			buildMazeWallR(readId, 2, 4);
			buildMazeWallR(readId, 4, 4);
			buildMazeWallR(readId, 5, 4);
			buildMazeWallR(readId, 1, 5);
			buildMazeWallR(readId, 2, 5);
			buildMazeWallR(readId, 3, 5);
			buildMazeWallR(readId, 5, 5);
			buildMazeWallR(readId, 1, 6);
			buildMazeWallR(readId, 3, 6);

			buildMazeWallB(readId, 1, 1);
			buildMazeWallB(readId, 3, 1);
			buildMazeWallB(readId, 6, 1);
			buildMazeWallB(readId, 2, 2);
			buildMazeWallB(readId, 4, 2);
			buildMazeWallB(readId, 5, 2);
			buildMazeWallB(readId, 3, 3);
			buildMazeWallB(readId, 5, 3);
			buildMazeWallB(readId, 2, 4);
			buildMazeWallB(readId, 4, 4);
			buildMazeWallB(readId, 5, 5);
			break;

		case 3:
			highlightMazeSlot(readId, 4, 4);
			highlightMazeSlot(readId, 6, 4);

			buildMazeWallR(readId, 3, 1);
			buildMazeWallR(readId, 4, 1);
			buildMazeWallR(readId, 1, 2);
			buildMazeWallR(readId, 2, 2);
			buildMazeWallR(readId, 3, 2);
			buildMazeWallR(readId, 5, 2);
			buildMazeWallR(readId, 2, 3);
			buildMazeWallR(readId, 3, 3);
			buildMazeWallR(readId, 5, 3);
			buildMazeWallR(readId, 1, 4);
			buildMazeWallR(readId, 2, 4);
			buildMazeWallR(readId, 3, 4);
			buildMazeWallR(readId, 4, 4);
			buildMazeWallR(readId, 5, 4);
			buildMazeWallR(readId, 1, 5);
			buildMazeWallR(readId, 3, 5);
			buildMazeWallR(readId, 4, 5);
			buildMazeWallR(readId, 5, 5);
			buildMazeWallR(readId, 4, 6);

			buildMazeWallB(readId, 2, 1);
			buildMazeWallB(readId, 1, 2);
			buildMazeWallB(readId, 4, 2);
			buildMazeWallB(readId, 5, 2);
			buildMazeWallB(readId, 2, 5);
			buildMazeWallB(readId, 3, 5);
			break;
			
		case 4:
			highlightMazeSlot(readId, 1, 1);
			highlightMazeSlot(readId, 1, 4);
			
			buildMazeWallR(readId, 2, 1);
			buildMazeWallR(readId, 1, 2);
			buildMazeWallR(readId, 2, 2);
			buildMazeWallR(readId, 1, 3);
			buildMazeWallR(readId, 3, 3);
			buildMazeWallR(readId, 5, 3);
			buildMazeWallR(readId, 1, 4);
			buildMazeWallR(readId, 5, 5);
			buildMazeWallR(readId, 3, 6);
			buildMazeWallR(readId, 5, 6);

			buildMazeWallB(readId, 3, 1);
			buildMazeWallB(readId, 4, 1);
			buildMazeWallB(readId, 5, 1);
			buildMazeWallB(readId, 4, 2);
			buildMazeWallB(readId, 5, 2);
			buildMazeWallB(readId, 2, 3);
			buildMazeWallB(readId, 3, 3);
			buildMazeWallB(readId, 5, 3);
			buildMazeWallB(readId, 2, 4);
			buildMazeWallB(readId, 3, 4);
			buildMazeWallB(readId, 4, 4);
			buildMazeWallB(readId, 5, 4);
			buildMazeWallB(readId, 2, 5);
			buildMazeWallB(readId, 3, 5);
			buildMazeWallB(readId, 4, 5);
			break;
			
		case 5:
			highlightMazeSlot(readId, 5, 3);
			highlightMazeSlot(readId, 4, 6);

			buildMazeWallR(readId, 5, 2);
			buildMazeWallR(readId, 2, 3);
			buildMazeWallR(readId, 4, 3);
			buildMazeWallR(readId, 1, 4);
			buildMazeWallR(readId, 4, 4);
			buildMazeWallR(readId, 5, 4);
			buildMazeWallR(readId, 1, 5);
			buildMazeWallR(readId, 5, 5);
			buildMazeWallR(readId, 1, 6);
			
			buildMazeWallB(readId, 1, 1);
			buildMazeWallB(readId, 2, 1);
			buildMazeWallB(readId, 3, 1);
			buildMazeWallB(readId, 4, 1);
			buildMazeWallB(readId, 2, 2);
			buildMazeWallB(readId, 3, 2);
			buildMazeWallB(readId, 5, 2);
			buildMazeWallB(readId, 6, 2);
			buildMazeWallB(readId, 3, 3);
			buildMazeWallB(readId, 4, 3);
			buildMazeWallB(readId, 2, 4);
			buildMazeWallB(readId, 3, 4);
			buildMazeWallB(readId, 5, 4);
			buildMazeWallB(readId, 3, 5);
			buildMazeWallB(readId, 4, 5);
			buildMazeWallB(readId, 5, 5);
			break;
			
		case 6:
			highlightMazeSlot(readId, 5, 1);
			highlightMazeSlot(readId, 3, 5);
			
			buildMazeWallR(readId, 1, 1);
			buildMazeWallR(readId, 3, 1);
			buildMazeWallR(readId, 1, 2);
			buildMazeWallR(readId, 2, 2);
			buildMazeWallR(readId, 3, 2);
			buildMazeWallR(readId, 5, 2);
			buildMazeWallR(readId, 2, 3);
			buildMazeWallR(readId, 3, 3);
			buildMazeWallR(readId, 4, 3);
			buildMazeWallR(readId, 2, 4);
			buildMazeWallR(readId, 4, 4);
			buildMazeWallR(readId, 5, 4);
			buildMazeWallR(readId, 2, 5);
			buildMazeWallR(readId, 3, 5);
			buildMazeWallR(readId, 4, 5);
			buildMazeWallR(readId, 4, 6);
			
			buildMazeWallB(readId, 4, 1);
			buildMazeWallB(readId, 5, 2);
			buildMazeWallB(readId, 2, 3);
			buildMazeWallB(readId, 3, 3);
			buildMazeWallB(readId, 6, 3);
			buildMazeWallB(readId, 1, 4);
			buildMazeWallB(readId, 2, 5);
			buildMazeWallB(readId, 3, 5);
			buildMazeWallB(readId, 5, 5);
			break;
			
		case 7:
			highlightMazeSlot(readId, 2, 1);
			highlightMazeSlot(readId, 2, 6);
			
			buildMazeWallR(readId, 4, 1);
			buildMazeWallR(readId, 1, 2);
			buildMazeWallR(readId, 3, 2);
			buildMazeWallR(readId, 5, 2);
			buildMazeWallR(readId, 2, 3);
			buildMazeWallR(readId, 4, 3);
			buildMazeWallR(readId, 2, 4);
			buildMazeWallR(readId, 5, 4);
			buildMazeWallR(readId, 1, 5);
			buildMazeWallR(readId, 2, 5);
			buildMazeWallR(readId, 5, 5);

			buildMazeWallB(readId, 2, 1);
			buildMazeWallB(readId, 3, 1);
			buildMazeWallB(readId, 3, 2);
			buildMazeWallB(readId, 4, 2);
			buildMazeWallB(readId, 5, 2);
			buildMazeWallB(readId, 1, 3);
			buildMazeWallB(readId, 2, 3);
			buildMazeWallB(readId, 4, 3);
			buildMazeWallB(readId, 6, 3);
			buildMazeWallB(readId, 4, 4);
			buildMazeWallB(readId, 5, 4);
			buildMazeWallB(readId, 2, 5);
			buildMazeWallB(readId, 3, 5);
			buildMazeWallB(readId, 4, 5);
			break;
			
		case 8:
			highlightMazeSlot(readId, 4, 1);
			highlightMazeSlot(readId, 3, 4);
			
			buildMazeWallR(readId, 1, 1);
			buildMazeWallR(readId, 4, 1);
			buildMazeWallR(readId, 3, 2);
			buildMazeWallR(readId, 5, 2);
			buildMazeWallR(readId, 1, 3);
			buildMazeWallR(readId, 5, 3);
			buildMazeWallR(readId, 1, 4);
			buildMazeWallR(readId, 3, 4);
			buildMazeWallR(readId, 1, 5);
			buildMazeWallR(readId, 2, 5);

			buildMazeWallB(readId, 3, 1);
			buildMazeWallB(readId, 2, 2);
			buildMazeWallB(readId, 3, 2);
			buildMazeWallB(readId, 4, 2);
			buildMazeWallB(readId, 5, 2);
			buildMazeWallB(readId, 3, 3);
			buildMazeWallB(readId, 4, 3);
			buildMazeWallB(readId, 2, 4);
			buildMazeWallB(readId, 4, 4);
			buildMazeWallB(readId, 5, 4);
			buildMazeWallB(readId, 6, 4);
			buildMazeWallB(readId, 3, 5);
			buildMazeWallB(readId, 4, 5);
			buildMazeWallB(readId, 5, 5);
			buildMazeWallB(readId, 6, 5);
			break;
			
		default:
			highlightMazeSlot(readId, 3, 2);
			highlightMazeSlot(readId, 1, 5);
			
			buildMazeWallR(readId, 1, 1);
			buildMazeWallR(readId, 1, 2);
			buildMazeWallR(readId, 2, 2);
			buildMazeWallR(readId, 4, 2);
			buildMazeWallR(readId, 5, 2);
			buildMazeWallR(readId, 3, 3);
			buildMazeWallR(readId, 5, 3);
			buildMazeWallR(readId, 1, 4);
			buildMazeWallR(readId, 2, 4);
			buildMazeWallR(readId, 4, 4);
			buildMazeWallR(readId, 1, 5);
			buildMazeWallR(readId, 2, 5);
			buildMazeWallR(readId, 3, 5);
			buildMazeWallR(readId, 5, 5);
			buildMazeWallR(readId, 2, 6);
			buildMazeWallR(readId, 4, 6);

			buildMazeWallB(readId, 3, 1);
			buildMazeWallB(readId, 4, 1);
			buildMazeWallB(readId, 4, 2);
			buildMazeWallB(readId, 2, 3);
			buildMazeWallB(readId, 3, 3);
			buildMazeWallB(readId, 5, 3);
			buildMazeWallB(readId, 4, 4);
			buildMazeWallB(readId, 5, 4);
			buildMazeWallB(readId, 6, 5);
			break;
	}
}

function generateMazePoints(commonId) {
	var pInit = new coordinate(irandom(1,6), irandom(1,6));
	var pGoal;
	do {
		pGoal = new coordinate(irandom(1,6), irandom(1,6));
	} while (Math.abs(pInit.x - pGoal.x) + Math.abs(pInit.y - pGoal.y) < 2);
	
	seekObj = document.getElementById(commonId+"x"+pInit.x+"y"+pInit.y);
	seekObj.innerHTML = "&#9632;";
	
	var triangle = irandom(9698,9701);
	seekObj = document.getElementById(commonId+"x"+pGoal.x+"y"+pGoal.y);
	seekObj.className = "mazeGoal " + seekObj.className;
	seekObj.innerHTML = "&#"+triangle+";";
}

function highlightMazeSlot(commonId, coordX, coordY) {
	seekObj = document.getElementById(commonId+"x"+coordX+"y"+coordY);
	
	seekObj.className += "Hilite";
}

function buildMazeWallR(commonId, coordX, coordY) {
	seekObj = document.getElementById(commonId+"x"+coordX+"y"+coordY);
	
	seekObj.className += " mazeWallR";
}

function buildMazeWallB(commonId, coordX, coordY) {
	seekObj = document.getElementById(commonId+"x"+coordX+"y"+coordY);
	
	seekObj.className += " mazeWallB";
}

function getMazeCursor(commonId) {
	for (var b = 1; b <= 6; b++) {
		for (var a = 1; a <= 6; a++) {
			seekObj = document.getElementById(commonId+"x"+a+"y"+b);
			
			if (seekObj.innerHTML != "" && !seekObj.className.startsWith("mazeGoal")) {
				return new coordinate(a, b);
			}
		}
	}
	
	return new coordinate(null, null);
}

function getMazeGoal(commonId) {
	for (var b = 1; b <= 6; b++) {
		for (var a = 1; a <= 6; a++) {
			seekObj = document.getElementById(commonId+"x"+a+"y"+b);
			
			if (seekObj.className.startsWith("mazeGoal")) {
				return new coordinate(a, b);
			}
		}
	}
	
	return new coordinate(null, null);
}

function readMazeSlot(commonId, position) {
	return document.getElementById(commonId+"x"+position.x+"y"+position.y);
}

function mazeMove(readObj, xDelta, yDelta) {
	if (gameActive && readObj.style.borderColor != solveColor) {
		var baseId = readObj.id+"m";
		
		var posCur = getMazeCursor(baseId);
		var testCur = getMazeCursor(baseId);
		var goalCur = getMazeGoal(baseId);
		var moveLegal = false;
		var compareObj = null;
		
		if (xDelta == -1) {
			testCur.x--;
			
			if (testCur.x < 1) {
				console.log(testCur.toString()+" is out of bounds. Move aborted.")
			} else {
				compareObj = readMazeSlot(baseId, testCur);
				if (compareObj.className.search("mazeWallR") >= 0) {
					console.warn("Failed attempt to move to "+testCur.toString()+"!")
					compareObj.className += " mazeStrikeR";
					solveModule(readObj, false, false);
				} else {
					moveLegal = true;
				}
			}
		} else if (xDelta == 1) {
			testCur.x++;
			
			if (testCur.x > 6) {
				console.log(testCur.toString()+" is out of bounds. Move aborted.")
			} else {
				compareObj = readMazeSlot(baseId, posCur);
				if (compareObj.className.search("mazeWallR") >= 0) {
					console.warn("Failed attempt to move to "+testCur.toString()+"!")
					compareObj.className += " mazeStrikeR";
					solveModule(readObj, false, false);
				} else {
					moveLegal = true;
				}
			}
		}
		
		if (yDelta == -1) {
			testCur.y--;
			
			if (testCur.y < 1) {
				console.log(testCur.toString()+" is out of bounds. Move aborted.")
			} else {
				compareObj = readMazeSlot(baseId, testCur);
				if (compareObj.className.search("mazeWallB") >= 0) {
					console.warn("Failed attempt to move to "+testCur.toString()+"!")
					compareObj.className += " mazeStrikeB";
					solveModule(readObj, false, false);
				} else {
					moveLegal = true;
				}
			}
		} else if (yDelta == 1) {
			testCur.y++;
			
			if (testCur.y > 6) {
				console.log(testCur.toString()+" is out of bounds. Move aborted.")
			} else {
				compareObj = readMazeSlot(baseId, posCur);
				if (compareObj.className.search("mazeWallB") >= 0) {
					console.warn("Failed attempt to move to "+testCur.toString()+"!")
					compareObj.className += " mazeStrikeB";
					solveModule(readObj, false, false);
				} else {
					moveLegal = true;
				}
			}
		}
		
		if (moveLegal) {
			console.log("Moved to "+testCur.toString()+".")
			
			readMazeSlot(baseId, posCur).innerHTML = "";
			posCur = testCur;
			if (posCur.toString() == goalCur.toString()) {
				console.log("Maze goal reached. Module solved.")
				solveModule(readObj, true, false);
			} else {
				readMazeSlot(baseId, posCur).innerHTML = "&#9632;";
			}
		}
	}
	
	playSound(buttonSnds[0]);
}

// Memory functions

function makeAllMemories() {
	memCollection = document.getElementsByClassName("memFrame");
	
	for (var m in memCollection) {
		if (memCollection[m].className == "memFrame") {
			clearMemoryStage(memCollection[m]);
		}
	}
}

function prepMemoryStage(readObj) {
	var stagesFinished = document.getElementById(readObj.id+"mMD").innerHTML.length;
	for (var s = 1; s <= 5; s++) {
		stageObj = document.getElementById(readObj.id+"mS"+s);
		if (stagesFinished >= s) {
			stageObj.style.backgroundColor = stageColor;
		} else {
			stageObj.style.backgroundColor = "";
		}
	}

	if (stagesFinished >= 5) {
		solveModule(readObj, true, false);
	} else if (gameActive) {
		setTimeout(function() { clearMemoryStage(readObj) }, 1200);
	}
}

function clearMemoryStage(readObj) {
	document.getElementById(readObj.id+"mD").innerHTML = "..."
	for (var z = 1; z <= 4; z++) {
		document.getElementById(readObj.id+"mB"+z).style.visibility = "hidden";
	}
	
	setTimeout(function() { makeMemoryStage(readObj) }, 1200);
}

function makeMemoryStage(readObj) {
	var dispObj = document.getElementById(readObj.id+"mD");
	var buttonObj = new Array(4);
	for (var a = 1; a <= 4; a++) {
		buttonObj[a-1] = document.getElementById(readObj.id+"mB"+a);
	}

	dispObj.innerHTML = irandom(1,4);

	var buttonPool = [1,2,3,4];
	for (var b = 0; b < 4; b++) {
		var rollNumeral = irandom(0,buttonPool.length-1);
		
		buttonObj[b].innerHTML = buttonPool[rollNumeral];
		buttonObj[b].style.visibility = "";
		buttonObj[b].style.backgroundColor = "";
		buttonPool.splice(rollNumeral, 1);
	}
}

function pressMemoryButton(readObj, pressObj) {
	if (gameActive && readObj.style.borderColor != solveColor) {
		var dispDigit = parseInt(document.getElementById(readObj.id+"mD").innerHTML);
		var memDigitObj = document.getElementById(readObj.id+"mMD");
		var memDigits = memDigitObj.innerHTML;
		var memPositObj = document.getElementById(readObj.id+"mMP");
		var memPosits = memPositObj.innerHTML;
		var stageNum = memDigits.length + 1;
		
		var reqDigit = null;
		var reqPosit = null;
		var debounceClick = false;
		
		switch (stageNum) {
			case 1:
				if (dispDigit < 3) {
					reqPosit = 2;
				} else {
					reqPosit = dispDigit;
				}
				break;
			case 2:
				if (dispDigit == 1) {
					reqDigit = 4;
				} else if (dispDigit == 3) {
					reqPosit = 1;
				} else {
					reqPosit = memPosits.charAt(0);
				}
				break;
			case 3:
				if (dispDigit == 1) {
					reqDigit = memDigits.charAt(1);
				} else if (dispDigit == 2) {
					reqDigit = memDigits.charAt(0);
				} else if (dispDigit == 3) {
					reqPosit = 3;
				} else {
					reqDigit = 4;
				}
				break;
			case 4:
				if (dispDigit == 1) {
					reqPosit = memPosits.charAt(0);
				} else if (dispDigit == 2) {
					reqPosit = 1;
				} else {
					reqPosit = memPosits.charAt(1);
				}
				break;
			case 5:
				if (dispDigit < 3) {
					reqDigit = memDigits.charAt(dispDigit-1);
				} else {
					reqDigit = memDigits.charAt(6-dispDigit);
				}
				break;
		}
		
		for (var i = 1; i <= 4; i++) {
			if (document.getElementById(readObj.id+"mB"+i).style.backgroundColor != "") {
				debounceClick = true;
			}
		}
		
		if (!debounceClick) {
			var tappedDigit = pressObj.innerHTML;
			var tappedPosit = pressObj.id.slice(-1);
			var pressedCorrect = true;
			
			if (reqDigit != null) {
				pressedCorrect = (reqDigit == tappedDigit);
			} else if (reqPosit != null) {
				pressedCorrect = (reqPosit == tappedPosit);
			}
			
			if (pressedCorrect) {
				if (reqDigit != null) {
					console.log("Stage "+stageNum+" correct. The required digit "+reqDigit+" was hit.")
				} else if (reqPosit != null) {
					console.log("Stage "+stageNum+" correct. The required position "+reqPosit+" was hit.")
				}
				
				pressObj.style.backgroundColor = solveColor;
				memDigitObj.innerHTML += tappedDigit;
				memPositObj.innerHTML += tappedPosit;
			} else {
				if (reqDigit != null) {
					console.warn("Stage "+stageNum+" striked! You hit digit "+tappedDigit+". The required digit was "+reqDigit+".")
				} else if (reqPosit != null) {
					console.warn("Stage "+stageNum+" striked! You hit position "+tappedPosit+". The required position was "+reqPosit+".")
				}
				solveModule(readObj, false, false);
				
				if (gameActive) {
					memDigitObj.innerHTML = "";
					memPositObj.innerHTML = "";
				}
				pressObj.style.backgroundColor = strikeColor;
			}
			
			prepMemoryStage(readObj);
		}
	}

	playSound(buttonSnds[0]);
}

// Morse Code functions

function changeMorseFreq(readObj, forward) {
	if (readObj.style.borderColor != solveColor) {
		newFreq = document.getElementById(readObj.id+"f").value;
		if (forward) {
			for (var f = 0; f < validMorseFreqs.length; f++) {
				if (newFreq < 3000 + validMorseFreqs[f]) {
					newFreq = 3000 + validMorseFreqs[f];
					break;
				}
			}
		} else {
			for (var r = validMorseFreqs.length-1; r >=0; r--) {
				if (newFreq > 3000 + validMorseFreqs[r]) {
					newFreq = 3000 + validMorseFreqs[r];
					break;
				}
			}
		}

		document.getElementById(readObj.id+"f").value = newFreq;
	}
	playSound(buttonSnds[0]);
}

function validateMorseCode(readObj, targetFreq) {
	freqObj = document.getElementById(readObj.id+"f");
	readFreq = freqObj.value;
	solveModule(readObj, readFreq == targetFreq, false);

	if (readObj.style.borderColor == solveColor) {
		console.log(readFreq + " KHz was transmitted correctly.");
		freqObj.readOnly = true;
	} else {
		console.warn(readFreq + " KHz was transmitted incorrectly!");
		if (life <= 0) {
			console.warn("The correct frequency was "+targetFreq+" KHz.");
		}
	}
	playSound(buttonSnds[0]);
}

// Password functions

function createRandomPassChars(targWord) {
	letterBanks = new Array(5);
	var columnBanks = new Array(5);
	var dupeWords = false;
	
	const masterLetterBank = 'abcdefghijklmnopqrstuvwxyz';
	
	do {
		dupeWords = 0;
		// Build the columns
		for (var a = 0; a < 5; a++) {
			columnBanks[a] = masterLetterBank;
			letterBanks[a] = new Array(6);
			letterBanks[a][irandom(0,5)] = targWord.charAt(a).toUpperCase();
			var refChar = columnBanks[a].search(targWord.charAt(a));
			columnBanks[a] = masterLetterBank.split("");
			columnBanks[a].splice(refChar, 1);

			for (var b = 0; b < 6; b++) {
				if (!letterBanks[a][b]) {
					refChar = irandom(0,columnBanks[a].length-1);
					letterBanks[a][b] = columnBanks[a].splice(refChar, 1)[0].toUpperCase();
				}
			}
		}
		
		var tempWord
		
		// Validate the columns
		validate: {
			for (var v = 0; v < 6; v++) {
				for (var w = 0; w < 6; w++) {
					for (var x = 0; x < 6; x++) {
						for (var y = 0; y < 6; y++) {
							for (var z = 0; z < 6; z++) {
								tempWord = (letterBanks[0][v]+letterBanks[1][w]+letterBanks[2][x]+letterBanks[3][y]+letterBanks[4][z]).toLowerCase();
								
								for (var c = 0; c < validPasswords.length; c++) {
									if (tempWord == validPasswords[c] && tempWord != targWord) {
										dupeWords = true;
										break validate; //Validation failure, so the entire sequence terminates
									}
								}
							}
						}
					}
				}
			}
		}
	} while (dupeWords);
}

function shiftPassColumn(readObj, columnObj, shiftDown) {
	var column = columnObj.id.slice(-1);
	
	if (readObj.style.borderColor != solveColor) {
		var activeObj = document.getElementById(readObj.id+"p"+column);
		var bankObj = document.getElementById(readObj.id+"b"+column);
		
		if (shiftDown) {
			bankObj.innerHTML += activeObj.innerHTML;
			activeObj.innerHTML = bankObj.innerHTML.charAt(0);
			bankObj.innerHTML = bankObj.innerHTML.substr(1);
		} else {
			bankObj.innerHTML = activeObj.innerHTML + bankObj.innerHTML;
			activeObj.innerHTML = bankObj.innerHTML.charAt(bankObj.innerHTML.length-1);
			bankObj.innerHTML = bankObj.innerHTML.substr(0,bankObj.innerHTML.length-1);
		}
	}

	playSound(buttonSnds[0]);
}

function validatePassword(readObj, expectedPass) {
	readPass = "";
	for (var r = 0; r < 5; r++) {
		readPass += document.getElementById(readObj.id+"p"+r).innerHTML;
	}
	readPass = readPass.toLowerCase();
	solveModule(readObj, readPass == expectedPass, false);
	
	if (readObj.style.borderColor == solveColor) {
		console.log(readPass+" was transmitted correctly.");
	} else {
		console.warn(readPass+" was transmitted incorrectly!");
	}
	if (life <= 0) {
		console.warn(expectedPass+" was the correct password.");
	}

	playSound(buttonSnds[0]);
}

// Simon Says

function convertSimon(readReqs) {
	initialColors = document.getElementById(readReqs).innerHTML;
	reqOutput = "";
	
	for (var c = 0; c < initialColors.length; c++) {
		if (life >= lifeMax) {
			// No lives missing
			if (serialHasVowel()) {
				switch (initialColors.charAt(c)) {
					case "R":
						reqOutput += "B";
						break;
					case "B":
						reqOutput += "R";
						break;
					case "G":
						reqOutput += "Y";
						break;
					case "Y":
						reqOutput += "G";
						break;
				}
			} else {
				switch (initialColors.charAt(c)) {
					case "R":
						reqOutput += "B";
						break;
					case "B":
						reqOutput += "Y";
						break;
					case "G":
						reqOutput += "G";
						break;
					case "Y":
						reqOutput += "R";
						break;
				}
			}
		} else if (life + 1 == lifeMax) {
			// 1 life missing
			if (serialHasVowel()) {
				switch (initialColors.charAt(c)) {
					case "R":
						reqOutput += "Y";
						break;
					case "B":
						reqOutput += "G";
						break;
					case "G":
						reqOutput += "B";
						break;
					case "Y":
						reqOutput += "R";
						break;
				}
			} else {
				switch (initialColors.charAt(c)) {
					case "R":
						reqOutput += "R";
						break;
					case "B":
						reqOutput += "B";
						break;
					case "G":
						reqOutput += "Y";
						break;
					case "Y":
						reqOutput += "G";
						break;
				}
			}
		} else  {
			// 2 or more lives missing
			if (serialHasVowel()) {
				switch (initialColors.charAt(c)) {
					case "R":
						reqOutput += "G";
						break;
					case "B":
						reqOutput += "R";
						break;
					case "G":
						reqOutput += "Y";
						break;
					case "Y":
						reqOutput += "B";
						break;
				}
			} else {
				switch (initialColors.charAt(c)) {
					case "R":
						reqOutput += "Y";
						break;
					case "B":
						reqOutput += "G";
						break;
					case "G":
						reqOutput += "B";
						break;
					case "Y":
						reqOutput += "R";
						break;
				}
			}
		}
	}
	
	return reqOutput;
}

function cycleSimons() {
	simonCycle++;
	maxCycles = 0;

	simonCollection = document.getElementsByTagName("span");
	
	for (var d in spanCollection) {
		if (simonCollection[d].id !== undefined && simonCollection[d].id.endsWith("sX")) {
			baseId = spanCollection[d].id.substr(0,spanCollection[d].id.length-2);
			
			if (document.getElementById(baseId).style.borderColor != solveColor) {
				simonFlashesObj = simonCollection[d];
				simonStageObj = document.getElementById(baseId + "sN");
				simonInputsObj = document.getElementById(baseId + "sP");
				
				simonButtonObjs = new Array(4);
				
				if (simonCycle <= parseInt(simonStageObj.innerHTML)) {
					tarColor = simonFlashesObj.innerHTML.charAt(simonCycle-1);
				} else {
					tarColor = null;
				}
				
				for (var e = 0; e < 4; e++) {
					simonButtonObjs[e] = document.getElementById(baseId + "s" + simonColors[e].letter);
					
					if (tarColor && tarColor == simonColors[e].letter) {
						simonButtonObjs[e].style.animation = "";
						simonButtonObjs[e].offsetLeft;
						simonButtonObjs[e].style.animation = "flash"+simonColors[e].letter+" 1125ms 1";
						if (gameActive && (simonStageObj.innerHTML != "1" || simonInputsObj.innerHTML != "")) {
							playSound(simonSnds[e]);
						}
					}
				}
				
				maxCycles = Math.max(maxCycles, parseInt(simonStageObj.innerHTML) + 5);
			}
		}
	}
	
	if (simonCycle > maxCycles) {
		simonCycle = 0;
	}
}

function makeSimonSolutions() {
	spanCollection = document.getElementsByTagName("span");
	clearInterval(simonFlasher);
	
	for (var r in spanCollection) {
		if (spanCollection[r].id !== undefined) {
			if (spanCollection[r].id.endsWith("sX")) {
				// Generate fresh flashes
				var numStages = irandom(3,5);
				spanCollection[r].innerHTML = "";
				
				for (var t = 0; t < numStages; t++) {
					spanCollection[r].innerHTML += simonColors[irandom(0,3)].letter;
				}
			}
			
			if (spanCollection[r].id.endsWith("sN")) {
				// Reset the stage
				spanCollection[r].innerHTML = 1;
			}
			
			
			if (spanCollection[r].id.endsWith("sP")) {
				// Clear player input
				spanCollection[r].innerHTML = "";
			}
		}
	}
	
	simonCycle = 0;
	simonFlasher = setInterval(cycleSimons, 667);
}

function pressSimonButton(readObj, buttonObj) {
	if (readObj.style.backgroundColor != solveColor) {
		for (var o = 0; o < 4; o++) {
			document.getElementById(readObj.id+"s"+simonColors[o].letter).style.backgroundColor = simonColors[o].backLo;
		}
		
		var buttonPress = buttonObj.id.slice(-1);
		var buttonId;
		switch (buttonPress) {
			case "B":
				buttonId = 0;
				break;
			case "Y":
				buttonId = 1;
				break;
			case "R":
				buttonId = 2;
				break;
			case "G":
				buttonId = 3;
				break;
		}
		
		buttonObj.style.animation = "";
		buttonObj.offsetLeft;
		buttonObj.style.animation = "flash"+simonColors[buttonId].letter+" 1125ms 1";
		playSound(simonSnds[buttonId]);
		
		var reqColors = convertSimon(readObj.id+"sX");
		var buttonCollection = document.getElementById(readObj.id+"sP").innerHTML;
		var stageNum = parseInt(document.getElementById(readObj.id+"sN").innerHTML);
		simonCycle = stageNum + 2;
		
		if (buttonCollection.endsWith("X")) {
			buttonCollection = "";
		}
		buttonCollection += buttonPress;
		
		if (gameActive) {
			if (reqColors.startsWith(buttonCollection)) {
				if (buttonCollection.length == stageNum) {
					console.log("Simon Says stage "+stageNum+" cleared.");
					buttonCollection += "X";
					
					var nextStage = stageNum + 1;
					document.getElementById(readObj.id+"sN").innerHTML = nextStage;
					simonCycle = nextStage + 3;
					
					if (nextStage > reqColors.length) {
						console.log("Simon Says solved.");
						solveModule(readObj, true, false);
						simonCycle = 4;
						makeSimonSolutions();
					}
				}
			} else {
				console.warn("Simon Says stage "+stageNum+" striked!");
				buttonCollection += "X";
				solveModule(readObj, false, false);
			}
			
			document.getElementById(readObj.id+"sP").innerHTML = buttonCollection;
		}
	}
}

// Who's On First functions WIP

function makeAllWhosOnFirsts() {
	whoCollection = document.getElementsByClassName("whoFrame");
	
	for (var w in whoCollection) {
		if (whoCollection[w].className == "whoFrame") {
			clearWhoseStage(whoCollection[w]);
		}
	}
}

function prepWhoseStage(readObj) {
	var stagesFinished = 0;
	for (var s = 1; s <= 3; s++) {
		stageObj = document.getElementById(readObj.id+"wS"+s);
		if (stageObj.style.backgroundColor == stageColor) {
			stagesFinished++;
		}
	}

	if (stagesFinished >= 3) {
		solveModule(readObj, true, false);
	} else if (gameActive) {
		setTimeout(function(){ clearWhoseStage(readObj) }, 1700);
	}
}

function clearWhoseStage(readObj) {
	document.getElementById(readObj.id+"wD").innerHTML = "..."
	for (var z = 1; z <= 6; z++) {
		document.getElementById(readObj.id+"wB"+z).style.visibility = "hidden";
	}
	
	setTimeout(function(){ makeWhoseStage(readObj) }, 1700);
}


function makeWhoseStage(readObj) {
	var dispObj = document.getElementById(readObj.id+"wD");
	var buttonObj = new Array(6);
	for (var a = 1; a <= 6; a++) {
		buttonObj[a-1] = document.getElementById(readObj.id+"wB"+a);
	}

	dispObj.innerHTML = whoseLabels[irandom(0,whoseLabels.length-1)];

	var buttonPool = cloneArray(whoseButtons[irandom(0,1)]);
	for (var b = 0; b < 6; b++) {
		var rollNumeral = irandom(0,buttonPool.length-1);
		
		buttonObj[b].innerHTML = buttonPool[rollNumeral];
		buttonObj[b].style.visibility = "";
		buttonObj[b].style.backgroundColor = "";
		buttonPool.splice(rollNumeral, 1);
	}
}

function pressWhoseButton(readObj, pressObj) {
	if (gameActive && readObj.style.borderColor != solveColor) {
		var dispPhrase = document.getElementById(readObj.id+"wD").innerHTML;
		var stageNum = 1;
		for (var s = 1; s <= 3; s++) {
			stageObj = document.getElementById(readObj.id+"wS"+s);
			if (stageObj.style.backgroundColor == stageColor) {
				stageNum++;
			}
		}
		var auxButton = -1;
		var debounceClick = false;
		
		switch (dispPhrase) {
			case whoseLabels[0]:
				auxButton = 1;
				break;
			case whoseLabels[1]:
				// Fall thru up to 2 times
			case whoseLabels[2]:
			case whoseLabels[3]:
				auxButton = 2;
				break;
			case whoseLabels[4]:
				// Fall thru up to 3 times
			case whoseLabels[5]:
			case whoseLabels[6]:
			case whoseLabels[7]:
				auxButton = 3;
				break;
			case whoseLabels[8]:
				// Fall thru up to 6 times
			case whoseLabels[9]:
			case whoseLabels[10]:
			case whoseLabels[11]:
			case whoseLabels[12]:
			case whoseLabels[13]:
			case whoseLabels[14]:
				auxButton = 4;
				break;
			case whoseLabels[15]:
				// Fall thru up to 3 times
			case whoseLabels[16]:
			case whoseLabels[17]:
			case whoseLabels[18]:
				auxButton = 5;
				break;
			default:
				auxButton = 6;
				break;
		}
		
		auxWord = document.getElementById(readObj.id+"wB"+auxButton).innerHTML;

		reqWord = null;
		pressWord = pressObj.innerHTML;
		
		exButtonBank = null;
		switch (auxWord) {
			case "Ready":
				exButtonBank = ["Yes", "Okay", "What", "Middle", "Left", "Press", "Right", "Blank", "Ready"];
				break;
			case "First":
				exButtonBank = ["Left", "Okay", "Yes", "Middle", "No", "Right", "Nothing", "Uhhh", "Wait", "Ready", "Blank", "What", "Press", "First"];
				break;
			case "No":
				exButtonBank = ["Blank", "Uhhh", "Wait", "First", "What", "Ready", "Right", "Yes", "Nothing", "Left", "Press", "Okay", "No"];
				break;
			case "Blank":
				exButtonBank = ["Wait", "Right", "Okay", "Middle", "Blank"];
				break;
			case "Nothing":
				exButtonBank = ["Uhhh", "Right", "Okay", "Middle", "Yes", "Blank", "No", "Press", "Left", "What", "Wait", "First", "Nothing"];
				break;
			case "Yes":
				exButtonBank = ["Okay", "Right", "Uhhh", "Middle", "First", "What", "Press", "Ready", "Nothing", "Yes"];
				break;
			case "What":
				exButtonBank = ["Uhhh", "What"];
				break;
			case "Uhhh":
				exButtonBank = ["Ready", "Nothing", "Left", "What", "Okay", "Yes", "Right", "No", "Press", "Blank", "Uhhh"];
				break;
			case "Left":
				exButtonBank = ["Right", "Left"];
				break;
			case "Right":
				exButtonBank = ["Yes", "Nothing", "Ready", "Press", "No", "Wait", "What", "Right"];
				break;
			case "Middle":
				exButtonBank = ["Blank", "Ready", "Okay", "What", "Nothing", "Press", "No", "Wait", "Left", "Middle"];
				break;
			case "Okay":
				exButtonBank = ["Middle", "No", "First", "Yes", "Uhhh", "Nothing", "Wait", "Okay"];
				break;
			case "Wait":
				exButtonBank = ["Uhhh", "No", "Blank", "Okay", "Yes", "Left", "First", "Press", "What", "Wait"];
				break;
			case "Press":
				exButtonBank = ["Right", "Middle", "Yes", "Ready", "Press"];
				break;
				
			case "You":
				exButtonBank = ["Sure", "You are", "Your", "You're", "Next", "Uh huh", "Ur", "Hold", "What?", "You"];
				break;
			case "You are":
				exButtonBank = ["Your", "Next", "Like", "Uh huh", "What?", "Done", "Uh uh", "Hold", "You", "U", "You're", "Sure", "Ur", "You are"];
				break;
			case "Your":
				exButtonBank = ["Uh uh", "You are", "Uh huh", "Your", "Next", "Ur", "Sure", "U", "You're", "You", "What?", "Hold", "Like", "Done"];
				break;
			case "You're":
				exButtonBank = ["You", "You're"];
				break;
			case "Ur":
				exButtonBank = ["Done", "U", "Ur"];
				break;
			case "U":
				exButtonBank = ["Uh huh", "Sure", "Next", "What?", "You're", "Ur", "Uh uh", "Done", "U"];
				break;
			case "Uh huh":
				exButtonBank = ["Uh huh"];
				break;
			case "Uh uh":
				exButtonBank = ["Ur", "U", "You are", "You're", "Next", "Uh uh"];
				break;
			case "What?":
				exButtonBank = ["You", "Hold", "You're", "Your", "U", "Done", "Uh uh", "Like", "You are", "Uh huh", "Ur", "Next", "What?"];
				break;
			case "Done":
				exButtonBank = ["Sure", "Uh huh", "Next", "What?", "Your", "Ur", "You're", "Hold", "Like", "You", "U", "You are", "Uh uh", "Done"];
				break;
			case "Next":
				exButtonBank = ["What?", "Uh huh", "Uh uh", "Your", "Hold", "Sure", "Next"];
				break;
			case "Hold":
				exButtonBank = ["You are", "U", "Done", "Uh uh", "You", "Ur", "Sure", "What?", "You're", "Next", "Hold"];
				break;
			case "Sure":
				exButtonBank = ["You are", "Done", "Like", "You're", "You", "Hold", "Uh huh", "Ur", "Sure"];
				break;
			case "Like":
				exButtonBank = ["You're", "Next", "U", "Ur", "Hold", "Done", "Uh uh", "What?", "Uh huh", "You", "Like"];
				break;
		}
		
		whosBankLoop: {
			var buttonObj = new Array(6);
			for (var b = 1; b <= 6; b++) {
				buttonObj[b-1] = document.getElementById(readObj.id+"wB"+b);
				if (buttonObj[b-1].style.backgroundColor != "") {
					debounceClick = true;
					break whosBankLoop;
				}
			}
			
			for (var r = 0; r < exButtonBank.length; r++) {
				for (var c = 0; c <= 5; c++) {
					if (exButtonBank[r] == buttonObj[c].innerHTML) {
						reqWord = exButtonBank[r];
						break whosBankLoop;
					}
				}
			}
		}

		if (!debounceClick) {
			var pressedCorrect = (pressWord == reqWord);
		
			if (pressedCorrect) {
				console.log("Stage "+stageNum+" correct. "+pressWord+" was pressed.");
				document.getElementById(readObj.id+"wS"+stageNum).style.backgroundColor = stageColor;
				pressObj.style.backgroundColor = solveColor;
			} else {
				console.warn("Stage "+stageNum+" striked! Tapped button was "+pressWord+". Correct button was "+reqWord+".")
				solveModule(readObj, false, false);
				pressObj.style.backgroundColor = strikeColor;
			}
			
			prepWhoseStage(readObj);
		}
	}

	playSound(buttonSnds[0]);
}

// Complicated Wires object and functions

function complicatedWire() {
	this.ledLight = false;
	this.wireBlue = false;
	this.wireRed = false;
	this.wireWhite = true;
	this.starSymbol = false;
	
	this.buildRandomWire = function() {
		this.ledLight = (Math.random() < 0.5);
		this.wireBlue = (Math.random() < 0.5);
		this.wireRed = (Math.random() < 0.5);
		this.wireWhite = (Math.random() < 0.5); //Semi-cosmetic option
		this.starSymbol = (Math.random() < 0.5);
					
		if (this.wireBlue && this.wireRed) {
			// A wire that is both red and blue can't also be white
			this.wireWhite = false;
		} else if (!this.wireBlue && !this.wireRed) {
			// A wire that is neither red nor blue must be white
			this.wireWhite = true;
		}
	}
	
	this.reconstructWire = function(readId, readWire) {
		this.ledLight = (document.getElementById(readId+"vL"+readWire).className.endsWith("led"));
		
		var activeWireClass = document.getElementById(readId+"vW"+readWire).className;
		
		this.wireBlue = (activeWireClass.endsWith("vennB") || activeWireClass.endsWith("vennBR") || activeWireClass.endsWith("vennBW"))
		this.wireRed = (activeWireClass.endsWith("vennBR") || activeWireClass.endsWith("vennR") || activeWireClass.endsWith("vennRW"))

		this.starSymbol = (document.getElementById(readId+"vS"+readWire).innerHTML != "");
	}
	
	this.wireCuttable = function(bombStruck) {
		if ((this.ledLight && this.wireBlue && this.wireRed && this.starSymbol) ||
			(!this.ledLight && this.wireBlue && !this.wireRed && this.starSymbol) ||
			(this.ledLight && !this.wireBlue && !this.wireRed && !this.starSymbol)) {
			// These wires can never be cut
			if (bombStruck) {
				console.warn("This venn wire can never be cut.");
			}
			return false;
		} else if ((!this.ledLight && !this.wireBlue && this.wireRed && !this.starSymbol) ||
			(!this.ledLight && this.wireBlue && !this.wireRed && !this.starSymbol) ||
			(this.ledLight && this.wireBlue && this.wireRed && !this.starSymbol) ||
			(!this.ledLight && this.wireBlue && this.wireRed && !this.starSymbol)) {
			// These wires can only be cut if the last digit is even
			if (bombStruck) {
				console.warn("This venn wire requires that the last digit be even in order to cut.");
			}
			return (lastDigitEven());
		} else if ((this.ledLight && !this.wireBlue && !this.wireRed && this.starSymbol) ||
			(this.ledLight && !this.wireBlue && this.wireRed && !this.starSymbol) ||
			(this.ledLight && !this.wireBlue && this.wireRed && this.starSymbol)) {
			// These wires require two or more batteries to be safely cut
			if (bombStruck) {
				console.warn("This venn wire requires two or more batteries in order to cut.");
			}
			return (getBatteries() >= 2);
		} else if ((!this.ledLight && this.wireBlue && this.wireRed && this.starSymbol) ||
			(this.ledLight && this.wireBlue && !this.wireRed && !this.starSymbol) ||
			(this.ledLight && this.wireBlue && !this.wireRed && this.starSymbol)) {
			// These wires require a parallel port to be present
			if (bombStruck) {
				console.warn("This venn wire requires one or more parallel ports in order to cut.");
			}
			return (getBombPorts("Parallel") > 0);
		}
		
		// All conditions exhausted. These wires are always cuttable
		return true;
	}
}

function cutVennWire(readObj, wireObj) {
	if (life > 0 && wireObj.innerHTML == "") {
		wireObj.innerHTML = "&#9986;";
		
		wireCut = parseInt(wireObj.id.slice(-1));
		var refWire = new complicatedWire();
		refWire.reconstructWire(readObj.id, wireCut);
		
		if (refWire.wireCuttable(false)) {
			console.log("Venn wire "+wireCut+" was cut correctly.");
			
			var allWiresCut = true;
			for (var c = 1; c <= 6; c++) {
				var compareObj = document.getElementById(readObj.id+"vW"+c)
				if (compareObj) {
					var compareWire = new complicatedWire();
					compareWire.reconstructWire(readObj.id, c);
					
					if (compareWire.wireCuttable(false) && compareObj.innerHTML == "") {
						allWiresCut = false;
						break;
					}
				}
			}
			
			if (allWiresCut) {
				console.log("All correct Venn wires cut.");
				solveModule(readObj, true, false);
			}
		} else {
			console.warn("Venn wire "+wireCut+" was cut incorrectly!");
			refWire.wireCuttable(true);
			solveModule(readObj, false, true); // Can still strike post-solve
		}
	}
	// TODO
	
	playSound(buttonSnds[0]);
}

// Wires functions

function cutWire(readObj, wireObj) {
	if (life > 0 && wireObj.innerHTML == "") {
		wireObj.innerHTML = "&#9986;";
		
		wireCut = parseInt(wireObj.id.slice(-1));
		
		colorCounts = [0,0,0,0,0];
		correctWire = 0;
		for (var r = 1; r <= 6; r++) {
			compareObj = document.getElementById(readObj.id+"w"+r);
			
			if (compareObj) {
				wireCount = r;
				
				for (var c = 0; c < defaultColors.length; c++) {
					if (compareObj.style.backgroundColor == defaultColors[c]) {
						colorCounts[c]++;
						break;
					}
				}
			}
		}
		
		switch (wireCount) {
			case 3:
				if (colorCounts[2] == 0) {
					// No red wires
					correctWire = 2;
				} else if (colorCounts[1] >= 2) {
					// 2 or more blue wires (only effective if 2B 1R)
					for (var b = 3; b >= 1; b--) {
						compareObj = document.getElementById(readObj.id+"w"+b);
						
						if (compareObj.style.backgroundColor == defaultColors[1]) {
							correctWire = b;
							break;
						}
					}
				} else {
					// All conditions exhausted
					correctWire = 3;
				}
				break;
				
			case 4:
				if (colorCounts[2] >= 2 && !lastDigitEven()) {
					// 2 or more reds and odd serial
					for (var r = 4; r >= 1; r--) {
						compareObj = document.getElementById(readObj.id+"w"+r);
						
						if (compareObj.style.backgroundColor == defaultColors[2]) {
							correctWire = r;
							break;
						}
					}
				} else if (colorCounts[1] == 1 || (colorCounts[2] == 0 && 
					document.getElementById(readObj.id+"w4").style.backgroundColor == defaultColors[4])) {
					// Last wire is yellow, and no red wires; or exactly 1 blue wire
					correctWire = 1;
				} else if (colorCounts[4] > 1) {
					// 2 or more yellow wires
					correctWire = 4;
				} else {
					// All conditions exhausted
					correctWire = 2;
				}
				break;

			case 5:
				if (!lastDigitEven() &&
					document.getElementById(readObj.id+"w5").style.backgroundColor == defaultColors[0]) {
					// Last wire is black, and odd serial
					correctWire = 4;
				} else if (colorCounts[2] == 1 && colorCounts[4] > 1) {
					// Exactly 1 red wire and 2+ yellow wires
					correctWire = 1;
				} else if (colorCounts[0] == 0) {
					// No black wires
					correctWire = 2;
				} else {
					// All conditions exhausted
					correctWire = 1;
				}
				break;
				
			case 6:
				if (colorCounts[4] == 0 && !lastDigitEven()) {
					// No yellow wires and odd serial
					correctWire = 3;
				} else if (colorCounts[4] == 1 && colorCounts[3] > 1) {
					// Exactly 1 yellow wire and 2+ white wires
					correctWire = 4;
				} else if (colorCounts[2] == 0) {
					// No red wires
					correctWire = 6;
				} else {
					// All conditions exhausted
					correctWire = 4;
				}
				break;
		}
		
		solveModule(readObj, (wireCut == correctWire), true);
		if (readObj.style.borderColor == solveColor) {
			console.log("Wire "+wireCut+" was cut correctly.");
		} else {
			console.warn("Wire "+wireCut+" was cut incorrectly!");
		}
		if (life <= 0) {
			console.warn("Wire "+correctWire+" was the correct wire.");
		}
	}
	
	playSound(buttonSnds[0]);
}

// Wire Sequence functions

function setWireSeqButtons(readObj, enabled) {
	var baseId = readObj.id+"q";
	
	document.getElementById(baseId+"B").disabled = !enabled;
	document.getElementById(baseId+"F").disabled = !enabled;
}

function queueWireSeqStage(readObj, forward) {
	var baseId = readObj.id+"q";
	
	for (var w = 1; w <= 12; w += 3) {
		if (document.getElementById(baseId+"N"+w).style.display != "none") {
			curStage = Math.ceil(w/3);
			break;
		}
	}
	
	if (curStage > 1 && !forward) {
		setWireSeqButtons(readObj, false);
		var newStage = curStage - 1;

		console.log("Backtracking to stage "+newStage+".");
		setTimeout(function() {openWireSeqStage(readObj, newStage)}, 750);
	} else if (forward) {
		var answerKey = document.getElementById(baseId+"A").innerHTML;
		var canAdvance = true;

		for (var v = (curStage-1)*3; v <= curStage*3; v++) {
			var wireObj = document.getElementById(baseId+"W"+v);
			
			if (wireObj && wireObj.innerHTML == "" && answerKey.charAt(v-1) == "C") {
				canAdvance = false;
				break;
			}
		}
		
		if (canAdvance) {
			setWireSeqButtons(readObj, false);
			var newStage = curStage + 1;
			document.getElementById(baseId+"S"+curStage).style.backgroundColor = stageColor;

			if (newStage <= 4) {
				console.log("Advancing correctly to stage "+newStage+".");
				setTimeout(function() {openWireSeqStage(readObj, newStage)}, 750);
			} else {
				console.log("Wire Sequence solved.");
				solveModule(readObj, true, false);
			}
		} else {
			console.warn("Wire Sequence striked! One or more required wires in stage "+curStage+" were missed!");
			solveModule(readObj, false, false);
		}
	}
	
	playSound(buttonSnds[0]);
}

function openWireSeqStage(readObj, stageNum) {
	var baseId = readObj.id+"q";
	
	for (var w = 1; w <= 12; w++) {
		if (w > (stageNum-1)*3 && w <= stageNum*3) {
			document.getElementById(baseId+"N"+w).style.display = "";
			document.getElementById(baseId+"W"+w).style.display = "";
			document.getElementById(baseId+"L"+w).style.display = "";
		} else {
			document.getElementById(baseId+"N"+w).style.display = "none";
			document.getElementById(baseId+"W"+w).style.display = "none";
			document.getElementById(baseId+"L"+w).style.display = "none";
		}
	}

	setWireSeqButtons(readObj, true);
}

function cutSeqWire(readObj, wireObj) {
	if (gameActive && readObj.style.backgroundColor != solveColor && wireObj.innerHTML == "") {
		wireObj.innerHTML = "&#9986;";
		
		wireCut = parseInt(wireObj.id.slice(-2));
		if (isNaN(wireCut)) {
			wireCut = parseInt(wireObj.id.slice(-1));
		}

		var answerKey = document.getElementById(readObj.id+"qA").innerHTML;
		
		if (answerKey.charAt(wireCut-1) == "C") {
			console.log("Seq Wire "+wireCut+" was cut correctly.");
		} else {
			console.warn("Seq Wire "+wireCut+" was cut incorrectly!");
			solveModule(readObj, false, false);
		}
	}		
	
	playSound(buttonSnds[0]);
}

// Needy Capacitor functions

function setNeedyButtons(readObj, enabled) {
	var baseId = readObj.id+"n";
	
	var buttonLetters = ['D', 'B', 'Y', 'N'];
	
	for (var i = 0; i < buttonLetters.length; i++) {
		var findObj = document.getElementById(baseId+buttonLetters[i]);
		
		if (findObj) {
			findObj.disabled = !enabled;
		}
	}
}

function activateCapacitor(readObj, newState) {
	baseId = readObj.id+"n";
	displayObj = document.getElementById(baseId+"V");
	meterObj = document.getElementById(baseId+"H");
	timerObj = document.getElementById(baseId+"T");
	
	if (newState) {
		playSound(beepSnd);
	} else {
		timerObj.innerHTML = "&nbsp;";
	}
	
	setNeedyButtons(readObj, newState);
}

function dischargeCapacitor(readObj, newState) {
	baseId = readObj.id+"n";
	buttonObj = document.getElementById(baseId+"D");
	
	if (newState) {
		buttonObj.innerHTML = "Discharging";
		playSound(buttonSnds[0]);
	} else if (buttonObj.innerHTML == "Discharging") {
		playSound(buttonSnds[1]);
		buttonObj.innerHTML = "Discharge!";
	}
}

// Needy Knob functions

function setKnobLight(readObj, position, newState) {
	baseId = readObj.id+"n";
	lightObj = document.getElementById(baseId+"L"+position);
	
	if (newState) {
		lightObj.style.backgroundColor = stageColor;
	} else {
		lightObj.style.backgroundColor = "";
	}
}

function activateKnob(readObj, newState) {
	baseId = readObj.id+"n";
	displayObj = document.getElementById(baseId+"K");
	meterObj = document.getElementById(baseId+"H");
	timerObj = document.getElementById(baseId+"T");
	answerObj = document.getElementById(baseId+"A");
	
	if (newState) {
		playSound(beepSnd);
		
		var rotateDeg = irandom(0,3) * 90;
		var reqDeg = irandom(0,7) * 90;
		var lightsVariation = (irandom(0,1) == 1);
		
		displayObj.style.transform = "rotate("+rotateDeg+"deg)";
		answerObj.innerHTML = reqDeg % 360;
		
		switch(reqDeg) {
			//Up
			case 0:
				setKnobLight(readObj,3,true);
				setKnobLight(readObj,5,true);
				setKnobLight(readObj,6,true);
				setKnobLight(readObj,7,true);
				setKnobLight(readObj,8,true);
				setKnobLight(readObj,9,true);
				setKnobLight(readObj,10,true);
				setKnobLight(readObj,12,true);
				break;
				
			case 360:
				setKnobLight(readObj,1,true);
				setKnobLight(readObj,3,true);
				setKnobLight(readObj,5,true);
				setKnobLight(readObj,8,true);
				setKnobLight(readObj,9,true);
				setKnobLight(readObj,11,true);
				setKnobLight(readObj,12,true);
				break;
				
			//Down
			case 180:
				setKnobLight(readObj,2,true);
				setKnobLight(readObj,3,true);
				setKnobLight(readObj,6,true);
				setKnobLight(readObj,7,true);
				setKnobLight(readObj,8,true);
				setKnobLight(readObj,9,true);
				setKnobLight(readObj,10,true);
				setKnobLight(readObj,12,true);
				break;
				
			case 540:
				setKnobLight(readObj,1,true);
				setKnobLight(readObj,3,true);
				setKnobLight(readObj,5,true);
				setKnobLight(readObj,8,true);
				setKnobLight(readObj,12,true);
				break;
				
			//Left
			case 270:
				setKnobLight(readObj,5,true);
				setKnobLight(readObj,7,true);
				setKnobLight(readObj,10,true);
				setKnobLight(readObj,11,true);
				setKnobLight(readObj,12,true);
				break;
				
			case 630:
				setKnobLight(readObj,5,true);
				setKnobLight(readObj,10,true);
				setKnobLight(readObj,11,true);
				break;
				
			//Right
			case 90:
				setKnobLight(readObj,1,true);
				setKnobLight(readObj,3,true);
				setKnobLight(readObj,4,true);
				setKnobLight(readObj,5,true);
				setKnobLight(readObj,6,true);
				setKnobLight(readObj,7,true);
				setKnobLight(readObj,8,true);
				setKnobLight(readObj,9,true);
				setKnobLight(readObj,11,true);
				break;
				
			case 450:
				setKnobLight(readObj,1,true);
				setKnobLight(readObj,3,true);
				setKnobLight(readObj,4,true);
				setKnobLight(readObj,7,true);
				setKnobLight(readObj,8,true);
				setKnobLight(readObj,9,true);
				setKnobLight(readObj,11,true);
				break;
		}
	} else {
		meterObj.value = irandom(Math.round(10/needyCycleDur),Math.round(40/needyCycleDur)) * -needyCycleDur;
		timerObj.innerHTML = "&nbsp;";
		
		for (var l = 1; l <= 12; l++) {
			setKnobLight(readObj, l, false);
		}
	}
	
	setNeedyButtons(readObj, newState);
}

function rotateKnob(readButton) {
	readDegrees = 0;
	if (readButton.style.transform) {
		readDegrees = parseInt(readButton.style.transform.substr(7,3));
	}
	newDegrees = (readDegrees + 90) % 360;
	
	readButton.style.transform = "rotate("+newDegrees+"deg)";
	playSound(buttonSnds[0]);
}

function validateKnob(readObj) {
	baseId = readObj.id+"n";
	buttonObj = document.getElementById(baseId+"B");
	answerObj = document.getElementById(baseId+"A");
	
	readDegrees = 0;
	if (buttonObj && buttonObj.style.transform) {
		readDegrees = parseInt(buttonObj.style.transform.substr(7,3));
	}
	
	if (answerObj) {
		reqDegrees = answerObj.innerHTML;
	} else {
		reqDegrees = Infinity;
	}
	
	return (readDegrees == reqDegrees);
}

// Needy Vent Gas funcitons

function activateVentGas(readObj, newState, alwaysVent) {
	baseId = readObj.id+"n";
	displayObj = document.getElementById(baseId+"V");
	meterObj = document.getElementById(baseId+"H");
	timerObj = document.getElementById(baseId+"T");
	
	if (newState) {
		if (alwaysVent || Math.random() < 0.85) {
			displayObj.innerHTML = "Vent gas?"
		} else {
			displayObj.innerHTML = "Detonate?"
		}
		if (!alwaysVent) {
			playSound(beepSnd);
		}
	} else {
		displayObj.innerHTML = "&nbsp;";
		meterObj.value = irandom(Math.round(10/needyCycleDur),Math.round(40/needyCycleDur)) * -needyCycleDur;
		timerObj.innerHTML = "&nbsp;";
	}
	
	setNeedyButtons(readObj, newState);
}

function answerVentGas(readObj, affirm) {
	baseId = readObj.id+"n";
	displayObj = document.getElementById(baseId+"V");
	timerObj = document.getElementById(baseId+"T");
	
	setNeedyButtons(readObj, false);
	setTimeout(function() {validateVentGas(readObj, affirm)}, 2000);
	playSound(buttonSnds[0]);
}

function validateVentGas(readObj, affirm) {
	baseId = readObj.id+"n";
	displayObj = document.getElementById(baseId+"V");
	timerObj = document.getElementById(baseId+"T");
	
	if (affirm) {
		if (displayObj.innerHTML.startsWith("Detonate")) {
			console.warn("Needy module was ordered to detonate!")
			solveModule(readObj, false, true);
			activateVentGas(readObj, false, false);
		} else {
			console.log("Needy module has successfully vented gas.")
			activateVentGas(readObj, false, false);
			displayObj.innerHTML = "Venting complete.";
		}
	} else {
		if (displayObj.innerHTML.startsWith("Detonate")) {
			console.log("Needy module has successfully avoided detonation.")
			activateVentGas(readObj, false, false);
		} else {
			console.log("Needy module still needs to vent gas.")
			displayObj.innerHTML = "Venting prevents explosions.";
			setTimeout(function() {activateVentGas(readObj, true, true)}, 5000);
		}
	}
}

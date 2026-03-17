const colFlashWords = ["red", "green", "blue", "yellow", "magenta", "white"];
const colFlashColors = colKeyColors;

var colourCycle = -2;
var colourFlasher = -1;

const colSquareGoals = [
	["col", "row", "col", "row", "col", "row", "col"],
	["pal0", "pal2", "pal4", "row", "pal1", "pal3", "col"],
	["row", "pal4", "col", "pal3", "pal2", "pal1", "pal0"],
	["col", "pal2", "pal4", "pal0", "pal3", "row", "pal1"],
	["pal0", "pal3", "row", "col", "pal1", "pal4", "pal2"],
	["pal1", "col", "row", "pal0", "pal4", "pal2", "pal3"],
	["col", "pal3", "pal0", "pal1", "row", "pal4", "pal2"],
	["pal4", "pal0", "pal1", "pal2", "pal3", "col", "row"],
	["pal1", "row", "col", "pal2", "pal4", "pal3", "pal0"],
	["pal4", "pal0", "pal3", "pal1", "col", "pal2", "row"],
	["pal3", "row", "pal2", "pal4", "col", "pal0", "pal1"],
	["pal2", "pal1", "pal3", "col", "pal0", "row", "pal4"],
	["pal3", "pal4", "pal1", "row", "pal2", "pal0", "col"],
	["row", "pal1", "pal2", "pal4", "pal0", "col", "pal3"],
	["pal2", "col", "pal0", "pal3", "row", "pal1", "pal4"]];
const colSquareColors = colKeyColors;
const colSquareNames = colFlashWords;
var colSquareHandle = [];

const tbButtonLabels = "bcdegkptvz";
var twoBitHandle = [];

const tbQueryTable = [
  "kb", "dk", "gv", "tk", "pv", "kp", "bv", "vt", "pz", "dt",
  "ee", "zk", "ke", "ck", "zp", "pp", "tp", "tg", "pd", "pt",
  "tz", "eb", "ec", "cc", "cz", "zv", "cv", "gc", "bt", "gt",
  "bz", "pk", "kz", "kg", "vd", "ce", "vb", "kd", "gg", "dg",
  "pb", "vv", "ge", "kv", "dz", "pe", "db", "cd", "td", "cb",
  "gb", "tv", "kk", "bg", "bp", "vp", "ep", "tt", "ed", "zg",
  "de", "dd", "ev", "te", "zd", "bb", "pc", "bd", "kc", "zb",
  "eg", "bc", "tc", "ze", "zc", "gp", "et", "vc", "tb", "vz",
  "ez", "ek", "dv", "cg", "ve", "dp", "bk", "pg", "gk", "gz",
  "kt", "ct", "zz", "vg", "gd", "cp", "be", "zt", "vk", "dc"];

const LOactive = "rgb(128, 255, 128)";

// Colour Flash functions

// Ensure that there is a valid solution to each module
function fixAllColFlashes() {
	coloCollection = document.getElementsByClassName("colFlashFrame");
	clearInterval(colourFlasher);
	
	for (var c in coloCollection) {
		if (coloCollection[c].className == "colFlashFrame") {
			var workId = coloCollection[c].id;
			var baseId = workId.substring(0,workId.length-3);
			
			lastCol = document.getElementById(baseId+"cfW8").style.color;
			switch (lastCol) {
				case colFlashColors[0]: // Red
					if (countCFwords(baseId, colFlashWords[4], false) == 0) {
						mutateCFentry(baseId, irandom(1,8), colFlashWords[4], null);
					}
					if (countCFwords(baseId, colFlashWords[5], false) == 0 &&
						countCFcolors(baseId, colFlashColors[5], false) == 0) {
						mutateCFentry(baseId, irandom(1,7), null, colFlashColors[5]);
					}
					break;
					
				case colFlashColors[1]: // Green
					while ((countCFwords(baseId, colFlashWords[3], false) == 0 &&
							countCFcolors(baseId, colFlashColors[3], false) == 0) ||
							countCFmatches(baseId, true, false) == 0) {
						if (countCFwords(baseId, colFlashWords[3], false) == 0 &&
							countCFcolors(baseId, colFlashColors[3], false) == 0) {
							mutateCFentry(baseId, irandom(1,7), null, colFlashColors[3]);
						}
						
						if (countCFmatches(baseId, true, false) == 0) {
							mutateCFentry(baseId, irandom(1,7), "makeMatch", null);
						}
					}
					break;
					
				case colFlashColors[2]: // Blue
					while (countCFpairs(baseId, colFlashWords[5], colFlashColors[0], false) == 0 ||
						countCFcolors(baseId, colFlashColors[1], false) == 0) {
						if (countCFpairs(baseId, colFlashWords[5], colFlashColors[0], false) == 0) {
							mutateCFentry(baseId, irandom(1,7), colFlashWords[5], colFlashColors[0]);
						}
						
						if (countCFcolors(baseId, colFlashColors[1], false) == 0) {
							mutateCFentry(baseId, irandom(1,7), null, colFlashColors[1]);
						}
					}
					break;
					
				case colFlashColors[3]: // Yellow
					if (countCFcolors(baseId, colFlashColors[4], false) < 1) {
						mutateCFentry(baseId, irandom(1,7), null, colFlashColors[4]);
					}
					break;
					
				case colFlashColors[4]: // Magenta
					var ensureCol = convertCFwordCol(document.getElementById(baseId+"cfW7").innerHTML);
					
					if (countCFcolors(baseId, ensureCol, false) == 0) {
						mutateCFentry(baseId, irandom(1,7), null, ensureCol);
					}
					break;
					
				case colFlashColors[5]: // White
					if (countCFwords(baseId, colFlashWords[2], false) == 0 && countCFcolors(baseId, colFlashColors[2], false) == 0) {
						mutateCFentry(baseId, irandom(1,7), null, colFlashColors[2]);
					}
					
					if (countCFwords(baseId, colFlashWords[3], false) == 0) {
						mutateCFentry(baseId, irandom(1,8), colFlashWords[3], null);
					}
					break;
			}
		}
	}
	
	colourCycle = -2;
	colourFlasher = setInterval(cycleColFlashes, 875);
}

function cycleColFlashes() {
	if (colourCycle >= 8) {
		colourCycle = -1;
	} else {
		colourCycle++;
	}
	
	var makeDispVis = Math.max(colourCycle,0);
	
	dispCollection = document.getElementsByClassName("colFlashDisp");
	
	for (var d in dispCollection) {
		if (dispCollection[d].className == "colFlashDisp") {
			var workId = dispCollection[d].id;
			
			dispCollection[d].style.display = (workId.endsWith(makeDispVis) ? "" : "none");
		}
	}
}

function pressColFlashButton(readObj, readPress) {
	if (life > 0 && timeLimit > 0) {
		var lastCol, deltaCycle, requiredCycle, requiredBool, allowAnyMatchPair, readBool;
		
		readBool = (readPress.id.endsWith("Y"));
		
		lastCol = document.getElementById(readObj.id+"cfW8").style.color;
		deltaCycle = 0;
		allowAnyMatchPair = false;
		
		switch (lastCol) {
			case colFlashColors[0]: // Red
				if (countCFwords(readObj.id, colFlashWords[1], false) >= 3) {
					requiredCycle = findCFpattern(readObj.id, colFlashWords[1], "findEitherOr", 2);
					requiredBool = true;
				} else if (countCFcolors(readObj.id, colFlashColors[2], false) == 1) {
					requiredCycle = findCFpattern(readObj.id, colFlashWords[4], null, 0);
					requiredBool = false;
				} else {
					requiredCycle = findCFpattern(readObj.id, colFlashWords[5], "findEitherOr", Infinity);
					requiredBool = true;
				}
				break;
				
			case colFlashColors[1]: // Green
				if (countCFhighWords(readObj.id) >= 2) {
					requiredCycle = 5;
					requiredBool = false;
				} else if (countCFwords(readObj.id, colFlashWords[4], false) >= 3) {
					requiredCycle = findCFpattern(readObj.id, colFlashWords[3], "findEitherOr", 0);
					requiredBool = false;
				} else {
					allowAnyMatchPair = true;
					requiredBool = true;
				}
				break;
				
			case colFlashColors[2]: // Blue
				if (countCFmatches(readObj.id, false, false) >= 3) {
					requiredCycle = findCFpattern(readObj.id, "findMismatch", null, 0);
					requiredBool = true;
				} else if (countCFpairs(readObj.id, colFlashWords[0], colFlashColors[1], false) >= 1 ||
					countCFpairs(readObj.id, colFlashWords[1], colFlashColors[5], false) >= 1) {
					requiredCycle = findCFpattern(readObj.id, colFlashWords[5], colFlashColors[0], 0);
					requiredBool = false;
				} else  {
					requiredCycle = findCFpattern(readObj.id, colFlashWords[1], colFlashColors[1], Infinity);
					requiredBool = true;
				}
				break;
				
			case colFlashColors[3]: // Yellow
				if (countCFpairs(readObj.id, colFlashWords[2], colFlashColors[1], false) >= 1) {
					requiredCycle = findCFpattern(readObj.id, null, colFlashColors[1], 0);
					requiredBool = true;
				} else if (countCFpairs(readObj.id, colFlashWords[5], colFlashColors[5], false) >= 1 ||
					countCFpairs(readObj.id, colFlashWords[5], colFlashColors[0], false) >= 1) {
					requiredCycle = findCFpattern(readObj.id, "findMismatch", null, 1);
					requiredBool = true;
				} else  {
					requiredCycle = countCFwords(readObj.id, colFlashWords[4], false) + countCFcolors(readObj.id, colFlashColors[4], false) - countCFpairs(readObj.id, colFlashWords[4], colFlashColors[4], false);
					requiredBool = false;
				}
				break;
				
			case colFlashColors[4]: // Magenta
				if (countCFhighColors(readObj.id) >= 2) {
					requiredCycle = 3;
					requiredBool = true;
				} else if (countCFwords(readObj.id, colFlashWords[3], false) > countCFcolors(readObj.id, colFlashWords[2], false)) {
					requiredCycle = findCFpattern(readObj.id, colFlashWords[3], null, Infinity);
					requiredBool = false;
				} else {
					var semiLastColor = convertCFwordCol(document.getElementById(readObj.id+"cfW7").innerHTML);
					
					requiredCycle = findCFpattern(readObj.id, null, semiLastColor, 0);
					requiredBool = false;
				}
				break;
				
			case colFlashColors[5]: // White
				var fetchWords = [convertCFcolWord(document.getElementById(readObj.id+"cfW3").style.color),
					document.getElementById(readObj.id+"cfW4").innerHTML,
					document.getElementById(readObj.id+"cfW5").innerHTML];
			
				if (fetchWords[0] == fetchWords[1] || fetchWords[0] == fetchWords[2]) {
					requiredCycle = findCFpattern(readObj.id, colFlashWords[2], "findEitherOr", 0);
					requiredBool = false;
				} else if (countCFpairs(readObj.id, colFlashWords[3], colFlashColors[0], false) >= 1) {
					requiredCycle = findCFpattern(readObj.id, null, colFlashColors[2], Infinity);
					requiredBool = true;
				} else {
					requiredCycle = 0; // Indeed, one can literally press No (false) whenever...
					requiredBool = false;
				}
				break;
		}
		
		if (allowAnyMatchPair) {
			var localObj, readWord, readCol;
			localObj = document.getElementById(readObj.id+"cfW"+colourCycle);
			readWord = localObj.innerHTML;
			readCol = localObj.style.color;
			
			if (readBool == requiredBool && readWord == convertCFcolWord(readCol)) {
				solveModule(readObj, true, false, 25);
				console.log("Colour Flash solved. The required input was "+requiredBool+" on any word where the color matched.");
			} else if (readBool != requiredBool || readObj.style.borderColor != solveColor) {
				solveModule(readObj, false, true);
				console.warn("Colour Flash striked!");
				if (life <= 0) {
					console.warn("The correct input was "+requiredBool+" on any word where the color matched.");
				}
			}
		} else if (readBool == requiredBool && (colourCycle == requiredCycle || requiredCycle == 0)) {
			solveModule(readObj, true, false, 25);
			console.log("Colour Flash solved. The required input was "+requiredBool+" at word "+requiredCycle+".");
		} else if (readBool != requiredBool || readObj.style.borderColor != solveColor) {
			solveModule(readObj, false, true);
			console.warn("Colour Flash striked!");
			if (life <= 0) {
				console.warn("The correct input was "+requiredBool+" at word "+requiredCycle+".");
			}
		}
	}

	playSound(buttonSnds[0]);
}

// Series of counting functions
function countCFwords(readBase, findVal, needStreak) {
	var count = 0;
	var highestCount = 0;
	
	for (var d = 1; d <= 8; d++) {
		if (document.getElementById(readBase+"cfW"+d).innerHTML == findVal) {
			count++;
			if (count > highestCount) {
				highestCount = count;
			}
		} else if (needStreak) {
			count = 0;
		}
	}
	
	return highestCount;
}

function countCFhighWords(readBase) {
	var highestCombo = 0;
	
	for (var w = 0; w < colFlashWords.length; w++) {
		highestCombo = Math.max(countCFwords(readBase, colFlashWords[w], true), highestCombo);
	}
	
	return highestCombo;
}

function countCFcolors(readBase, findCol, needStreak) {
	var count = 0;
	var highestCount = 0;
	
	for (var d = 1; d <= 8; d++) {
		if (document.getElementById(readBase+"cfW"+d).style.color == findCol) {
			count++;
			if (count > highestCount) {
				highestCount = count;
			}
		} else if (needStreak) {
			count = 0;
		}
	}
	
	return highestCount;
}

function countCFhighColors(readBase) {
	var highestCombo = 0;
	
	for (var c = 0; c < colFlashColors.length; c++) {
		highestCombo = Math.max(countCFcolors(readBase, colFlashColors[c], true), highestCombo);
	}
	
	return highestCombo;
}

function countCFpairs(readBase, findVal, findCol, needStreak) {
	var count = 0;
	var highestCount = 0;
	
	for (var d = 1; d <= 8; d++) {
		if (document.getElementById(readBase+"cfW"+d).innerHTML == findVal && document.getElementById(readBase+"cfW"+d).style.color == findCol) {
			count++;
			if (count > highestCount) {
				highestCount = count;
			}
		} else if (needStreak) {
			count = 0;
		}
	}
	
	return highestCount;
}

function countCFmatches(readBase, needMatch, needStreak) {
	var count = 0;
	var highestCount = 0;
	var pairFound = false;
	
	for (var d = 1; d <= 8; d++) {
		pairFound = false;
		var localObj = document.getElementById(readBase+"cfW"+d);
		var readTxt = localObj.innerHTML;
		var readCol = localObj.style.color;
		
		for (var e = 0; e < colFlashWords.length; e++) {
			if (readTxt == colFlashWords[e] && readCol == colFlashColors[e]) {
				pairFound = true;
				break;
			}
		}
		
		if (pairFound == needMatch) {
			count++;
			if (count > highestCount) {
				highestCount = count;
			}
		} else if (needStreak) {
			count = 0;
		}
	}
	
	return highestCount;
}

// Convert a word to a color, and vise versa
function convertCFwordCol(inWord) {
	for (var c = 0; c < colFlashWords.length; c++) {
		if (inWord == colFlashWords[c]) {
			return colFlashColors[c];
		}
	}
}

function convertCFcolWord(inCol) {
	for (var c = 0; c < colFlashColors.length; c++) {
		if (inCol == colFlashColors[c]) {
			return colFlashWords[c];
		}
	}
}

function findCFpattern(readBase, targetWord, targetCol, skipCount) {
	var skipsLeft = skipCount;
	var lastMatch = -1;
		
	for (var k = 1; k <= 8; k++) {
		var localObj = document.getElementById(readBase+"cfW"+k);
		var readTxt = localObj.innerHTML;
		var readCol = localObj.style.color;

		if (targetWord == "findMatch") {
			for (var a = 0; a < colFlashWords.length; a++) {
				if (readTxt == colFlashWords[a] && readCol == colFlashColors[a]) {
					if (skipsLeft > 0) {
						skipsLeft--;
						lastMatch = k;
						break;
					} else {
						return k;
					}
				}
			}
		} else if (targetWord == "findMismatch") {
			for (var b = 0; b < colFlashWords.length; b++) {
				if ((readTxt == colFlashWords[b] && readCol != colFlashColors[b]) ||
					(readTxt != colFlashWords[b] && readCol == colFlashColors[b])) {
					if (skipsLeft > 0) {
						skipsLeft--;
						lastMatch = k;
						break;
					} else {
						return k;
					}
				}
			}
		} else if (targetCol == "findEitherOr") {
			var trueTargetCol = convertCFwordCol(targetWord);
			
			if (readTxt == targetWord || readCol == trueTargetCol) {
				if (skipsLeft > 0) {
					skipsLeft--;
					lastMatch = k;
				} else {
					return k;
				}
			}
		} else if ((readTxt == targetWord || targetWord == null) && (readCol == targetCol || targetCol == null)) {
			if (skipsLeft > 0) {
				skipsLeft--;
				lastMatch = k;
			} else {
				return k;
			}
		}
	}
	
	if (!isFinite(skipsLeft)) {
		return lastMatch;
	}
	
	return -1; //Somehow not found
}

function mutateCFentry(readBase, getDisp, newVal, newCol) {
	var localObj = document.getElementById(readBase+"cfW"+getDisp);
	
	if (newVal == "makeMatch") {
		var getValue = localObj.innerHTML;
		var getColor = localObj.style.color;
		
		if (irandom(0,1) < 1) {
			localObj.style.color = convertCFwordCol(getValue);
		} else {
			localObj.innerHTML = convertCFcolWord(getColor);
		}
	} else {
		if (newVal != null) {
			localObj.innerHTML = newVal;
		}
		if (newCol != null) {
			localObj.style.color = newCol;
		}
	}
}

// Colored Squares functions
function makeAllColSquares() {
	coloCollection = document.getElementsByClassName("colSquareFrame");
	
	for (var c in coloCollection) {
		if (coloCollection[c].className == "colSquareFrame") {
			var baseId = coloCollection[c].id;
			var workId = baseId.substring(0,baseId.length-3);
			var workObj = document.getElementById(workId);
			
			resetColSquares(workObj, true);
		}
	}
}

function clearColSquares(readObj, clearWhites) {
	var baseId = readObj.id;
	var workObj;
	var emptyTiles = 0;
	
	for (var y = 0; y < 4; y++) {
		for (var x = 0; x < 4; x++) {
			workObj = document.getElementById(baseId+"csTx"+x+"y"+y);
			
			if (clearWhites || workObj.style.background != colSquareColors[5]) {
				workObj.style.background = "";
				emptyTiles++;
			}
		}
	}
	
	return emptyTiles;
}

function resetColSquares(readObj) {
	var workNum = parseInt(readObj.id.substring(6));
	
	prepColSquares(readObj, "lowest");
}

function prepColSquares(readObj, newGoal) {
	var workNum = parseInt(readObj.id.substring(6));
	clearInterval(colSquareHandle[workNum]);
	
	var emptyTiles = clearColSquares(readObj, newGoal == "lowest");

	colSquareHandle[workNum] = setTimeout(makeColSquares , 2000 + emptyTiles*30, readObj, newGoal);
}

function makeColSquares(readObj, newGoal) {
	var baseId = readObj.id;
	var workObj;
	
	var leastColor = -1;
	var rollColor = -1;
	
	for (var y = 0; y < 4; y++) {
		for (var x = 0; x < 4; x++) {
			for (var t = 0; t < 2; t++) {
				rollColor = irandom(0,colSquareColors.length - 2);
			}
			workObj = document.getElementById(baseId+"csTx"+x+"y"+y);
			
			if (workObj.style.background != colSquareColors[5]) {
				workObj.style.background = colSquareColors[rollColor];
			}
		}
	}
	
	document.getElementById(baseId+"csX").innerHTML = newGoal;
	fixColSquares(readObj);
}

function fixColSquares(readObj) {
	var baseId = readObj.id;

	var goalObj = document.getElementById(baseId+"csX");
	var readGoal = goalObj.innerHTML;
	
	switch (readGoal) {
		case "lowest":
			var lowestCount = lowestColSquares(readObj);
			var lowestTypes = 0;
			var lowestColor = 0;
			
			for (var d = 0; d < colSquareColors.length - 1; d++) {
				if (countColSquares(readObj, d) == lowestColSquares(readObj)) {
					lowestTypes++;
					lowestColor = d;
				}
			}
			
			if (lowestColSquares(readObj) < 1 || lowestTypes > 1) {
				makeColSquares(readObj, "lowest");
			} else {
				goalObj.innerHTML = "pal"+lowestColor;
			}
			break;
			
		case "col":
			goalObj.innerHTML = goalObj.innerHTML + getLeftmostCScol(readObj);
			break;
			
		case "row":
			goalObj.innerHTML = goalObj.innerHTML + getTopmostCSrow(readObj);
			break;
			
	}
	
	if (readGoal.startsWith("pal")) {
		var goalParam = parseInt(readGoal.substring(3));
		
		paintRandomColSquare(readObj, goalParam);
	}
}

function lowestColSquares(readObj) {
	var baseId = readObj.id;

	var colCounts = [0, 0, 0, 0, 0];
	var workObj;
	
	for (var y = 0; y < 4; y++) {
		for (var x = 0; x < 4; x++) {
			workObj = document.getElementById(baseId+"csTx"+x+"y"+y);
			
			for (var c = 0; c < colCounts.length; c++) {
				if (workObj.style.background == colSquareColors[c]) {
					colCounts[c]++;
					break;
				}
			}
		}
	}
	
	return Math.min(...colCounts);
}

function countColSquares(readObj, findCol) {
	baseId = readObj.id;

	var colCount = 0;
	var workObj;
	
	for (var y = 0; y < 4; y++) {
		for (var x = 0; x < 4; x++) {
			workObj = document.getElementById(baseId+"csTx"+x+"y"+y);
			
			if (workObj.style.background == colSquareColors[findCol]) {
				colCount++;
			}
		}
	}
	
	return colCount;
}

function countCSrow(readObj, readRow) {
	var tileCount = 0;
	var workObj;
	
	for (var t = 0; t < 4; t++) {
		workObj = document.getElementById(baseId+"csTx"+t+"y"+readRow);
		
		if (workObj.style.background != colSquareColors[5]) {
			tileCount++;
		}
	}
	
	return tileCount;
}

function countCScol(readObj, readCol) {
	var tileCount = 0;
	var workObj;
	
	for (var t = 0; t < 4; t++) {
		workObj = document.getElementById(baseId+"csTx"+readCol+"y"+t);
		
		if (workObj.style.background != colSquareColors[5]) {
			tileCount++;
		}
	}
	
	return tileCount;
}

function paintRandomColSquare(readObj, newCol) {
	var baseId = readObj.id;
	
	var randomTile = [-1, -1];
	var workObj = null;
	
	do {
		randomTile = [irandom(0,3), irandom(0,3)];
		workObj = document.getElementById(baseId+"csTx"+randomTile[0]+"y"+randomTile[1]);
	} while (workObj.style.background == colSquareColors[5]);
	
	workObj.style.background = colSquareColors[newCol];
}

function getLeftmostCScol(readObj) {
	var baseId = readObj.id;

	for (var x = 0; x < 4; x++) {
		for (var y = 0; y < 4; y++) {
			var workObj = document.getElementById(baseId+"csTx"+x+"y"+y);
			
			if (workObj.style.background != colSquareColors[5]) {
				return x;
			}
		}
	}
	
	return 1; //Not found somehow
}

function getTopmostCSrow(readObj) {
	var baseId = readObj.id;

	for (var y = 0; y < 4; y++) {
		for (var x = 0; x < 4; x++) {
			var workObj = document.getElementById(baseId+"csTx"+x+"y"+y);
			
			if (workObj.style.background != colSquareColors[5]) {
				return y;
			}
		}
	}
	
	return 1; //Not found somehow
}

function tapColoredSquare(readObj, readInput) {
	baseId = readObj.id;

	var readGoal = document.getElementById(baseId+"csX").innerHTML;
	var goalParam = parseInt(readGoal.substring(3));
	
	var buildNextPuz = 0;
	
	if (readGoal.startsWith("pal")) {
		if (readInput.style.background == colSquareColors[goalParam]) {
			readInput.style.background = colSquareColors[5];
			
			if (countColSquares(readObj, goalParam) <= 0) {
				buildNextPuz = 1;
			}
		} else {
			buildNextPuz = -1;
			console.warn("Colored Squares striked! The required attribute was the color "+colSquareNames[goalParam]+".");
		}
	} else if (readGoal.startsWith("row")) {
		if (readInput.id.search("y"+goalParam) >= 0) {
			readInput.style.background = colSquareColors[5];
			
			if (countCSrow(readObj, goalParam) <= 0) {
				buildNextPuz = 1;
			}
		} else {
			buildNextPuz = -1;
			console.warn("Colored Squares striked! The required attribute was row "+goalParam+".");
		}
	} else if (readGoal.startsWith("col")) {
		if (readInput.id.search("x"+goalParam) >= 0) {
			readInput.style.background = colSquareColors[5];
			
			if (countCScol(readObj, goalParam) <= 0) {
				buildNextPuz = 1;
			}
		} else {
			buildNextPuz = -1;
			console.warn("Colored Squares striked! The required attribute was column "+goalParam+".");
		}
	}
	
	playSound(buttonSnds[0]);
	
	if (countColSquares(readObj, 5) >= 16) {
		solveModule(readObj, true, false);
		console.log("Colored Squares solved.");
	} else if (buildNextPuz > 0) {
		var tilesLeft = 16 - countColSquares(readObj, 5);  
		console.log("Colored Squares correct so far. "+tilesLeft+" tile(s) remain.");

		var goalList = ["pal0", "pal2", "pal1", "pal3", "pal4"];
		
		var newGoal = null;
		
		if (readGoal.startsWith("pal")) {
			newGoal = colSquareGoals[tilesLeft-1][goalList.indexOf(readGoal)];
		} else if (readGoal.startsWith("row")) {
			newGoal = colSquareGoals[tilesLeft-1][5];
		} else if (readGoal.startsWith("col")) {
			newGoal = colSquareGoals[tilesLeft-1][6];
		}

		prepColSquares(readObj, newGoal);
	} else if (buildNextPuz < 0) {
		solveModule(readObj, false, false);
		if (gameActive) {
			resetColSquares(readObj);
		} else {
			readInput.style.background = "";
		}
	}
}

// Two Bits functions
function determineTBinitial() {
	var workCode;
	
	if (getFirstLetter() == null) {
		workCode = 0;
	} else {
		workCode = getFirstLetter().toUpperCase().charCodeAt() - 64;
	}
	
	workCode += getLastDigit() * getBatteries();
	
	if (getBombPorts("Stereo") > 0 && getBombPorts("RJ-45") == 0) {
		workCode *= 2;
	}
	
	return workCode % 100;
}

function inputTBletter(readObj, readInput) {
	var workObj = document.getElementById(readObj.id+"tbD");
	var workDisp = workObj.innerHTML;
	
	if (workDisp != "Correct!") {
		if (workDisp.startsWith("_")) {
			workObj.innerHTML = readInput.innerHTML + " _";
		} else if (workDisp.endsWith("_")) {
			workObj.innerHTML = workDisp.charAt(0) + " " + readInput.innerHTML;
		} else {
			overloadTB(readObj);
		}

		playSound(buttonSnds[0]);
	}
}

function overloadTB(readObj, overrideMsg) {
	var workObj = document.getElementById(readObj.id+"tbD");
	var workNum = parseInt(readObj.id.substring(6));

	solveModule(readObj, false, false);
	if (typeof overrideMsg === "undefined") {
		console.warn("Two Bits overloaded!");
	} else {
		console.warn("Two Bits overloaded! " + overrideMsg);
	}

	workObj.innerHTML = "Error!";
	clearTimeout(twoBitHandle[workNum]);
	
	twoBitHandle[workNum] = setTimeout(function() {workObj.innerHTML = "_ _"}, 3500);
}

function queryTwoBit(readObj) {
	var workObj = document.getElementById(readObj.id+"tbD");
	var workNum = parseInt(readObj.id.substring(6));
	var workDisp = workObj.innerHTML;
	
	if (workDisp != "Correct!") {
		if (workDisp.search("_") >= 0) {
			overloadTB(readObj, "Not enough letters were inserted.");
		} else if (workDisp.length > 3) {
			overloadTB(readObj);
		} else {
			var readInput = workDisp.replace(" ","").toLowerCase();
			
			workObj.innerHTML = "Working...";
	
			twoBitHandle[workNum] = setTimeout(fetchTBresult, 2000, readObj, readInput);
		}

		playSound(buttonSnds[0]);
	}
}

function fetchTBresult(readObj, readInput) {
	var workObj = [document.getElementById(readObj.id+"tbD"), document.getElementById(readObj.id+"tbS")];
	var workNum = parseInt(readObj.id.substring(6));
	var workDisp = workObj[0].innerHTML;
	
	var numFound = workObj[1].innerHTML.split(",").indexOf(readInput);
	
	workObj[0].innerHTML = "Result: " + numFound;
	
	twoBitHandle[workNum] = setTimeout(function() {workObj[0].innerHTML = "_ _"}, 3000);
}

function submitTwoBit(readObj) {
	var workObj = document.getElementById(readObj.id+"tbD");
	var workNum = parseInt(readObj.id.substring(6));
	var workDisp = workObj.innerHTML;
	
	if (workDisp != "Correct!") {
		if (workDisp.length > 3) {
			overloadTB(readObj);
		} else {
			var readInput = workDisp.replace(" ","").toLowerCase();
			
			workObj.innerHTML = "Submitting...";
	
			twoBitHandle[workNum] = setTimeout(gradeTwoBit, 5500, readObj, readInput);
		}

		playSound(buttonSnds[0]);
	}
}

function gradeTwoBit(readObj, readInput) {
	var workObj = [document.getElementById(readObj.id+"tbD"), document.getElementById(readObj.id+"tbS")];
	var workNum = parseInt(readObj.id.substring(6));
	var workDisp = workObj[0].innerHTML;
	
	var workArray = workObj[1].innerHTML.split(",");
	
	var initAns = tbQueryTable[determineTBinitial()];
	var correctAns = initAns;
	for (var q = 0; q < 3; q++) {
		correctAns = tbQueryTable[workArray.indexOf(correctAns)];
	}
	
	if (readInput == correctAns) {
		workObj[0].innerHTML = "Correct!";
		console.log("Two Bit solved. The answer was '" + correctAns + "'.");
		solveModule(readObj, true, false, 25);
	} else {
		workObj[0].innerHTML = "Incorrect!";
		
		console.log("Two Bit striked!");
		solveModule(readObj, false, false);
		
		if (!gameActive) {
			console.log("The correct answer was '" + correctAns + "'.");
		}
		
		twoBitHandle[workNum] = setTimeout(function() {workObj[0].innerHTML = "_ _"}, 3500);
	}
}

//Lights Out functions
function activateLightsOut(readObj, newState) {
	baseId = readObj.id+"n";
	meterObj = document.getElementById(baseId+"H");
	timerObj = document.getElementById(baseId+"T");
	displayObjs = [];
	for (var y = 0; y < 3; y++) {
		for (var x = 0; x < 3; x++) {
			displayObjs.push(document.getElementById(baseId+"Lx"+x+"y"+y));
		}
	}
	
	if (gameActive) {
		if (newState) {
			var reqLight = irandom(0,8);
			
			for (var z = 0; z < 9; z++) {
				if (z == reqLight || Math.random() < 0.5) {
					displayObjs[z].style.background = LOactive;
				}
			}
			
			playSound(beepSnd);
		} else {
			for (var z = 0; z < 9; z++) {
				displayObjs[z].style.background = "";
			}
			
			meterObj.value = irandom(Math.round(10/needyCycleDur),Math.round(40/needyCycleDur)) * -needyCycleDur;
			timerObj.innerHTML = "&nbsp;";
		}
	}
}

function tapLOslot(readObj, readInput) {
	baseId = readObj.id+"n";
	var readId = readInput.id;
	var readX = parseInt(readId.slice(-3).substring(0, 1));
	var readY = parseInt(readId.slice(-1));

	meterObj = document.getElementById(baseId+"H");
	
	if (meterObj.value > 0) {
		for (var n = readY - 1; n <= readY + 1; n++) {
			for (var m = readX - 1; m <= readX + 1; m++) {
				if (m == readX || n == readY) {
					toggleLOslot(readObj, m, n);
				}
			}
		}
		
		if (allLightsOut(readObj)) {
			activateLightsOut(readObj, false);
			console.log("All lights were successfully turned off.")
		}
	}
}

function toggleLOslot(readObj, x, y) {
	var findObj = document.getElementById(readObj.id+"nLx"+x+"y"+y);
	
	if (findObj) {
		if (findObj.style.background == LOactive) {
			findObj.style.background = "";
		} else {
			findObj.style.background = LOactive;
		}
	}
}

function allLightsOut(readObj) {
	for (var y = 0; y < 3; y++) {
		for (var x = 0; x < 3; x++) {
			if (document.getElementById(baseId+"Lx"+x+"y"+y).style.background == LOactive) {
				return false;
			}
		}
	}
	
	return true;
}

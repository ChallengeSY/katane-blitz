function createBombModule(moduleObj, moduleClass) {
	switch (moduleClass) {
		case "bigButton":
			newButton = document.createElement("button");
			newButton.className = "bigButton";
			newButton.id = moduleObj.id+"b";
			newButton.innerHTML = buttonLabels[irandom(0,3)];
			newButton.style.backgroundColor = defaultColors[irandom(1,4)];
			if (newButton.style.backgroundColor == defaultColors[1] ||
				newButton.style.backgroundColor == defaultColors[2]) {
				newButton.style.color = defaultColors[3];
			}
			newButton.onmousedown = function() { prepLight(moduleObj.id+"l"); }
			newButton.onmouseup = function() { validateButtonPress(moduleObj); }
			newButton.ontouchstart = newButton.onmousedown;
			newButton.ontouchend = newButton.onmouseup;
			moduleObj.appendChild(newButton);

			newLight = document.createElement("div");
			newLight.className = "buttonLight";
			newLight.id = moduleObj.id+"l";
			newLight.style.backgroundColor = defaultColors[0];
			
			moduleObj.style.textAlign = "center";
			moduleObj.appendChild(newLight);
			break;
			
		case "keypad":
			var randColumn = irandom(0,5);
			var drawChar = new Array(4);
			var charPool = cloneArray(keypadTable[randColumn]);
			
			for (var k = 0; k < 4; k++) {
				rollChar = irandom(0,charPool.length-1);
				drawChar[k] = charPool[rollChar];
				charPool.splice(rollChar, 1);
				
				newKeypad = document.createElement("button");
				newKeypad.className = "keypad";
				if (k < 2) {
					newKeypad.style.marginTop = "auto";
				}
				if (k % 2 == 0) {
					newKeypad.style.marginLeft = "auto";
				}
				
				for (var l = 0; l < keypadTable[randColumn].length; l++) {
					if (drawChar[k] == keypadTable[randColumn][l]) {
						newKeypad.id = moduleObj.id+"k"+l;
						break;
					}
				}
				
				newKeypad.innerHTML = drawChar[k];
				newKeypad.onclick = function() { validateKeypad(moduleObj, this); }
				moduleObj.appendChild(newKeypad);
			}
			
			moduleObj.className = "keypadFrame";
			break;
		
		case "maze":
			mazeWrapper = document.createElement("div");
			
			mazeButtonWrapper = document.createElement("div");
			mazeButtonWrapper.className = "mazeButtonX";
			mazeButtonWrapper.id = moduleObj.id+"mT";
			mazeButton = document.createElement("button");
			mazeButton.onclick = function() {mazeMove(moduleObj, 0, -1)};
			mazeButton.innerHTML = "&#9650;";
			mazeButtonWrapper.appendChild(mazeButton);
			mazeWrapper.appendChild(mazeButtonWrapper);
			
			mazeButtonWrapper = document.createElement("div");
			mazeButtonWrapper.className = "mazeButtonY";
			mazeButton = document.createElement("button");
			mazeButton.onclick = function() {mazeMove(moduleObj, -1, 0)};
			mazeButton.innerHTML = "&#9664;";
			mazeButtonWrapper.appendChild(mazeButton);
			mazeWrapper.appendChild(mazeButtonWrapper);
			
			mazeButtonWrapper = document.createElement("div");
			mazeButtonWrapper.className = "mazeButtonY";
			mazeButtonWrapper.style.gridColumn = "8 / span 1";
			mazeButton = document.createElement("button");
			mazeButton.onclick = function() {mazeMove(moduleObj, 1, 0)};
			mazeButton.innerHTML = "&#9654;";
			mazeButtonWrapper.appendChild(mazeButton);
			mazeWrapper.appendChild(mazeButtonWrapper);

			for (y = 1; y <= 6; y++) {
				for (x = 1; x <= 6; x++) {
					mazeSlot = document.createElement("div");
					mazeSlot.className = "mazeSlot";
					mazeSlot.id = moduleObj.id+"mx"+x+"y"+y;
					mazeWrapper.appendChild(mazeSlot);
				}
			}
			
			mazeButtonWrapper = document.createElement("div");
			mazeButtonWrapper.className = "mazeButtonX";
			mazeButtonWrapper.id = moduleObj.id+"mB";
			mazeButton = document.createElement("button");
			mazeButton.onclick = function() {mazeMove(moduleObj, 0, 1)};
			mazeButton.innerHTML = "&#9660;";
			mazeButtonWrapper.appendChild(mazeButton);
			mazeWrapper.appendChild(mazeButtonWrapper);
			
			mazeWrapper.className = "mazeFrame";
			moduleObj.appendChild(mazeWrapper);
			
			// buildMaze(moduleObj, mazeLayout);
			break;
			
		case "memory":
			memDisp = document.createElement("div");
			memDisp.className = "memDisp";
			memDisp.id = moduleObj.id+"mD";
			moduleObj.appendChild(memDisp);
			
			for (var s = 5; s >= 1; s--) {
				memStage = document.createElement("div");
				memStage.className = "memStage";
				memStage.id = moduleObj.id+"mS"+s;
				moduleObj.appendChild(memStage);
				
				if (s == 3) {
					for (var b = 1; b <= 4; b++) {
						memButtonWrap = document.createElement("div");
						memButtonWrap.className = "memButton";
						memButton = document.createElement("button");
						memButton.id = moduleObj.id+"mB"+b;
						memButton.onclick = function() {pressMemoryButton(moduleObj, this);}
						memButtonWrap.appendChild(memButton);
						moduleObj.appendChild(memButtonWrap);
					}
				}
			}
			
			memCollection = document.createElement("div");
			memCollection.className = "memCollection";
			memCollDigits = document.createElement("span");
			memCollDigits.id = moduleObj.id+"mMD";
			memCollection.appendChild(memCollDigits)
			memCollection.innerHTML += " / ";
			memCollPosits = document.createElement("span");
			memCollPosits.id = moduleObj.id+"mMP";
			memCollection.appendChild(memCollPosits);
			moduleObj.appendChild(memCollection);
			
			moduleObj.className = "memFrame";
			break;
		
		case "morse":
			var targFreq = validMorseFreqs[irandom(0,validMorseFreqs.length-1)];
		
			newLight = document.createElement("div");
			newLight.className = "morseLight";
			newLight.style.animation = "freq"+targFreq+" 20000ms 2s infinite";
			moduleObj.appendChild(newLight);
			
			newButton = document.createElement("button");
			newButton.className = "morseDelta";
			newButton.onclick = function() {changeMorseFreq(moduleObj, false)};
			newButton.innerHTML = "&#9664;";
			moduleObj.appendChild(newButton);
			
			newInput = document.createElement("input");
			newInput.className = "text numeric";
			newInput.type = "text";
			newInput.size = 3;
			newInput.maxLength = 4;
			newInput.value = 3505;
			newInput.id = moduleObj.id+"f";
			moduleObj.appendChild(newInput);

			newLight = document.createElement("span");
			newLight.className = "fragment";
			newLight.innerHTML = "KHz";
			moduleObj.appendChild(newLight);
			
			newButton = document.createElement("button");
			newButton.className = "morseDelta";
			newButton.onclick = function() {changeMorseFreq(moduleObj, true)};
			newButton.innerHTML = "&#9654;";
			moduleObj.appendChild(newButton);
			
			newButton = document.createElement("button");
			newButton.className = "interact";
			newButton.onclick = function() {validateMorseCode(moduleObj, 3000 + targFreq)};
			newButton.innerHTML = "Transmit!";
			moduleObj.appendChild(newButton);
			break;
			
		case "password":
			var targWord = validPasswords[irandom(0,validPasswords.length-1)];

			for (var u = 0; u < 5; u++) {
				newCell = document.createElement("div");
				newButton = document.createElement("button");
				newButton.className = "passDelta";
				newButton.id = moduleObj.id+"u"+u;
				newButton.onclick = function() {shiftPassColumn(moduleObj, this, false)};
				newButton.innerHTML = "&#9650;";
				newCell.style.textAlign = "center";
				newCell.appendChild(newButton);
				moduleObj.appendChild(newCell);
			}
			
			createRandomPassChars(targWord);

			for (var l = 0; l < 5; l++) {
				newCell = document.createElement("div");
				newCell.id = moduleObj.id+"p"+l;
				newCell.className = "passDisp";
				newCell.innerHTML = letterBanks[l][0];
				moduleObj.appendChild(newCell);
			}

			for (var d = 0; d < 5; d++) {
				newCell = document.createElement("div");
				newButton = document.createElement("button");
				newButton.className = "passDelta";
				newButton.id = moduleObj.id+"d"+d;
				newButton.onclick = function() {shiftPassColumn(moduleObj, this, true)};
				newButton.innerHTML = "&#9660;";
				newCell.style.textAlign = "center";
				newCell.appendChild(newButton);
				moduleObj.appendChild(newCell);
			}

			for (var b = 0; b < 5; b++) {
				newCell = document.createElement("div");
				newCell.id = moduleObj.id+"b"+b;
				newCell.className = "passBank";
				newCell.innerHTML = "";
				for (var c = 1; c < letterBanks[b].length; c++) {
					newCell.innerHTML += letterBanks[b][c];
				}
				moduleObj.appendChild(newCell);
			}
			
			newCell = document.createElement("div");
			newButton = document.createElement("button");
			newButton.className = "passSubmit";
			newButton.onclick = function() {validatePassword(moduleObj, targWord)};
			newButton.innerHTML = "Submit";
			newCell.style.textAlign = "center";
			newCell.style.gridColumn = "1 / span 5";
			newCell.appendChild(newButton);
			
			moduleObj.style.display = "grid";
			moduleObj.style.gridTemplateColumns = "auto auto auto auto auto";
			moduleObj.appendChild(newCell);
			break;
			
		case "simon":
			simonWrapper = document.createElement("div");
			simonWrapper.className = "simon";
		
			for (var s = 0; s < 4; s++) {
				newButton = document.createElement("button");
				if (s < 2) {
					newButton.style.marginTop = "auto";
				}
				if (s % 2 == 0) {
					newButton.style.marginLeft = "auto";
				}
				newButton.style.backgroundColor = simonColors[s].backLo;
				
				newButton.id = moduleObj.id+"s"+simonColors[s].letter;
				newButton.onclick = function() { pressSimonButton(moduleObj, this); }
				simonWrapper.appendChild(newButton);
			}
			moduleObj.appendChild(simonWrapper);
			
			simonAux = document.createElement("div");
			simonAux.className = "simonAux";
			
			// Required stages
			simonStages = document.createElement("span");
			simonStages.id = moduleObj.id+"sX";
			simonAux.appendChild(simonStages);
			
			simonAux.innerHTML += " / ";
			
			// Round number
			simonRound = document.createElement("span");
			simonRound.id = moduleObj.id+"sN";
			simonAux.appendChild(simonRound);

			simonAux.innerHTML += " / ";
			
			// Player input
			simonRound = document.createElement("span");
			simonRound.id = moduleObj.id+"sP";
			simonAux.appendChild(simonRound);
			
			moduleObj.appendChild(simonAux);
			
			break;
			
		case "venn":
			var totalWires = irandom(4,6);
			var mandatoryWire = irandom(1,totalWires);
			// At least one wire must be cut to have a module

			var workVennWire = new Array(totalWires);
			
			for (var l = 1; l <= totalWires; l++) {
				workVennWire[l-1] = new complicatedWire();
				
				// Ensure the wire is cuttable, if it is the mandatory wire
				do {
					workVennWire[l-1].buildRandomWire();
				} while (l == mandatoryWire && !workVennWire[l-1].wireCuttable(false));
				
				if (workVennWire[l-1].ledLight) {
					vennLight = 9898;
					vennClass = "vennSlot led";
				} else {
					vennLight = 9899;
					vennClass = "vennSlot";
				}

				vennLed = document.createElement("div");
				vennLed.id = moduleObj.id+"vL"+l;
				vennLed.className = vennClass;
				vennLed.innerHTML = "&#"+vennLight+";";
				moduleObj.appendChild(vennLed);
			}
			
			for (var w = 1; w <= totalWires; w++) {
				var activeWire = workVennWire[w-1];
				
				vennWireWrapper = document.createElement("div");
				vennWire = document.createElement("div");
				vennWire.id = moduleObj.id+"vW"+w;
				vennWire.className = "vennWire";
				if (activeWire.wireBlue && activeWire.wireRed) {
					vennWire.className += " vennBR";
				} else if (activeWire.wireBlue && activeWire.wireWhite) {
					vennWire.className += " vennBW";
				} else if (activeWire.wireRed && activeWire.wireWhite) {
					vennWire.className += " vennRW";
				} else if (activeWire.wireBlue) {
					vennWire.className += " vennB";
				} else if (activeWire.wireRed) {
					vennWire.className += " vennR";
				} else {
					vennWire.className += " vennW";
				}
				vennWire.onclick = function() {cutVennWire(moduleObj, this)};
				vennWireWrapper.appendChild(vennWire);
				moduleObj.appendChild(vennWireWrapper);
			}
			
			for (var s = 1; s <= totalWires; s++) {
				vennStar = document.createElement("div");
				vennStar.id = moduleObj.id+"vS"+s;
				vennStar.className = "vennSlot";
				if (workVennWire[s-1].starSymbol) {
					// Give the wire a star
					vennStar.innerHTML = "&starf;";
				}
				moduleObj.appendChild(vennStar);
			}
			
			moduleObj.style.gridTemplateColumns = "auto";
			for (var i = 2; i <= totalWires; i++) {
				moduleObj.style.gridTemplateColumns += " auto";
			}
			moduleObj.className = "vennFrame";
			break;
		
		case "whosOnFirst":
			whoDisp = document.createElement("div");
			whoDisp.className = "whoDisp";
			whoDisp.id = moduleObj.id+"wD";
			moduleObj.appendChild(whoDisp);
			
			for (var b = 1; b <= 6; b++) {
				whoButtonWrap = document.createElement("div");
				whoButtonWrap.className = "whoButton";
				whoButton = document.createElement("button");
				whoButton.id = moduleObj.id+"wB"+b;
				whoButton.innerHTML = "?";
				whoButton.onclick = function() {pressWhoseButton(moduleObj, this);}
				whoButtonWrap.appendChild(whoButton);
				moduleObj.appendChild(whoButtonWrap);
				
				if (b % 2 == 0) {
					stagePos = (8-b)/2;
					
					whoStage = document.createElement("div");
					whoStage.className = "whoStage";
					whoStage.id = moduleObj.id+"wS"+stagePos;
					moduleObj.appendChild(whoStage);
				}
			}
		
			moduleObj.className = "whoFrame";
			break;
		
		case "wires":
			var totalWires = irandom(3,6);
			
			for (var w = 1; w <= totalWires; w++) {
				newWire = document.createElement("div");
				newWire.id = moduleObj.id+"w"+w;
				newWire.className = "wire";
				newWire.style.backgroundColor = defaultColors[irandom(0,4)];
				if (newWire.style.backgroundColor == defaultColors[3] ||
					newWire.style.backgroundColor == defaultColors[4]) {
					newWire.style.color = defaultColors[0];
				}
				newWire.onclick = function() {cutWire(moduleObj, this)};
				moduleObj.appendChild(newWire);
			}
			break;
			
		case "wireSequence":
			var buildSequence = new Array(12);
			var buildLetters = new Array(12);
			for (var p = 0; p < buildSequence.length; p++) {
				buildSequence[p] = irandom(0,2);
			}
			
			var excludeWires = irandom(2,3);
			for (var x = 0; x < excludeWires; x++) {
				var rollExclude = irandom(0,buildSequence.length-1);
				
				if (buildSequence[rollExclude] >= 0) {
					buildSequence[rollExclude] = -1;
				} else {
					x--;
				}
			}
			
			var wireSeqLetters = ['A', 'B', 'C'];
			var colorCounts = [0,0,0];
			
			for (var s = 4; s >= 1; s--) {
				if (s > 1) {
					for (var w = 5 - s; w <= 12; w += 3) {
						wireNum = document.createElement("div")
						wireNum.id = moduleObj.id+"qN"+w;
						wireNum.className = "wireSeqSlot";
						wireNum.innerHTML = w;
						
						wirePiece = document.createElement("div")
						wirePiece.id = moduleObj.id+"qW"+w;
						wirePiece.className = "seqWire";
						if (buildSequence[w-1] >= 0) {
							wirePiece.style.backgroundColor = defaultColors[buildSequence[w-1]];
							wirePiece.onclick = function() {cutSeqWire(moduleObj, this)};
						} else {
							wirePiece.style.visibility = "hidden";
						}

						wireLetter = document.createElement("div")
						wireLetter.id = moduleObj.id+"qL"+w;
						wireLetter.className = "wireSeqSlot";
						if (buildSequence[w-1] >= 0) {
							buildLetters[w-1] = wireSeqLetters[irandom(0,wireSeqLetters.length-1)];
						} else {
							buildLetters[w-1] = "&mdash;";
						}
						wireLetter.innerHTML = buildLetters[w-1];

						if (w > 3) {
							wireNum.style.display = "none";
							wirePiece.style.display = "none";
							wireLetter.style.display = "none";
						}
						
						moduleObj.appendChild(wireNum);
						moduleObj.appendChild(wirePiece);
						moduleObj.appendChild(wireLetter);
					}
				} else {
					seqWrapper = document.createElement("div");
					seqWrapper.className = "wireSeqSlot";
					seqButton = document.createElement("button");
					seqButton.id = moduleObj.id+"qB";
					seqButton.innerHTML = "&#9664;";
					seqButton.onclick = function() {queueWireSeqStage(moduleObj, false)};
					seqWrapper.appendChild(seqButton);
					moduleObj.appendChild(seqWrapper);

					//Answer Key
					seqAnsKey = document.createElement("div");
					seqAnsKey.className = "seqAux";
					seqAnsKey.id = moduleObj.id+"qA";
					for (var a = 0; a < 12; a++) {
						if (buildSequence[a] >= 0) {
							var canCut = false;
							colorCounts[buildSequence[a]]++;
							// Nested switches are a mess...
							switch (buildSequence[a]) {
								case 0: //Black
									switch (colorCounts[buildSequence[a]]) {
										case 1:
											canCut = true;
											break;
										case 2:
											// Fall thru
										case 4:
											canCut = (buildLetters[a] != 'B');
											break;
										case 3:
											// Fall thru
										case 5:
											canCut = (buildLetters[a] == 'B');
											break;
										case 6:
											canCut = (buildLetters[a] != 'A');
											break;
										case 7:
											canCut = (buildLetters[a] != 'C');
											break;
										default:
											canCut = (buildLetters[a] == 'C');
											break;
									}
									
									break;
								case 1: //Blue
									switch (colorCounts[buildSequence[a]]) {
										case 1:
											// Fall thru
										case 3:
											// Fall thru
										case 5:
											canCut = (buildLetters[a] == 'B');
											break;
										case 2:
											// Fall thru
										case 8:
											canCut = (buildLetters[a] != 'B');
											break;
										case 6:
											canCut = (buildLetters[a] != 'A');
											break;
										case 7:
											canCut = (buildLetters[a] == 'C');
											break;
										default:
											canCut = (buildLetters[a] == 'A');
											break;
									}
									
									break;
								case 2: //Red
									switch (colorCounts[buildSequence[a]]) {
										case 1:
											canCut = (buildLetters[a] == 'C');
											break;
										case 3:
											canCut = (buildLetters[a] == 'A');
											break;
										case 4:
											// Fall thru
										case 6:
											canCut = (buildLetters[a] != 'B');
											break;
										case 7:
											canCut = true;
											break;
										case 8:
											canCut = (buildLetters[a] != 'C');
											break;
										default:
											canCut = (buildLetters[a] == 'B');
											break;
									}
									
									break;
							}
							
							if (canCut) {
								seqAnsKey.innerHTML += "C";
							} else {
								seqAnsKey.innerHTML += "s";
							}
						} else {
							seqAnsKey.innerHTML += "-";
						}
					}
					moduleObj.appendChild(seqAnsKey);

					seqWrapper = document.createElement("div");
					seqWrapper.className = "wireSeqSlot";
					seqButton = document.createElement("button");
					seqButton.id = moduleObj.id+"qF";
					seqButton.innerHTML = "&#9654;";
					seqButton.onclick = function() {queueWireSeqStage(moduleObj, true)};
					seqWrapper.appendChild(seqButton);
					moduleObj.appendChild(seqWrapper);
				}
					
				stageSlot = document.createElement("div");
				stageSlot.id = moduleObj.id+"qS"+s;
				stageSlot.className = "wireSeqStage";
				moduleObj.appendChild(stageSlot);
			}
		
			moduleObj.className = "wireSeqFrame";
			break;
		
		default: 
			newButton = document.createElement("button");
			newButton.className = "interact";
			newButton.onclick = function() {solveModule(moduleObj, true, true)};
			newButton.innerHTML = "Solve me!";
			moduleObj.appendChild(newButton);
			
			newButton = document.createElement("button");
			newButton.className = "interact";
			newButton.onclick = function() {solveModule(moduleObj, false, true)};;
			newButton.innerHTML = "Strike me!";
			moduleObj.appendChild(newButton);
			break;
	}
}

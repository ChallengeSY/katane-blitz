// This function determines how to build the elements for a given module. One case per module
function createBombModule(moduleObj, moduleClass) {
	switch (moduleClass) {
		// Vanilla modules
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
			newButton.onmouseup = function(event) { validateButtonPress(event, moduleObj); }
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
				newKeypad.onclick = function() { pressKeypad(moduleObj, this); }
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
			var animationTotal = Math.max((20000 - Math.floor(score/25)*1000),16000);
		
			newLight = document.createElement("div");
			newLight.className = "morseLight";
			newLight.style.animation = "freq"+targFreq+" "+animationTotal+"ms 2s infinite";
			moduleObj.appendChild(newLight);
			
			moduleObj.appendChild(makeBr());
			
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
			newButton.style.marginRight = "0px";
			newButton.style.marginBottom = "20px";
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
		
		// Needy modules
		case "capacitor":
			dispDiv = document.createElement("div");
			dispDiv.className = "ventGasDisp";
			dispDiv.id = moduleObj.id+"nV";

			createButton = document.createElement("button");
			createButton.id = moduleObj.id+"nD";
			createButton.innerHTML = "Discharge!";
			createButton.onmousedown = function() { dischargeCapacitor(moduleObj, true); }
			createButton.onmouseup = function() { dischargeCapacitor(moduleObj, false); }
			createButton.ontouchstart = createButton.onmousedown;
			createButton.ontouchend = createButton.onmouseup;
			createButton.onmouseout = createButton.onmouseup;
			createButton.disabled = true;
			dispDiv.appendChild(createButton);

			timerMeter = document.createElement("meter");
			timerMeter.id = moduleObj.id+"nH";
			timerMeter.className = "needyModule";
			timerMeter.style.marginLeft = "20px";
			timerMeter.style.marginRight = "20px";
			timerMeter.max = 45;
			timerMeter.low = 25;
			timerMeter.high = 40;
			timerMeter.optimal = 20;
			timerMeter.min = 0;
			dispDiv.appendChild(timerMeter);

			timerDisp = document.createElement("span");
			timerDisp.className = "needyTimer";
			timerDisp.id = moduleObj.id+"nT";
			timerDisp.innerHTML = "&nbsp;";
			dispDiv.appendChild(timerDisp);
		
			moduleObj.appendChild(dispDiv);
			moduleObj.className = "capacitorFrame";
			break;
			
		case "knob":
			topWrapper = document.createElement("div");
			topWrapper.className = "knobTop";
			knobLabel = document.createElement("div");
			knobLabel.id = moduleObj.id+"nK";
			knobLabel.className = "knobLabel";
			knobLabel.innerHTML = "Up ";

			knobLabel.appendChild(makeBr());
			
			knobButton = document.createElement("button");
			knobButton.id = moduleObj.id+"nB";
			knobButton.className = "knobButton";
			knobButton.innerHTML = "&Uarr;";
			knobButton.disabled = true;
			knobButton.onclick = function() { rotateKnob(this); }
			knobLabel.appendChild(knobButton);

			knobLabel.appendChild(makeBr());

			knowAnswerKey = document.createElement("span");
			knowAnswerKey.className = "knobAnswer";
			knowAnswerKey.id = moduleObj.id+"nA";
			knowAnswerKey.innerHTML = "&nbsp;"
			knobLabel.appendChild(knowAnswerKey);
			
			topWrapper.appendChild(knobLabel);
			moduleObj.appendChild(topWrapper);

			timerDiv = document.createElement("div");
			timerDiv.className = "knobTimer needyTimer";
			
			timerMeter = document.createElement("meter");
			timerMeter.id = moduleObj.id+"nH";
			timerMeter.className = "needyModule";
			timerMeter.max = 40;
			timerMeter.min = -40;
			timerDiv.appendChild(timerMeter);
			
			timerDiv.appendChild(makeBr());

			timerDisp = document.createElement("span");
			timerDisp.id = moduleObj.id+"nT";
			timerDisp.innerHTML = "&nbsp;";
			timerDiv.appendChild(timerDisp);
			moduleObj.appendChild(timerDiv);
			
			for (var l = 1; l <= 12; l++) {
				lightDiv = document.createElement("div");
				lightDiv.className = "knobLight";
				lightDiv.id = moduleObj.id+"nL"+l;
				moduleObj.appendChild(lightDiv);
			}
		
			moduleObj.className = "knobFrame";
			break;
		
		case "ventGas":
			dispDiv = document.createElement("div");
			dispDiv.className = "ventGasDisp";
			dispDiv.id = moduleObj.id+"nV";
			moduleObj.appendChild(dispDiv);
			
			buttonDiv = document.createElement("div");
			buttonDiv.className = "ventButton";
			createButton = document.createElement("button");
			createButton.id = moduleObj.id+"nY";
			createButton.innerHTML = "Y";
			createButton.onclick = function() {answerVentGas(moduleObj, true);}
			createButton.disabled = true;
			buttonDiv.appendChild(createButton);
			moduleObj.appendChild(buttonDiv);

			timerDiv = document.createElement("div");
			timerDiv.className = "ventTimer needyTimer";
			
			timerMeter = document.createElement("meter");
			timerMeter.id = moduleObj.id+"nH";
			timerMeter.className = "needyModule";
			timerMeter.max = 40;
			timerMeter.min = -35;
			timerDiv.appendChild(timerMeter);
			
			timerDiv.innerHTML += "<br />";

			timerDisp = document.createElement("span");
			timerDisp.id = moduleObj.id+"nT";
			timerDisp.innerHTML = "&nbsp;";
			timerDiv.appendChild(timerDisp);
			moduleObj.appendChild(timerDiv);
			
			buttonDiv = document.createElement("div");
			buttonDiv.className = "ventButton";
			createButton = document.createElement("button");
			createButton.id = moduleObj.id+"nN";
			createButton.innerHTML = "N";
			createButton.onclick = function() {answerVentGas(moduleObj, false);}
			createButton.disabled = true;
			buttonDiv.appendChild(createButton);
			moduleObj.appendChild(buttonDiv);
		
			moduleObj.className = "ventGasFrame";
			break;
			
		// Pack 1 modules
		case "9ball":
			frameDiv = document.createElement("div");
			frameDiv.className = "nineBallFrame";

			for (var b = 0; b < 9; b++) {
				ballDiv = document.createElement("div");
				ballDiv.className = "nineBall obj"+b;
				ballDiv.id = moduleObj.id+"nbO"+b;
				ballDiv.onclick = function() {pot9Ball(moduleObj, this);}
				
				labelDiv = document.createElement("div");
				labelDiv.className = "nbLabel"
				labelDiv.id = moduleObj.id+"nbL"+b;
				ballDiv.appendChild(labelDiv);
				frameDiv.appendChild(ballDiv);
			}

			breakDiv = document.createElement("div");
			breakDiv.className = "nbBreak";
			breakDiv.id = moduleObj.id+"nbK";
			frameDiv.appendChild(breakDiv);

			moduleObj.appendChild(frameDiv);
			break;
			
		case "adjLetters":
			var letterBank = [];
			var rollLetter;
			
			frameDiv = document.createElement("div");
			frameDiv.className = "adjLetFrame";

			buttonDiv = document.createElement("div");
			buttonDiv.className = "adjLetSubmit";
			createButton = document.createElement("button");
			createButton.innerHTML = "Submit";
			createButton.onclick = function() {submitAdjLetters(moduleObj);}
			buttonDiv.appendChild(createButton);
			frameDiv.appendChild(buttonDiv);
			
			for (var l = 0; l < 12; l++) {
				do
					rollLetter = irandom(0,25);
				while (letterBank[rollLetter]);
				letterBank[rollLetter] = true;
				
				letterDiv = document.createElement("div");
				letterDiv.className = "adjacentLetter";
				letterDiv.id = moduleObj.id+"adjLet"+l;
				letterDiv.innerHTML = String.fromCharCode(rollLetter + 65);
				letterDiv.onclick = function() {toggleAdjLetter(moduleObj, this);}
				frameDiv.appendChild(letterDiv);
			}

			moduleObj.appendChild(frameDiv);
			break;
		
		case "cruelModulo":
			// Fall thru
		
		case "modulo":
			visorDiv = document.createElement("div");
			visorDiv.className = "moduloDivisor";
			visorDiv.id = moduleObj.id+"xmV";
			moduleObj.appendChild(visorDiv);
			
			videnDiv = document.createElement("div");
			videnDiv.className = "moduloDividend";
			videnDiv.id = moduleObj.id+"xmD";
			moduleObj.appendChild(videnDiv);
			
			expoDiv = document.createElement("div");
			expoDiv.className = "moduloExponent";
			expoDiv.id = moduleObj.id+"xmE";
			moduleObj.appendChild(expoDiv);
			
			for (var d = 1; d <= 10; d++) {
				buttonDiv = document.createElement("div");
				buttonDiv.className = "moduloButton";
				createButton = document.createElement("button");
				createButton.innerHTML = (d % 10);
				createButton.onclick = function() {inputModDigit(moduleObj, this);}
				buttonDiv.appendChild(createButton);
				moduleObj.appendChild(buttonDiv);
			}
				
			buttonDiv = document.createElement("div");
			buttonDiv.className = "moduloSubmit";
			createButton = document.createElement("button");
			createButton.innerHTML = "S";
			createButton.onclick = function() {submitModulo(moduleObj);}
			buttonDiv.appendChild(createButton);
			moduleObj.appendChild(buttonDiv);
			
			inputDiv = document.createElement("div");
			inputDiv.className = "moduloInput";
			inputDiv.id = moduleObj.id+"xmI";
			moduleObj.appendChild(inputDiv);
				
			buttonDiv = document.createElement("div");
			buttonDiv.className = "moduloClear";
			createButton = document.createElement("button");
			createButton.innerHTML = "C";
			createButton.onclick = function() {clearModulo(moduleObj, true);}
			buttonDiv.appendChild(createButton);
			moduleObj.appendChild(buttonDiv);

			moduleObj.className = "moduloFrame";
			break;
			
		case "switches":
			var problem, solution;
			do {
				problem = irandom(0,31);
				solution = irandom(0,31);
			} while (problem == solution || countBitDiff(problem, solution) <= 1 || !switchesValid(problem) || !switchesValid(solution));
			
			masterDiv = document.createElement("div");
			masterDiv.className = "switchesFrame";

			for (var t = 0; t < 5; t++) {
				if (checkBit(solution, 4-t)) {
					switchLight = 9898;
					switchClass = "vennSlot led";
				} else {
					switchLight = 9899;
					switchClass = "vennSlot";
				}

				lightDiv = document.createElement("div");
				lightDiv.id = moduleObj.id+"swT"+t;
				lightDiv.className = switchClass;
				lightDiv.innerHTML = "&#"+switchLight+";";
				masterDiv.appendChild(lightDiv);
			}
			
			for (var f = 0; f < 5; f++) {
				frameDiv = document.createElement("div");
				frameDiv.className = "flipSwitch";
				switchLabel = document.createElement("label");
				hiddenBox = document.createElement("input");
				hiddenBox.type = "checkbox";
				hiddenBox.id = moduleObj.id+"swF"+f;
				hiddenBox.checked = (checkBit(problem, 4-f));
				hiddenBox.oninput = function() {validateSwitches(moduleObj, this)};
				slider = document.createElement("span");
				slider.className = "slideSwitch";
				switchLabel.appendChild(hiddenBox);
				switchLabel.appendChild(slider);
				frameDiv.appendChild(switchLabel);
				masterDiv.appendChild(frameDiv);
			}
			
			for (var b = 0; b < 5; b++) {
				if (checkBit(solution, 4-b)) {
					switchLight = 9899;
					switchClass = "vennSlot";
				} else {
					switchLight = 9898;
					switchClass = "vennSlot led";
				}

				lightDiv = document.createElement("div");
				lightDiv.id = moduleObj.id+"swB"+b;
				lightDiv.className = switchClass;
				lightDiv.innerHTML = "&#"+switchLight+";";
				masterDiv.appendChild(lightDiv);
			}
			
			moduleObj.appendChild(masterDiv);
			break;
		
		// Pack 2 modules
		case "alphabet":
			var targWord = alphaTable[irandom(0,alphaTable.length-1)];
			var auxLetters = [-1, -1];
			if (targWord.length < 4) {
				for (var l = 0; l < 4-targWord.length; l++) {
					do {
						auxLetters[l] = irandom(0,25);
					} while (targWord.search(masterLetterBank.charAt(auxLetters[l])) >= 0 || auxLetters[0] == auxLetters[1]);
				}
				
				for (var m = 0; m < 2; m++) {
					if (auxLetters[m] >= 0) {
						targWord = targWord + masterLetterBank.charAt(auxLetters[m]);
					}
				}
				
				targWord = checkABCsolution(targWord);
			}
						
			var rollsTaken = [false, false, false, false];
			var dieRoll;
			
			for (var k = 0; k < 4; k++) {
				newABCbutton = document.createElement("button");
				newABCbutton.className = "keypad";
				if (k < 2) {
					newABCbutton.style.marginTop = "auto";
				}
				if (k % 2 == 0) {
					newABCbutton.style.marginLeft = "auto";
				}
				
				do {
					dieRoll = irandom(0,3);
				} while (rollsTaken[dieRoll]);
				rollsTaken[dieRoll] = true;
				
				newABCbutton.id = moduleObj.id+"aB"+dieRoll;
				newABCbutton.innerHTML = targWord.charAt(dieRoll).toUpperCase();
				
				newABCbutton.onclick = function() { pressABCbutton(moduleObj, this); }
				moduleObj.appendChild(newABCbutton);
			}
			
			moduleObj.className = "keypadFrame";
			break;
		
		case "coloKeys":
			colDisp = document.createElement("div");
			colDisp.className = "colKeyDisp";
			colDisp.id = moduleObj.id+"cD";
			moduleObj.appendChild(colDisp);
			
			for (var k = 0; k < 4; k++) {
				colKey = document.createElement("button");
				colKey.className = "colKeyButton";
				if (k < 2) {
					colKey.style.marginTop = "auto";
				}
				if (k % 2 == 0) {
					colKey.style.marginLeft = "auto";
				}
				
				colKey.id = moduleObj.id+"cK"+k;
				colKey.onclick = function() { pressColKey(moduleObj, this); }
				moduleObj.appendChild(colKey);
			}
			
			moduleObj.className = "colKeyFrame";
			break;
			
		case "coprime":
			copDisp = document.createElement("div");
			copDisp.className = "coprimeDisp";
			copDisp.id = moduleObj.id+"cD";
			copDisp.innerHTML = "<span id=\""+moduleObj.id+"cT\"></span><br /><span id=\""+moduleObj.id+"cB\"></span>"
			moduleObj.appendChild(copDisp);
			
			for (var s = 3; s >= 1; s--) {
				copStage = document.createElement("div");
				copStage.className = "coprimeStage";
				copStage.id = moduleObj.id+"cS"+s;
				moduleObj.appendChild(copStage);
				
				if (s == 1) {
					var buttonLabel = "Coprime";
					
					for (var b = 1; b <= 2; b++) {
						copButtonWrap = document.createElement("div");
						copButtonWrap.className = "coprimeButton";
						copButton = document.createElement("button");
						copButton.id = moduleObj.id+"cB"+b;
						if (b > 1) {
							buttonLabel = "Not " + buttonLabel;
						}
						copButton.innerHTML = buttonLabel;
						copButton.onclick = function() {pressCoprimeButton(moduleObj, this);}
						copButtonWrap.appendChild(copButton);
						moduleObj.appendChild(copButtonWrap);
					}
				}
			}
			
			moduleObj.className = "coprimeFrame";
			break;
		
		case "numButtons":
			frameDiv = document.createElement("div");
			frameDiv.className = "numButFrame";
		
			for (var n = 0; n < 16; n++) {
				newButton = document.createElement("button");
				newButton.className = "numButton";
				if (n < 4) {
					newButton.style.marginTop = "auto";
				}
				if (n % 4 == 0) {
					newButton.style.marginLeft = "auto";
				}
				
				newButton.id = moduleObj.id+"nb"+n;
				
				newButton.onclick = function() { pressNumberedButton(moduleObj, this); }
				frameDiv.appendChild(newButton);
			}
			
			frameDiv.id = moduleObj.id+"nbF";
			moduleObj.appendChild(frameDiv);
			break;
		
		
		default: 
			newButton = document.createElement("button");
			newButton.className = "interact";
			newButton.onclick = function() {solveModule(moduleObj, true, false, 0)};
			newButton.innerHTML = "Solve me!";
			moduleObj.appendChild(newButton);
			
			newButton = document.createElement("button");
			newButton.className = "interact";
			newButton.onclick = function() {solveModule(moduleObj, false, true, 0)};;
			newButton.innerHTML = "Strike me!";
			moduleObj.appendChild(newButton);
			break;
	}
}

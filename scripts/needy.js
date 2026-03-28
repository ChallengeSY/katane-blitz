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
	
	if (gameActive) {
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
		} else if (displayObj.innerHTML.startsWith("Vent")) {
			console.log("Needy module has successfully vented gas.")
			activateVentGas(readObj, false, false);
			if (Math.random() < 0.95 || eggCooldown > 0) {
				displayObj.innerHTML = "Venting complete.";
			} else {
				displayObj.innerHTML = "Mmmm good stuff!";
				playSound(fartSnd);
				eggCooldown = 7;
			}
		} else {
			activateVentGas(readObj, false, false);
		}
	} else {
		if (displayObj.innerHTML.startsWith("Detonate")) {
			console.log("Needy module has successfully avoided detonation.")
			activateVentGas(readObj, false, false);
		} else if (displayObj.innerHTML.startsWith("Vent")) {
			console.log("Needy module still needs to vent gas.")
			displayObj.innerHTML = "Venting prevents explosions.";
			setTimeout(function() {activateVentGas(readObj, true, true)}, 5000);
		} else {
			activateVentGas(readObj, false, false);
		}
	}
}

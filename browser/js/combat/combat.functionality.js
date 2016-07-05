function handleAttackInput (x, y) {
	var target = checkForTarget(x, y); // pass in location of click
    if (target) {
      setSingleTargetForCurrentSelection(target);
    } else {
      setVigilantAttackMove([x, y]);
    }
    attackPending = false;
}

function checkForTarget (x, y) { 
	// for enemy players
	var targets = tree.search({
		minX: x - 2,
		minY: y - 2,
		maxX: x + 2,
		maxY: y + 2
	});

	if (targets.length) {
		return targets[0];
	}

	// friendly fire 
	for (var unitId in player.units) {
		var unit = player.units[unitId];
		if (inRange(unit.pos[0], unit.sprite.size[0] + unit.pos[0], x, x + 5) && 
			inRange(unit.pos[1], unit.sprite.size[1] + unit.pos[1], y, y + 5)) {

			return unit; // just sends back one element if you are a troll
		}
	}
	return null;
}

function setSingleTargetForCurrentSelection (target) {
  currentSelection.forEach(function (elem) {
    elem.attackTarget = target || null;
  });
}
// targetpos is an array with an x and y coordinate 
function setVigilantAttackMove (targetpos) {
  currentSelection.forEach(function (elem) {
    elem.vigilant = true;
    elem.targetpos = targetpos;
  });
}

function attachTargets () {
	var attackingUnits = [];

	for (var unitId in player.units) {
		var unit = player.units[unitId];
		if (unit.vigilant) {
			var targets = tree.search({
				minX: unit.minX,
				minY: unit.minY,
				maxX: unit.maxX,
				maxY: unit.maxY
			});

			if (targets.length) {
				unit.attackTarget = targets[0];
				attackingUnits.push(unit);
			}
		}
	}
	return attackingUnits;
}

function checkCombat () {
	var attackingUnits = attachTargets();

	checkIfBeingHit(); 

	attackingUnits.forEach(function (unit) {
		unit.queuedpos = unit.queuedpos || unit.targetpos;
		unit.targetpos = unit.pos;

		if (!unit.lastAttackTaken || Date.now() - unit.lastAttackTaken >= unit.rateOfAttack) {
			unit.lastAttackTaken = Date.now();
			
			var damageDealt = unit.attack - unit.attackTarget.defense;
			// send attack damage to server
			socket.emit('damageDone', {victim: unit.attackTarget, damage: damageDealt});

			unit.attackTarget.currentHealth -= (unit.attack - unit.attackTarget.defense);
			playSoundOnEvent(attackSound);

		}

		if (unit.attackTarget.currentHealth <= 0) {
			unit.targetpos = unit.queuedpos;
			unit.queuedpos = null;
			tree.remove(unit.attackTarget);
		}
	})
}

function checkIfBeingHit () {
	for (var unitId in player.units) {
		var unit = player.units[unitId];
		if (unit.hit) {
			unit.vigilant = true;
		}
	}
}

function removeDeadUnits () {
	for (var unitId in player.units) {
		if (player.units[unitId].currentHealth <= 0) {
			delete player.units[unitId];
		}
	}
}






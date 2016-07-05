function prepForUnitTree (unit) { // for other units
    unit.minX = unit.pos[0];
    unit.minY = unit.pos[1];
    unit.maxX = unit.pos[0] + unit.sprite.size[0];
    unit.maxY = unit.pos[1] + unit.sprite.size[1];
    return unit;
}

function prepForCombat(unit) { // for our own units
    unit.minX = unit.pos[0] - unit.range;
    unit.minY = unit.pos[1] - unit.range;
    unit.maxX = unit.pos[0] + unit.sprite.size[0] + unit.range;
    unit.maxY = unit.pos[1] + unit.sprite.size[1] + unit.range;
    return unit;
}

function removeFromTreeOnDisconnect (socketId) {
	for (var unitId in otherPlayers[socketId].units) {
		var unit = otherPlayers[socketId].units[unitId];
		tree.remove(unit);
	}
}



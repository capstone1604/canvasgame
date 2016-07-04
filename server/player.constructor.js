function Player(id, userName) {
	this.id = id; // socket.id
	this.userName = userName || "";
	this.numberOfSessions = 0;
	this.wealth = 20000;
	this.units = {}; // obj of Unit objects
	this.unitNumber = 0;
	this.buildings = {}; // obj of building objects
	this.buildingNumber = 0;
	this.isKing = false;
	this.absoluteMaxSupply = 50;

}

Player.prototype.currentSupply = function() {
	var count = 0;
	for (unit in this.units) {
		if (this.units.hasOwnProperty(unit)) {
			count++;
		}
	}
	return count;
};

Player.prototype.currentMaxSupply = function() {
		var count = 10;
		for (building in this.buildings) {
			if (this.buildings.hasOwnProperty(building)) {
				if (this.buildings[building].type === "house") {
					count += 10;
				}
			}
		}
		return count;
	};

module.exports = Player;
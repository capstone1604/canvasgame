function Unit (pos, type, maxHealth, attack, defense, speed, socketId, unitId, targetpos) {
  this.pos = pos; // array of [x, y]
  this.type = type; //string
  this.selected = false;
  this.speed = speed;
  this.maxHealth = maxHealth; // integer
  this.currentHealth = maxHealth;
  this.attack = attack; // integer
  this.defense = defense; // integer
  this.sprite = null; // a value for this property is set on the front-end
  this.targetpos = targetpos || undefined;
  this.vigilant = false;
  this.socketId = socketId;
  this.lastMovement = {dir1: undefined, dir2: undefined}; // helps with the building collision algorithm
  this.id = unitId;
  this.attackTarget = null;
  this.hit = null;
  this.lastAttackTime = null;
}

//hero cannot have a default targetpos because it cannot be created

function Hero (pos, socketId, unitId){
  Unit.call(this, pos, 'hero', 100, 5, 1, 50, socketId, unitId);
  this.rateOfAttack = 3000; // in milliseconds, means 1 attack per second
  this.range = 50;
}

function Soldier (pos, socketId, unitId, targetpos){
  Unit.call(this, pos, 'soldier', 60, 10, 0, 75, socketId, unitId, targetpos);
  this.rateOfAttack = 2000; // twice a second
  this.range = 150;
}

module.exports = {
  Unit : Unit,
  Hero: Hero,
  Soldier: Soldier
};

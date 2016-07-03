var express = require('express');
var app = express();
var path = require('path');
var io = require('socket.io');
var utils = require('./server/utils');
var Player = require('./server/player.constructor');
var Unit = require('./server/unit.constructor').Unit;
var Hero = require('./server/unit.constructor').Hero;
var Soldier = require('./server/unit.constructor').Soldier;
var Bar = require('./server/building.constructor').Bar;
var House = require('./server/building.constructor').House;

app.use(express.static(__dirname + '/public/'));
app.use(express.static(__dirname + '/browser/'));
app.use(express.static(__dirname + '/node_modules/'));

var gameConfig = require('./config.json');

// currently not used
// var quadtree = require('simple-quadtree');
// var tree = quadtree(0, 0, gameConfig.width, gameConfig.height);

// rBush
var tree = require('rbush')();


// all the objects on the canvas
var players = {};
var sockets = {};
var units = {};
var buiildings = {};
var moneyBags = {count: 0};
var currentKing;
generateMoneyBags(100);

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

var server = app.listen(3030, function () {
  console.log('App listening on port 3030!');
});

io = io.listen(server);

io.on('connection', function (socket) {
    console.log("New user has joined. ID: ", socket.id)
    var currentPlayer = new Player(socket.id);

    sockets[socket.id] = socket;

    // when the new user joins!
    socket.on('respawn', function (newPlayerData) {

        currentPlayer.userName = newPlayerData.userName;
        currentPlayer.id = socket.id;
        currentPlayer.units[0] = new Hero([200,200], socket.id);
        currentPlayer.units[1] = new Soldier([300, 300], socket.id);
        currentPlayer.unitNumber = 2;

        // emit the current object of players then add your player no the array
        socket.emit('playersArray', players); //to see everyone else

        addPlayer(currentPlayer);

        //assign current player as king if he is the first one to join
        if (Object.keys(players).length < 2) {
            changeKing(currentPlayer.id);
        }

        socket.emit('gameReady', {playerData: currentPlayer, moneyBags: moneyBags}, currentKing);
        socket.broadcast.emit('otherPlayerJoin', currentPlayer);
    });

    socket.on('disconnect', function () {
        console.log("User with ID", socket.id, "has disconnected.")
        removePlayer(socket); // removes them from players AND sockets collections

        //if a king disconnects, search again for the new king
        if (socket.id === currentKing){
            if (Object.keys(players).length > 0){
                var currentRichest;
                for (var id in players){
                    if(!currentRichest){
                        currentRichest = players[id];
                    }
                    else if (players[id].wealth > currentRichest.wealth){
                        currentRichest = players[id];
                    }
                }
                changeKing(currentRichest.id);
            }
            else {
                currentKing = undefined;
            }
            socket.broadcast.emit('newKing', currentKing);
        }
        socket.broadcast.emit('otherPlayerDC', socket.id);
        socket.disconnect();
    });

    socket.on('playerMoves', function (playerData) {
    	socket.broadcast.emit('otherPlayerMoves', playerData);
    })

    socket.on('moneyDiscovered', function (moneyBagData) {
    	//increase the wealth of the player
    	players[moneyBagData.playerId].wealth += moneyBagData.value;

        //check if this player's wealth becomes higher than the king's
        if (players[moneyBagData.playerId].wealth > players[currentKing].wealth){
            changeKing(moneyBagData.playerId, currentKing);
            io.emit('newKing', currentKing);
        }

        //change object representing available money on all clients

        var newBagKeyName = generateMoneyBags(1);

        var bagUpdate = {
            deletedBagName: moneyBagData.name,
            newBagName: newBagKeyName.join(","),
            newBagValue: moneyBags[newBagKeyName]
        }
        console.log(bagUpdate);
        io.emit('deleteAndUpdateMoneyBags', bagUpdate);
    	delete moneyBags[moneyBagData.name];
    	//replenish the moneyBags object
    	generateMoneyBags(1);
    })

    socket.on('initialBuildRequest', function (data){
        //if bar
        if (data.request === 1 && data.type === "bar") {
            if (players[data.id].wealth < 2000) {
                //denied
                socket.emit('initialBuildResponse', {valid: false, request: 1, type: "bar"});
            } else {
                //approved
                socket.emit('initialBuildResponse', {valid: true, request: 1, type: "bar"});
            }
        //if house
        } else if (data.request === 1 && data.type === "house") {
            if (players[data.id].wealth < 1000) {
                //denied
                socket.emit('initialBuildResponse', {valid: false, request: 1, type: "house"});
            } else {
                //approved
                socket.emit('initialBuildResponse', {valid: true, request: 1, type: "house"});
            }
        }
    });

    socket.on('finalBuildRequest', function (data) {
        if (data.request === 2 && data.type === "bar") {
            if (players[data.id].wealth < 2000) {
                io.emit('finalBuildResponse', {valid: false, request: 2, error: "lacking resources"});
            } else if (false) {
            //make sure the building doesn't collide with another building
                io.emit('finalBuildResponse', {valid: false, request: 2, error: "collision"});
            //temporarily false because we don't have collision set up
            } else {
                var newBar = new Bar(data.pos, data.id);
                players[data.id][players[data.id].buildingNumber] = newBar;
                players[data.id].buildingNumber++;
                players[data.id].wealth = players[data.id].wealth - 2000;
                io.emit('finalBuildResponse', { valid: true, 
                                                    request: 2, 
                                                    buildingObj: newBar, 
                                                    name: players[data.id].buildingNumber, 
                                                    currentWealth: players[data.id].wealth});
            }
        } else if (data.request === 2 && data.type === "house") {
            if (players[data.id].wealth < 1000) {
                io.emit('finalBuildResponse', {valid: false, request: 2, error: "lacking resources"});
            } else if (false) {
            //make sure the building doesn't collide with another building
                io.emit('finalBuildResponse', {valid: false, request: 2, error: "collision"});
            //temporarily false because we don't have collision set up
            } else {
                var newHouse = new House(data.pos, data.id);
                players[data.id][players[data.id].buildingNumber] = newHouse;
                players[data.id].buildingNumber++;
                players[data.id].wealth = players[data.id].wealth - 1000;
                io.emit('finalBuildResponse', { valid: true, 
                                                    request: 2, 
                                                    buildingObj: newHouse, 
                                                    name: players[data.id].buildingNumber, 
                                                    currentWealth: players[data.id].wealth});
            }
        }
    })

    socket.on('hireMercenaryRequest', function (data) {
        //checks to see if player has enough money to buy a merc
        if (players[data.playerId].wealth < 400) {
            socket.emit('hireMercenaryResponse', {valid: false, error: "lacking resources"});
        //checks to see that would not surpass current max supply by building another unit
        } else if (players[data.playerId].currentSupply + 1 > players[data.playerId].currentMaxSupply) {
            socket.emit('hireMercenaryResponse', {valid: false, error: "surpasses cap"});
        //else it's a valid request. Start building, and send updates
        } else {
            console.log("DATA OBJECT", data);
            //check to see whether the building has a rendezvous point

            //if not, get coords for the building, and use those to create the default
            //NOTE TO SELF: create a function on the prototype

            //new unit is valid. add to queue for this building
            players[data.playerId].unitNumber++; 
            console.log("DOES IT FIND THE BUILDING?", players[data.playerId].buildings[data.buildingId]);
            players[data.playerId].buildings[data.buildingId].productionQueue.push(new Solider([100, 100], data.playerId, playersplayers[data.playerId].unitNumber));
            console.log("ADDED TO QUEUE?", players[data.playerId].buildings[data.buildingId].productionQueue);
            var progress = 0;
            //currently uses setTimeout, but this will likely crowd the event loop 
            function measureProgress(){
                socket.emit('hireMercenaryResponse', {valid: true, progress: progress});
                console.log(progress);
                var again = setTimeout(function(){
                    if (progress < 16) {
                        progress++;
                        measureProgress();
                    } else {
                        //add mercenary to player object on server, and send to client

                        //remove the mercenary from the queue (shift)
                        players[data.playerId].buildings[buildingId].productionQueue.shift();
                        //if another merc has been added to the queue, do this again
                    }
                }, 800);
            }
            measureProgress();
        }
    })

});


//initially generate money bags for the moneyBags object
function generateMoneyBags(count){
    moneyBags.count = Object.keys(moneyBags).length - 1 + count;
    if (count === 1) {
        var keyName = [utils.getRandomNum(2000), utils.getRandomNum(1000)]
        moneyBags[keyName] = {value : utils.getRandomNum(25, 75)};
        return keyName;

    } else {
        for (var i = 0; i < count; i++) {
            //values of array represent x and y. later, change this so that x = max x of canvas and y is max y of canvas
            moneyBags[[utils.getRandomNum(2000), utils.getRandomNum(1000)]] = {value : utils.getRandomNum(25, 75)};
        }
    }
}

function addPlayer (playerData) {
    players[playerData.id] = playerData;
    
}

function addEntities () {
    tree.add()
}

function removePlayer (socket) {
    delete sockets[socket.id];
    delete players[socket.id];
}

function changeKing (newKing, previousKing){
    if(previousKing) players[previousKing].isKing = false;
    players[newKing].isKing = true;
    currentKing = newKing;
}

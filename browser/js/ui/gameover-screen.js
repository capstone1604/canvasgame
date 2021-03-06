function gameOverFunc(){
	//make the render function stop checking if its game over
	gameOver = true;
	gameStarted = false;
	//make appropriate changes to GUI
	$("#fullscreen-overlay").show();
	$("#game-over-message-box").show();
	$("#world-wealth-display").hide();
	$("#game-controls").hide();
	$("#login-screen").hide();
	//canvas should no longer be scrollable

	//destroy the player's representation of its moneybags and its buildings/units
	//but can still see other players moving -- intended
	player.units = {};
	player.building = {};
	//announce to the world that someone died
	socket.emit("playerDied", {username: player.username, playerId: player.id});
}

function checkIfGameOver() {
	if (!player.units[0]) {
		gameOverFunc();
	}
}

$("#game-over-message-box button").click(function(){
	restartGame();
})

function restartGame () {
	$("#fullscreen-overlay").hide();
	$("#world-wealth-display").show();
	$("#game-controls").show();
	socket.emit("respawn", {userName: player.username});
}

socket.on("notificationPlayerDied", function(data){
 	displayNotificationPlayerDied(data.username);
 	otherPlayers[data.playerId].units = {};
 	otherPlayers[data.playerId].buildings = {};
})
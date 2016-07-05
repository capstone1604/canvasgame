function walk(dt){
    for (var unitId in player.units) {
        var unit = player.units[unitId];
        if (unit.targetpos){

            prepForCombat(unit); // for changing their range radius on R tree

            if (Math.abs(unit.pos[0] - unit.targetpos[0]) > 5 || Math.abs(unit.pos[1] - unit.targetpos[1]) > 5){
                var distance = unit.speed*dt;
                if (unit.type === 'hero' && player.id === currentKing){
                    unit.sprite._index += 0.25;
                    switch(detectBuildings(unit, dt)){
                        case 'down':
                        unit.sprite.pos = [0, 0];
                        unit.pos[1] += distance;
                        unit.lastMovement.dir2 = 'down';
                        continue;

                        case 'up':
                        unit.sprite.pos = [0, 155];
                        unit.pos[1] -= distance;
                        unit.lastMovement.dir2 = 'up';
                        continue;
                        
                        case 'right':
                        unit.sprite.pos = [0, 105];
                        unit.pos[0] += distance;
                        unit.lastMovement.dir2 = 'right';
                        continue;
                        
                        case 'left':
                        unit.sprite.pos = [0, 53];
                        unit.pos[0] -= distance;
                        unit.lastMovement.dir2 = 'left';
                        continue;
                    }
                    if ((unit.pos[1] - unit.targetpos[1] < -5) && unit.lastMovement.dir2 !== 'up'){
                        //down
                        unit.sprite.pos = [0, 0];
                        unit.pos[1] += distance;
                        unit.lastMovement.dir1 = 'down';
                        if (unit.lastMovement.dir2) continue;
                    }
                    if ((unit.pos[1] - unit.targetpos[1] > 5) && unit.lastMovement.dir2 !== 'down'){
                        //up
                        unit.sprite.pos = [0, 155];
                        unit.pos[1] -= distance;
                        unit.lastMovement.dir1 = 'up';
                        if (unit.lastMovement.dir2) continue;
                    }
                    if ((unit.pos[0] - unit.targetpos[0] < -5) && unit.lastMovement.dir2 !== 'left'){
                        //right
                        unit.sprite.pos = [0, 105];
                        unit.pos[0] += distance;
                        unit.lastMovement.dir1 = 'right';
                        if (unit.lastMovement.dir2) continue;
                    }
                    if ((unit.pos[0] - unit.targetpos[0] > 5) && unit.lastMovement.dir2 !== 'right'){
                        //left
                        unit.sprite.pos = [0, 53];
                        unit.pos[0] -= distance;
                        unit.lastMovement.dir1 = 'left';
                        if (unit.lastMovement.dir2) continue;
                    }
                }



                if (unit.type === 'hero' && player.id !== currentKing){
                    unit.sprite._index += 0.25;
                    switch(detectBuildings(unit, dt)){
                        case 'down':
                        unit.sprite.url = 'img/hero/hero-2.png';
                        unit.pos[1] += distance;
                        unit.lastMovement.dir2 = 'down';
                        continue;

                        case 'up':
                        unit.sprite.url = 'img/hero/hero-0.png';
                        unit.pos[1] -= distance;
                        unit.lastMovement.dir2 = 'up';
                        continue;
                        
                        case 'right':
                        unit.sprite.url = 'img/hero/hero-1.png';
                        unit.pos[0] += distance;
                        unit.lastMovement.dir2 = 'right';
                        continue;
                        
                        case 'left':
                        unit.sprite.url = 'img/hero/hero-3.png';
                        unit.pos[0] -= distance;
                        unit.lastMovement.dir2 = 'left';
                        continue;
                    }

                    if (unit.pos[1] - unit.targetpos[1] < -5 && unit.lastMovement.dir2 !== 'up'){
                        //down
                        unit.sprite.url = 'img/hero/hero-2.png';
                        unit.pos[1] += distance;
                        unit.lastMovement.dir1 = 'down';
                        if (unit.lastMovement.dir2) continue;
                    }
                    if (unit.pos[0] - unit.targetpos[0] < -5 && unit.lastMovement.dir2 !== 'left'){
                        //right
                        unit.sprite.url = 'img/hero/hero-1.png';
                        unit.pos[0] += distance;
                        unit.lastMovement.dir1 = 'right';
                        if (unit.lastMovement.dir2) continue;
                    }
                    if (unit.pos[1] - unit.targetpos[1] > 5 && unit.lastMovement.dir2 !== 'down'){
                        //up
                        unit.sprite.url = 'img/hero/hero-0.png';
                        unit.pos[1] -= distance;
                        unit.lastMovement.dir1 = 'up';
                        if (unit.lastMovement.dir2) continue;
                    }
                    if (unit.pos[0] - unit.targetpos[0] > 5 && unit.lastMovement.dir2 !== 'right'){
                        //left
                        unit.sprite.url = 'img/hero/hero-3.png';
                        unit.pos[0] -= distance;
                        unit.lastMovement.dir1 = 'left';
                        if (unit.lastMovement.dir2) continue;
                    }
                }



                if (unit.type === 'soldier'){

                    unit.sprite._index += 0.25;
                    switch(detectBuildings(unit, dt)){
                        case 'down':
                        unit.pos[1] += distance;
                        unit.lastMovement.dir2 = 'down';
                        continue;

                        case 'up':
                        unit.pos[1] -= distance;
                        unit.lastMovement.dir2 = 'up';
                        continue;
                        
                        case 'right':
                        unit.sprite.pos = [0, 0];
                        unit.pos[0] += distance;
                        unit.lastMovement.dir2 = 'right';
                        continue;
                        
                        case 'left':
                        unit.sprite.pos = [0, 64];
                        unit.pos[0] -= distance;
                        unit.lastMovement.dir2 = 'left';
                        continue;
                    }

                    if (unit.pos[1] - unit.targetpos[1] < -5 && unit.lastMovement.dir2 !== 'up'){
                        //down
                        unit.pos[1] += distance;
                        unit.lastMovement.dir1 = 'down';
                        if (unit.lastMovement.dir2) continue;
                    }
                    if (unit.pos[1] - unit.targetpos[1] > 5 && unit.lastMovement.dir2 !== 'down'){
                        //up
                        unit.pos[1] -= distance;
                        unit.lastMovement.dir1 = 'up';
                        if (unit.lastMovement.dir2) continue;
                    }
                    if (unit.pos[0] - unit.targetpos[0] < -5 && unit.lastMovement.dir2 !== 'left'){
                        //right
                        unit.sprite.pos = [0, 0];
                        unit.pos[0] += distance;
                        unit.lastMovement.dir1 = 'right';
                        if (unit.lastMovement.dir2) continue;
                    }
                    if (unit.pos[0] - unit.targetpos[0] > 5 && unit.lastMovement.dir2 !== 'right'){
                        //left
                        unit.sprite.pos = [0, 64];
                        unit.pos[0] -= distance;
                        unit.lastMovement.dir1 = 'left';
                        if (unit.lastMovement.dir2) continue;
                    }
                }
            }
            else {
                unit.targetpos = undefined;
            }
        }
        unit.lastMovement.dir2 = undefined;
	}
}

function detectBuildings (unit, dt){
    var unitEndX = unit.pos[0] + unit.sprite.size[0];
    var unitEndY = unit.pos[1] + unit.sprite.size[1];
    for (var id in player.buildings){
        var buildingEndX = player.buildings[id].pos[0] + player.buildings[id].sprite.size[0];
        var buildingEndY = player.buildings[id].pos[1] + player.buildings[id].sprite.size[1];
        
        if (inRange(unit.pos[0], unitEndX, player.buildings[id].pos[0], buildingEndX) && inRange(unit.pos[1], unitEndY, player.buildings[id].pos[1], buildingEndY)){
            
            if (unit.lastMovement.dir1 === 'left' || unit.lastMovement.dir1 === 'right'){
                if ((unit.pos[1] + unit.sprite.size[1]/2 - player.buildings[id].pos[1] + 50) > (buildingEndY - unit.pos[1] + unit.sprite.size[1]/2)){
                    return 'down';
                }
                else {
                    return 'up';
                }
            }
            else {
                if ((unit.pos[0] + unit.sprite.size[0]/2 - player.buildings[id].pos[0]) > (buildingEndX -unit.pos[0] + unit.sprite.size[0]/2)){
                    return 'right';
                }
                else {
                    return 'left';
                }
            }
        }
    }
    for (var playerId in otherPlayers){
        for (var id in otherPlayers[playerId].buildings){
            var buildingEndX = otherPlayers[playerId].buildings[id].pos[0] + otherPlayers[playerId].buildings[id].sprite.size[0];
            var buildingEndY = otherPlayers[playerId].buildings[id].pos[1] + otherPlayers[playerId].buildings[id].sprite.size[1];
            
            if (inRange(unit.pos[0], unitEndX, otherPlayers[playerId].buildings[id].pos[0], buildingEndX) && inRange(unit.pos[1], unitEndY, otherPlayers[playerId].buildings[id].pos[1], buildingEndY)){
                
                if (unit.lastMovement.dir1 === 'left' || unit.lastMovement.dir1 === 'right'){
                    if ((unit.pos[1] + unit.sprite.size[1]/2 - otherPlayers[playerId].buildings[id].pos[1] + 50) > (buildingEndY - unit.pos[1] + unit.sprite.size[1]/2)){
                        return 'down';
                    }
                    else {
                        return 'up';
                    }
                }
                else {
                    if ((unit.pos[0] + unit.sprite.size[0]/2 - otherPlayers[playerId].buildings[id].pos[0]) > (buildingEndX -unit.pos[0] + unit.sprite.size[0]/2)){
                        return 'right';
                    }
                    else {
                        return 'left';
                    }
                }
            }       
        }
    }
    return false;
}

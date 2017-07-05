function Map(rows, collumns) {
  this.SIZE = 40;
  this.cooldownPowerup = 1;
  this.powerups = [];
  this.cells = [];
  for (var r = 0; r < rows; r++) {
    this.cells[r] = [];
    for (var c = 0; c < collumns; c++) {
      this.cells[r][c] = 0;
	  this.cells[r][c] = 0;
    }
  }
}



Map.prototype.desenhar = function (ctx) {

	for(var i = 0; i < this.powerups.length; i++) {
		this.powerups[i].desenhaPowerup(ctx);
	}

  for (var r = 0; r < this.cells.length; r++) {
    for (var c = 0; c < this.cells[0].length; c++) {
      if(this.cells[r][c]==1){
        ctx.fillStyle = "red";
        ctx.fillRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
      }
	  else if(this.cells[r][c]==2) {
		ctx.fillStyle = "grey";
        ctx.fillRect(c*this.SIZE, r*this.SIZE, this.SIZE, this.SIZE);
	  }
    }
  }
  
  
};

Map.prototype.setCells = function (newCells) {
  for (var i = 0; i < newCells.length; i++) {
    for (var j = 0; j < newCells[i].length; j++) {
      switch (newCells[i][j]) {
        case 1:
          this.cells[i][j] = 1;
          break;
        case 2:
          this.cells[i][j] = 2;
          break;
        default:
          this.cells[i][j] = 0;
      }
    }
  }
};

// funçao para spawn de powerups em intervalos de tempo
Map.prototype.spawnPowerup = function(dt) {
	this.cooldownPowerup-=dt;
	if(this.cooldownPowerup < 0) {
		var tipo = Math.floor(4+Math.random()*2);
		var gy = 0;
		var gx = 0;
		// busca local possivel
		while(this.cells[gy][gx] != 0 || this.cells[gy][gx] != 2) {
			gy = Math.floor(Math.random()*this.cells.length);
			gx = Math.floor(Math.random()*this.cells[0].length);
		}
		var powerup = new Sprite();
		powerup.x = Math.floor(gx*map.SIZE + map.SIZE/2);
		powerup.y = Math.floor(gy*map.SIZE + map.SIZE/2);
		powerup.gx = gx;
		powerup.gy = gy;
		//gambiarra, teria q usar math.floor em todos as verificaçoes da cell
		// this.cells[gy][gx] += 0.1;
		powerup.tipo = tipo;
		this.powerups.push(powerup);
		this.cooldownPowerup = 1;
	}
}

// Funçao pra spawn um numero fixo de powerups
Map.prototype.spawnPowerupFixo = function(qtd) {
	for(var i = 0; i < qtd; i++) {
		var tipo = Math.floor(4+Math.random()*2);
		var gy = 0;
		var gx = 0;
		// busca local possivel
		while(this.cells[gy][gx] != 0 || this.cells[gy][gx] != 2) {
			gy = Math.floor(Math.random()*this.cells.length);
			gx = Math.floor(Math.random()*this.cells[0].length);
		}
		var powerup = new Sprite();
		powerup.x = Math.floor(gx*map.SIZE + map.SIZE/2);
		powerup.y = Math.floor(gy*map.SIZE + map.SIZE/2);
		powerup.gx = gx;
		powerup.gy = gy;
		//this.cells[gy][gx] += 0.1;
		powerup.tipo = tipo;
		this.powerups.push(powerup);
	}
}



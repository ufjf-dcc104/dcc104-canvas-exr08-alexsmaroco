function Sprite(){
  this.x = 0;
  this.y = 0;
  this.gx = -1;
  this.gy = -1;
  this.vx = 0;
  this.vy = 0;
  this.SIZE = 16;
  this.pose = 0;
  this.frame = 0;
  this.poses = [
    {row: 11, col:1, frames:8, v: 4},
    {row: 10, col:1, frames:8, v: 4},
    {row: 9, col:1, frames:8, v: 4},
    {row: 8, col:1, frames:8, v: 4},
    {row: 11, col:0, frames:1, v: 4},
  ];
  this.images = null;
  this.imgKey = "pc";
  this.cooldown = 1;
  this.bombs = [];
  this.maxBombs = 1;
  this.power = 1;
}

Sprite.prototype.desenhar = function (ctx) {
  this.desenharQuadrado(ctx);
  this.desenharPose(ctx);
  for(var i = 0; i < this.bombs.length; i++) {
	   this.bombs[i].desenharBomba(ctx);
  }
}

Sprite.prototype.desenharQuadrado = function (ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  //ctx.fillRect(-this.SIZE/2, -this.SIZE/2, this.SIZE, this.SIZE);
  ctx.arc(0, 0, this.SIZE/2, 0, 2*Math.PI);
  ctx.fill();
  ctx.closePath;
  ctx.restore();
};

Sprite.prototype.desenharPose = function (ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  this.images.drawFrame(ctx,
    this.imgKey,
    this.poses[this.pose].row,
    Math.floor(this.frame),
    -32,-56, 64
  );
  ctx.restore();
};

Sprite.prototype.desenharBomba = function(ctx) {
	ctx.save();
	ctx.translate(this.x, this.y);
	ctx.beginPath();
	ctx.arc(0, 0, this.w/2, 0, 2*Math.PI);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}


Sprite.prototype.desenhaExplosao = function(x,y) {
		ctx.save();
		ctx.translate(x, y);
		ctx.fillStyle = "black";
		ctx.beginPath();
		ctx.arc(0, 0, 10, 0, 2*Math.PI);
		ctx.fill();
		ctx.closePath();
		ctx.restore();
}

Sprite.prototype.mover = function (map, dt) {
  this.cooldown-=dt;
  /*
	// countdown das bombas
	for (var i = this.bombs.length-1;i>=0; i--) {
		this.bombs[i].timer-=dt;
		if(this.bombs[i].timer < 0) {
			this.bombs[i].explodir(this, map, dt);
			this.bombs.splice(i, 1);
		}
	}
  */
  this.gx = Math.floor(this.x/map.SIZE);
  this.gy = Math.floor(this.y/map.SIZE);
  
  if(this.vx>0 && map.cells[this.gy][this.gx+1]==1 || map.cells[this.gy][this.gx+1]==2 || map.cells[this.gy][this.gx+1]==3){
    this.x += Math.min((this.gx+1)*map.SIZE - (this.x+this.SIZE/2),this.vx*dt);
	
  } else if(this.vx <0 && map.cells[this.gy][this.gx-1]==1 || map.cells[this.gy][this.gx-1]==2 || map.cells[this.gy][this.gx-1]==3){
      this.x += Math.max((this.gx)*map.SIZE - (this.x-this.SIZE/2),this.vx*dt);

	}
  else {
    this.x = this.x + this.vx*dt;
  }
  if(this.vy >0 && map.cells[this.gy+1][this.gx]==1 || map.cells[this.gy+1][this.gx]==2 || map.cells[this.gy+1][this.gx]==3){
    this.y += Math.min((this.gy+1)*map.SIZE - (this.y+this.SIZE/2),this.vy*dt);

  } else if( this.vy<0 && map.cells[this.gy-1][this.gx]==1 || map.cells[this.gy-1][this.gx]==2 || map.cells[this.gy-1][this.gx]==3){
      this.y += Math.max((this.gy)*map.SIZE - (this.y-this.SIZE/2),this.vy*dt);
	}
	
  else {
    this.y = this.y + this.vy*dt;
  }
  this.frame += this.poses[this.pose].v*dt;
  if(this.frame>this.poses[this.pose].frames-1){
    this.frame = 0;
  }
  
};

Sprite.prototype.dropBomb = function(map) {
	if(this.cooldown < 0 && this.bombs.length < this.maxBombs) {
		var bomb = new Sprite();
		// centraliza no grid
		bomb.x = Math.floor(this.x/map.SIZE)*map.SIZE + map.SIZE/2;
		bomb.y = Math.floor(this.y/map.SIZE)*map.SIZE + map.SIZE/2;
		// nao deixa atravessar bombas !! faz personagem bugar e atravessar paredes !!
		//map.cells[Math.floor(this.y/map.SIZE)][Math.floor(this.x/map.SIZE)] = 3;
		bomb.w = 20;
		bomb.h = 20;
		bomb.timer = 2;
		bomb.power = this.power;
		this.bombs.push(bomb);
		this.cooldown = 1;
	}
}

/*
Sprite.prototype.explodir = function(pc, map, dt) {
	console.log(pc);
	var gx = Math.floor(this.x/map.SIZE);
	var gy = Math.floor(this.y/map.SIZE);
	var destruir1 = true;
	var destruir2 = true;
	var destruir3 = true;
	var destruir4 = true;
	
	for(var i = 1; i <= this.power; i++) {
		if(gy-i >= 0) {
			// para de destruir ao encontrar parede
			if(map.cells[gy-i][gx] == 1) {
				destruir1 = false;
			}
			if(destruir1 && map.cells[gy-i][gx] == 2) {
				map.cells[gy-i][gx] = 0;
				destruir1 = false;
			}
			if(destruir1 && pc.gx == gx && pc.gy == gy-i) {
				console.log("atingiu player");
			}
			if(destruir1) {
				this.desenhaExplosao(this.x, (gy-i)*map.SIZE+map.SIZE/2);
			}
		}
		if(gy+i < map.cells.length) {
			// para de destruir ao encontrar parede
			if(map.cells[gy+i][gx] == 1) {
				destruir2 = false;
			}
			if(destruir2 && map.cells[gy+i][gx] == 2) {
				map.cells[gy+i][gx] = 0;
				destruir2 = false;
			}
			if(destruir2 && pc.gx == gx && pc.gy == gy+i) {
				console.log("atingiu player");
			}
			if(destruir2) {
				this.desenhaExplosao(this.x, (gy+i)*map.SIZE+map.SIZE/2);
			}
		}
		if(gx-i >= 0) {
			// para de destruir ao encontrar parede
			if(map.cells[gy][gx-i] == 1) {
				destruir3 = false;
			}
			if(destruir3 && map.cells[gy][gx-i] == 2) {
				map.cells[gy][gx-i] = 0;
				destruir3 = false;
			}
			if(destruir3 && pc.gx == gx-i && pc.gy == gy) {
				console.log("atingiu player");
			}
			if(destruir3) {
				this.desenhaExplosao((gx-i)*map.SIZE+map.SIZE/2, this.y);
			}
		}
		if(gx+i < map.cells[0].length) {
			// para de destruir ao encontrar parede
			if(map.cells[gy][gx+i] == 1) {
				destruir4 = false;
			}
			if(destruir4 && map.cells[gy][gx+i] == 2) {
				map.cells[gy][gx+i] = 0;
				destruir4 = false;
			}
			if(destruir4 && pc.gx == gx+i && pc.gy == gy) {
				console.log("atingiu player");
			}
			if(destruir4) {
				this.desenhaExplosao((gx+i)*map.SIZE+map.SIZE/2, this.y);
			}
		}
	}
}
*/

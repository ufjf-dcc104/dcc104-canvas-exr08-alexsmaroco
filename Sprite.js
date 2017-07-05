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


Sprite.prototype.desenhaExplosao = function(ctx,x,y) {
	ctx.save();
	ctx.translate(x, y);
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.arc(0, 0, 10, 0, 2*Math.PI);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}

Sprite.prototype.desenhaPowerup = function(ctx) {
	ctx.save();
	ctx.translate(this.x, this.y);
	if(this.tipo == 4) {
		ctx.fillStyle = "brown";
	} else if(this.tipo == 5) {
		ctx.fillStyle = "green";
	}
	ctx.beginPath();
	ctx.arc(0, 0, 15, 0, 2*Math.PI);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}

Sprite.prototype.mover = function (map, dt) {
  this.cooldown-=dt;
  this.imunidade-=dt;

  this.gx = Math.floor(this.x/map.SIZE);
  this.gy = Math.floor(this.y/map.SIZE);
  
  // testa se pisou em powerup
  for(var i = map.powerups.length-1; i >= 0; i--) {
	if(this.gy == map.powerups[i].gy && this.gx == map.powerups[i].gx) {
		if(map.powerups[i].tipo == 4) {
			this.power++;
		} else if(map.powerups[i].tipo == 5) {
			this.maxBombs++;
		}
		map.powerups.splice(i,1);
	}
  }
  
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
		this.cooldown = 0.2;
	}
}


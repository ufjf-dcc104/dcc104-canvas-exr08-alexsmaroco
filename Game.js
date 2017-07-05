var canvas;
var ctx;
var map;
var pc1;
var pc2;
var dt;
var images;
var anterior = 0;
var frame = 0;
var fim = false;

function init(){
  canvas = document.getElementsByTagName('canvas')[0];
  canvas.width = 520;
  canvas.height = 460;
  ctx = canvas.getContext("2d");
  images = new ImageLoader();
  images.load("pc","pc.png");
  map = new Map(Math.floor(canvas.height/40), Math.floor(canvas.width/40));
  map.images = images;
  map.setCells([
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,2,2,2,2,2,2,2,2,2,1],
    [1,0,1,2,1,2,1,2,1,2,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,2,1,2,1,2,1,2,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,2,1,2,1,2,1,2,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,2,1,2,1,2,1,2,1,0,1],
    [1,2,2,2,2,2,2,2,2,2,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
  ]);
  map.cooldownPowerup = 5;
  // spawna powerups no map !! problema: pode ter mais de 1 no mesmo lugar
  map.spawnPowerupFixo(10);
  pc1 = new Sprite();
  pc1.id = "1";
  pc1.x = 60;
  pc1.y = 60;
  pc1.vidas = 3;
  pc1.imunidade = 1;
  pc1.images = images;
  pc1.imgkey = "pc";
  pc2 = new Sprite();
  pc2.id = "2";
  pc2.x = 460;
  pc2.y = 380;
  pc2.vidas = 3;
  pc2.imunidade = 1;
  pc2.images = images;
  pc2.imgkey = "pc";
  initControls();
  requestAnimationFrame(passo);
}


function passo(t){
  dt = (t-anterior)/1000;
  requestAnimationFrame(passo);
  ctx.clearRect(0,0, canvas.width, canvas.height);
  if(!this.fim) {
		// countdown das bombas
		for (var i = pc1.bombs.length-1;i>=0; i--) {
			pc1.bombs[i].timer-=dt;
			if(pc1.bombs[i].timer < 0) {
				explodir(pc1.bombs[i], map, dt);
				pc1.bombs.splice(i, 1);
			}
		}
		for (var i = pc2.bombs.length-1;i>=0; i--) {
			pc2.bombs[i].timer-=dt;
			if(pc2.bombs[i].timer < 0) {
				explodir(pc2.bombs[i], map, dt);
				pc2.bombs.splice(i, 1);
			}
		}
		// spawna powerups de tempos em tempos !! pode spawnar mais de um no mesmo lugar
		//map.spawnPowerup(dt);
		pc1.mover(map, dt);
		pc2.mover(map, dt);
		
	}

	map.desenhar(ctx);
	pc1.desenhar(ctx);
	pc2.desenhar(ctx);
    desenhaInfo(ctx);
	anterior = t;
}



function explodir(bomb, map, dt) {
	var gx = Math.floor(bomb.x/map.SIZE);
	var gy = Math.floor(bomb.y/map.SIZE);
	var destruir1 = true;
	var destruir2 = true;
	var destruir3 = true;
	var destruir4 = true;
	var atingiup1 = false;
	var atingiup2 = false;
	
	// tira bomba do grid, se for trata-la como parede
	map.cells[gy][gx] = 0;
	
	// caso fique em cima da bomba
	if(pc1.gx == gx && pc1.gy == gy) {
		atingiup1 = true;
	}
	if(pc2.gx == gx && pc2.gy == gy) {
		atingiup2 = true;
	}
	// verifica os arredores
	for(var i = 1; i <= bomb.power; i++) {
		if(gy-i >= 0) {
			// para de destruir ao encontrar parede
			if(map.cells[gy-i][gx] == 1) {
				destruir1 = false;
			}
			if(destruir1 && map.cells[gy-i][gx] == 2) {
				map.cells[gy-i][gx] = 0;
				destruir1 = false;
			}
			if(destruir1 && pc1.gx == gx && pc1.gy == gy-i) {
				atingiup1 = true;
			}
			if(destruir1 && pc2.gx == gx && pc2.gy == gy-i) {
				atingiup2 = true;
			}
			if(destruir1) {
				bomb.desenhaExplosao(ctx,bomb.x, (gy-i)*map.SIZE+map.SIZE/2);
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
			if(destruir2 && pc1.gx == gx && pc1.gy == gy+i) {
				atingiup1 = true;
			}
			if(destruir2 && pc2.gx == gx && pc2.gy == gy+i) {
				atingiup2 = true;
			}
			if(destruir2) {
				bomb.desenhaExplosao(ctx,bomb.x, (gy+i)*map.SIZE+map.SIZE/2);
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
			if(destruir3 && pc1.gx == gx-i && pc1.gy == gy) {
				atingiup1 = true;
			}
			if(destruir3 && pc2.gx == gx-i && pc2.gy == gy) {
				atingiup2 = true;
			}
			if(destruir3) {
				bomb.desenhaExplosao(ctx,(gx-i)*map.SIZE+map.SIZE/2, bomb.y);
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
			if(destruir4 && pc1.gx == gx+i && pc1.gy == gy) {
				atingiup1 = true;
			}
			if(destruir4 && pc2.gx == gx+i && pc2.gy == gy) {
				atingiup2 = true;
			}
			if(destruir4) {
				bomb.desenhaExplosao(ctx,(gx+i)*map.SIZE+map.SIZE/2, bomb.y);
			}
		}
	}
	
	if(atingiup1 && pc1.imunidade < 0) {
		pc1.vidas--;
		pc1.imunidade = 1;
	}
	if(atingiup2 && pc2.imunidade < 0) {
		pc2.vidas--;
		pc2.imunidade = 1;
	}
}





function desenhaInfo(ctx) {
  ctx.font = "15px Arial";
  ctx.fillStyle = "blue";
  ctx.fillText("Player 1: " + pc1.vidas + " vida(s)       " + "Player 2: " + pc2.vidas + " vida(s)", 100, 455);
  if(pc1.vidas <= 0) {
	ctx.font = "50px Arial";
	ctx.fillStyle = "blue";
	ctx.fillText("Player 2 venceu!", 50, this.canvas.height/2);
    this.fim = true;
  }
  if(pc2.vidas <= 0) {
    ctx.font = "50px Arial";
	ctx.fillStyle = "blue";
	ctx.fillText("Player 1 venceu!", 50, this.canvas.height/2);
    this.fim = true;
  }
}


function initControls(){
  addEventListener('keydown', function(e){
    switch (e.keyCode) {

		// player 1
	  case 32:
		pc1.dropBomb(map);
		break;
	  case 65:
        pc1.vx = -100;
		pc1.vy = 0;
        pc1.pose = 2;
        e.preventDefault();
        break;
      case 87:
        pc1.vy = -100;
		pc1.vx = 0;
        pc1.pose = 3;
        e.preventDefault();
        break;
      case 68:
        pc1.vx = 100;
		pc1.vy = 0;
        pc1.pose = 0;
        e.preventDefault();
        break;
      case 83:
        pc1.vy = 100;
		pc1.vx = 0;
        pc1.pose = 1;
        e.preventDefault();
        break;
	
		// player 2
	  case 13:
		pc2.dropBomb(map);
		break;
      case 37:
		pc2.vx = -100;
		pc2.vy = 0;
        pc2.pose = 2;
        e.preventDefault();
        break;
      case 38:
        pc2.vy = -100;
		pc2.vx = 0;
        pc2.pose = 3;
        e.preventDefault();
        break;
      case 39:
        pc2.vx = 100;
		pc2.vy = 0;
        pc2.pose = 0;
        e.preventDefault();
        break;
      case 40:
        pc2.vy = 100;
		pc2.vx = 0;
        pc2.pose = 1;
        e.preventDefault();
        break;
      default:

    }
  });
  addEventListener('keyup', function(e){
    switch (e.keyCode) {
		//player 1
	  case 65:
        pc1.vx = 0;
        break;
      case 87:
        pc1.vy = 0;
        break;
      case 68:
        pc1.vx = 0;
        break;
      case 83:
        pc1.vy = 0;
        break;
	
		// player 2
      case 37:
		pc2.vx = 0;
        break;
      case 38:
        pc2.vy = 0;
        break;
      case 39:
        pc2.vx = 0;
        break;
      case 40:
        pc2.vy = 0;
        break;
      default:

    }
  });
}

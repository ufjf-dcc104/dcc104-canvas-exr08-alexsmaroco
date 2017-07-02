function Map(rows, collumns) {
  this.SIZE = 40;
  this.cells = [];
  for (var r = 0; r < rows; r++) {
    this.cells[r] = [];
    for (var c = 0; c < collumns; c++) {
      this.cells[r][c] = 0;
    }
  }
}

Map.prototype.desenhar = function (ctx) {
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




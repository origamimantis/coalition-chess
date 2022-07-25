
const pieces = [
  "king",
  "plane",
  "submarine",
  "tank",
  "artillery",
  "engineer",
  "motorcyclist",
  "guard",
  "machinegun"]



const A = 1;
const B = 2;
const C = 3;
const D = 4;
const E = 5;
const F = 6;
const G = 7;
const H = 8;
const I = 9;
const K = 10;


function acolor(x)
{
  function pickHex(color1, color2, weight) {
    var w1 = weight;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)];
    return rgb;
  }
  return "rgb(" + pickHex([255,0,0],[0,0,255],x/10).join() + ")"
}


class Board
{
  constructor()
  {
    this._id = 0
    this.turn = 0;
    this.pieces = {}
    this.initializeBoard();
    this.initializePieces();
  }
  initializeBoard()
  {
    this.grid = []
    for (let i = 0; i < 10; ++i)
    {
      let row = []
      for (let j = 0; j < 10; ++j)
      {
	row.push(null);
      }
      this.grid.push(row);
    }
  }
  getPiece(c1, c2)
  {
    return this.grid[c2-1][c1-1];
  }
  makeMove(start, end)
  {
  }
  print()
  {
    for (let r of this.grid)
    {
      let w = []
      for (let p of r)
      {
	if (p === null)
	  w.push("-")
	else
	  w.push(p.type[0])

      }
      console.log(w.join(" "))
    }
    console.log()
  }
  addPiece(c1, c2, type, color)
  {
    let piece = {
      x: c1-1,
      y: c2-1,
      vx: c1-1,
      vy: c2-1,
      ox: c1-1,
      oy: c2-1,
      dragging: null,
      type: type,
      color: color,
      id: this._id,
    };
    this.pieces[this._id] = piece
    this._id ++
    this.grid[c2-1][c1-1] = piece
  }
  initializePieces()
  {
    this.addPiece(C, 1, "tank", "yellow");
    this.addPiece(D, 1, "motorcyclist", "yellow");
    this.addPiece(E, 1, "king", "yellow");
    this.addPiece(F, 1, "tank", "yellow");
    this.addPiece(G, 1, "engineer", "yellow");
    this.addPiece(H, 1, "artillery", "yellow");

    this.addPiece(C, 2, "machinegun", "yellow");
    this.addPiece(D, 2, "guard", "yellow");
    this.addPiece(E, 2, "guard", "yellow");
    this.addPiece(F, 2, "machinegun", "yellow");
    this.addPiece(G, 2, "guard", "yellow");
    this.addPiece(H, 2, "machinegun", "yellow");


    this.addPiece(C,10, "artillery", "black");
    this.addPiece(D,10, "engineer", "black");
    this.addPiece(E,10, "motorcyclist", "black");
    this.addPiece(F,10, "king", "black");
    this.addPiece(G,10, "artillery", "black");
    this.addPiece(H,10, "tank", "black");

    this.addPiece(C, 9, "machinegun", "black");
    this.addPiece(D, 9, "machinegun", "black");
    this.addPiece(E, 9, "guard", "black");
    this.addPiece(F, 9, "guard", "black");
    this.addPiece(G, 9, "machinegun", "black");
    this.addPiece(H, 9, "machinegun", "black");

    this.addPiece(A, 5, "plane", "red");
    this.addPiece(A, 6, "plane", "red");

    this.addPiece(B, 4, "machinegun", "red");
    this.addPiece(B, 5, "guard", "red");
    this.addPiece(B, 6, "guard", "red");
    this.addPiece(B, 7, "machinegun", "red");

    this.addPiece(K, 5, "submarine", "green");
    this.addPiece(K, 6, "submarine", "green");

    this.addPiece(I, 4, "machinegun", "green");
    this.addPiece(I, 5, "guard", "green");
    this.addPiece(I, 6, "guard", "green");
    this.addPiece(I, 7, "machinegun", "green");




  }

}

module.exports = {
  Board:Board
}

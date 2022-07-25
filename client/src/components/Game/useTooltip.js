import React, {useState, useEffect, useCallback} from 'react';
import {handleRightClick} from "./Control.js"
import {setVar, getVar} from "../../storage.js"
import {clearTooltipLayer, drawMovableLocation, color2angle, rot} from "./Draw"


let to10 = [];
for (let i = 1;  i < 10; ++i)
  to10.push(i)

const bmoves = {

  "pawn": [[0,1], ],//[1,1],[-1,1],[0,2]],
  "bishop": to10.flatMap( (c) => {return [[c,c],[c,-c],[-c,-c],[-c,c]]} ),
  "rook": to10.flatMap( (c) => {return [[c,0],[0,-c],[-c,0],[0,c]]} ),
  "king":[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]],
  "knight":[[1,2],[2,1],[1,-2],[2,-1],[-1,2],[-2,1],[-1,-2],[-2,-1]]
}
bmoves.queen=bmoves.bishop.concat(bmoves.rook)


// TODO probably move this to a more appropriate place
const moves =
  {
    "king":bmoves.king,
    "plane": [ [ 2,4],[ 3,3],[ 4,2],[ 4,0],[ 4,-2],[ 3,-3],[ 2,-4], [0, 4],
               [-2,4],[-3,3],[-4,2],[-4,0],[-4,-2],[-3,-3],[-2,-4], [0,-4],
               [ 1,3],[ 3,1],[ 3,-1],[ 1,-3],
               [-1,3],[-3,1],[-3,-1],[-1,-3],
               [0,2],[1,1],[2,0],[1,-1],[0,-2],[-1,-1],[-2,0],[-1,1]],

    "submarine":bmoves.queen.concat(bmoves.knight),
    "tank":bmoves.queen,
    "artillery":bmoves.rook,
    "engineer":bmoves.knight,
    "motorcyclist":bmoves.bishop,
    "guard":bmoves.pawn,
  }
let mgmoves = new Set()
let pawnadd = []
for (let m of bmoves.king)
  mgmoves.add(JSON.stringify(m))

for (let m of bmoves.pawn)
{
  if (mgmoves.has(JSON.stringify(m)) == false)
    pawnadd.push(m)
}
moves.machinegun = bmoves.king.concat(pawnadd)


//                 piece type, piece coordinate (absolute), board rotation
export function getMovable(p, r)
{
  let unrotated_diff = moves[p.type].slice()
  let movable = []
  let [rx, ry] = rot(p.x,p.y,-r, 0.5)

  for (let [dx,dy] of unrotated_diff)
  {
    let x = rx + dx
    let y = ry + dy
    let [rrx, rry] = rot(x,y,r, 0.5)

    if (rrx >= 0 && rrx < 10 && rry >= 0 && rry < 10)
    {
      movable.push([rrx,rry])
    }
  }
  return movable
}


export const useTooltip = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState()

  setVar("tooltip", false)

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      let piece = handleRightClick(e)
      if (piece === null)
      {
	setVisible(false)
	clearTooltipLayer()
	setVar("tooltip", false)
	return
      }

      let r = color2angle(piece.color)
      let locations = getMovable(piece, r)
      setVar("tooltipMoveLoc", locations)
      clearTooltipLayer()
      drawMovableLocation(locations, piece)

      setType(piece.type);
      setPosition({ x: e.pageX, y: e.pageY });
      setVisible(true);
      setVar("tooltip", true)
    },
    [setVisible, setPosition, setType]
  );

  useEffect(() =>
  {
    document.addEventListener("click", handleContextMenu);

    return () =>
    {
      document.removeEventListener("click", handleContextMenu);
    };
  });
  return { position, visible, type };
};


import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom"
import {getVar, setVar} from "../../storage.js"
import socket from "../../socket.js"
import {player2angle} from "./Draw.js"


import UserList from "./UserList"
import Canvas from "./Canvas"
import Tooltip from "./Tooltip"


import king from "../../assets/king.png"
import plane from "../../assets/plane.png"
import submarine from "../../assets/submarine.png"
import tank from "../../assets/tank.png"
import artillery from "../../assets/artillery.png"
import engineer from "../../assets/engineer.png"
import motorcyclist from "../../assets/motorcyclist.png"
import guard from "../../assets/guard.png"
import machinegun from "../../assets/machinegun.png"

const images = {
  king,
  plane,
  submarine,
  tank,
  artillery,
  engineer,
  motorcyclist,
  guard,
  machinegun
}



function player2angle_snappy(num)
{
  let a = -Math.round(player2angle(num)/Math.PI*2)
  return 90*a + "deg"
}



export default function Game() {

  let nav = useNavigate();

  let room = getVar("room")

  useEffect(()=>
  {
    if (room === undefined)
    {
      nav("/join")
    }
    else
    {
      getVar("updatebar").update()
    }
  }, [])

  
  useEffect(()=>
  {
    function loadImg(val)
    {
      return new Promise((resolve) =>
	{
	  let img = new Image();
	  img.onload = () => {resolve(img);};
	  img.src = val
	})
    }
    async function loadPieceImgs()
    {
      let d = {}
      for (let [fname, val] of Object.entries(images))
      { 
	d[fname] = await loadImg(val)
      }
      return d
    }


    async function initGame()
    {
      getVar("updatebar").update()
      getVar("updatecan").update()

      let d = await loadPieceImgs()
      setVar("imgs", d)

      setVar("held", false)
      setVar("heldPiece", null)
      setVar("prevTime", new Date())
      setVar("lastUpdate", 0)
      setVar("cursors", {})


      let p = await new Promise( resolve =>
      {
	socket.emit("confirmjoin", room, resolve)
      })

      setVar("playernum", p.playernum)

      let r = "rotate(" + player2angle_snappy(getVar("playernum")) + ")"
      document.getElementById("boardImg").style.transform = r

      setVar("inRoom", true)
    }

    initGame()

    return ()=>{}
  }, [])



  return (
    <>
    <p/>
    <div style = {{display: "grid", gridTemplateColumns: "3fr 1fr", gridGap: "20px"}}>
      <Canvas/>
      <UserList/>
    </div>
    <Tooltip/>
    </>
  );

}

import React, {useEffect} from 'react';
import { useNavigate } from "react-router-dom"
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
  return a
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
  })

  
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

      if (getVar("firstLoad") === true)
      {
	let d = await loadPieceImgs()
	setVar("imgs", d)

	setVar("held", false)
	setVar("heldPiece", null)
	setVar("prevTime", new Date())
	setVar("lastUpdate", 0)
	setVar("cursors", {})

	setVar("firstLoad", false)
      }


      let p = await new Promise( resolve =>
      {
	socket.emit("confirmjoin", room, resolve)
      })

      setVar("playernum", p.playernum)

      let r = player2angle_snappy(getVar("playernum"))
      let ro = "rotate(" + 90*r + "deg)"
      document.getElementById("boardImg").style.transform = ro

      let nums=[1,2,3,4,5,6,7,8,9,10]
      let lets="ABCDEFGHIK"

      let transform1
      let transform2
      // numbers on left
      if (r%2 == 0)
      {
	transform1 = nums
	transform2 = lets
      }
      else
      {
	transform1 = lets
	transform2 = nums
      }

      let reg = (i) => {return i}
      let rev = (i) => {return 9-i}

      let order1
      let order2
      // numbers on left
      if (r == 0)
      {
	order1 = rev
	order2 = reg
      }
      else if (r == -1)
      {
	order1 = rev
	order2 = rev
      }
      else if (r == -2)
      {
	order1 = reg
	order2 = rev
      }
      else
      {
	order1 = reg
	order2 = reg
      }

      let gx = getVar("gridsize_px")
      for (let i = 0; i < 10; ++i)
      {
	let l = document.getElementById("bcl"+i)
	l.innerHTML += transform1[i]
	l.style.top = (order1(i) + 0.4)*gx+ "px"
	l.style.left = "0px"
	l.style.marginLeft = "-20px"
	l.style.position = "absolute"
      }
      for (let i = 0; i < 10; ++i)
      {
	let l = document.getElementById("bcl"+(i+10))
	l.innerHTML += transform2[i]
	l.style.top = gx*10 + "px"
	l.style.left = (order2(i)+0.4)*gx + "px"
	l.style.position = "absolute"
      }


     
      let rect = document.getElementsByClassName("contents")[0].getBoundingClientRect();
      setVar("contentx", rect.left)
      setVar("contenty", rect.top)

      setVar("inRoom", true)
    }

    initGame()

    return ()=>{}
  })


  let CoordLabels=()=>
  {
    let arr = []
    for (let i = 0; i < 20; ++i)
    {
      arr.push(<div key={"bcl"+i} id={"bcl" + i}></div>)
    }

    return (<div className="bcl" style={{zIndex:4}}>{arr}</div>);
  }


  return (
    <>
    <p/>
      <CoordLabels/>
      <Canvas/>
      <UserList/>
    <Tooltip/>
    </>
  );

}

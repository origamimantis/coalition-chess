import React, {useRef, useEffect, useState} from "react"
import {getVar, setVar, stateSetter} from "../../storage.js"
import socket from "../../socket.js"
import {drawBoard, drawCursors} from "./Draw.js"

import board from "../../assets/board.png"


socket.on("redraw_board", (pieces) =>
  {
    setVar("pieces", pieces)
    drawBoard()
    drawCursors()
  }
)
socket.on("cursor", (a)=>
  {
    setVar("cursors", a)
  }
)




export default function Canvas() {

  const updateCan = stateSetter(useState(false))
  setVar("updatecan", updateCan)

  const canvasRef = useRef(null)
  useEffect(() =>
  {
    const can = canvasRef.current
    const ctx = can.getContext('2d')
    
    let vh = window.innerHeight;
    let vw = window.innerWidth;
    can.width = Math.floor(vw*0.85)
    can.height = Math.floor(vh*0.85)

    let bi = document.getElementById("boardImg")

    const boardsize_px = Math.min(can.width, can.height)
    const gridsize_px = boardsize_px / 10
    
    bi.style.width = boardsize_px + "px"
    bi.style.height = boardsize_px + "px"

    setVar("can", can)
    setVar("ctx", ctx)
    setVar("boardsize_px", boardsize_px)
    setVar("gridsize_px", gridsize_px)
  })

  return (
    <div id="canvas">
    <img id="boardImg"
	src={board}
	style={{position:"absolute"}}
	draggable={false}
    />
    <canvas ref={canvasRef} style={{position:"absolute", zIndex:1}}/>
    </div>
  )
}

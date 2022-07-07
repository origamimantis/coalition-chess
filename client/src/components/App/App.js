import React, {useEffect, useRef} from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import {getVar, setVar, stateSetter} from "../../storage.js"

import Game from '../Game/Game'
import Join from '../Join/Join'
import Info from '../Info/Info'
import Topbar from '../Topbar/Topbar'


export default function App() {

  let r = useRef(null)
  useEffect(()=>
    {
      let rect = r.current.getBoundingClientRect()
      setVar("contentx", rect.left)
      setVar("contenty", rect.top)
    }
  )

  return (
    <>
    <div id="imgLoading" style={{display:"none"}}>
      <img id="img_king" src="../../assets/king.png"/>
      <img id="img_plane" src="../../assets/plane.png"/>
      <img id="img_submarine" src="../../assets/submarine.png"/>
      <img id="img_tank" src="../../assets/tank.png"/>
      <img id="img_artillery" src="../../assets/artillery.png"/>
      <img id="img_engineer" src="../../assets/engineer.png"/>
      <img id="img_motorcyclist" src="../../assets/motorcyclist.png"/>
      <img id="img_guard" src="../../assets/guard.png"/>
      <img id="img_machinegun" src="../../assets/machinegun.png"/>
    </div>


    <BrowserRouter>
      <Topbar/>
      <div ref={r} className="contents">
      <Routes>
	<Route exact path="/" element={<Navigate replace to="/game"/>} />
	<Route path="/join" element={<Join/>} />
	<Route path="/game" element={<Game/>} />
	<Route path="/info" element={<Info/>} />
      </Routes>
      </div>
    </BrowserRouter>
    </>
  )
}

window.onload = ()=>
{
  setVar("windowLoaded", true)
}

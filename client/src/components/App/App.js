import React, {useEffect, useRef} from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import {getVar, setVar, stateSetter} from "../../storage.js"

import Game from '../Game/Game'
import Join from '../Join/Join'
import Info from '../Info/Info'
import Topbar from '../Topbar/Topbar'


export default function App() {

  setVar("firstLoad", true)
  return (
    <>
    <BrowserRouter>
      <Topbar/>
      <div className="contents">
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

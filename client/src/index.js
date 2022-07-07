import React from 'react'

import { createRoot } from 'react-dom/client'

import "./lib/bootstrap.min.css"

import "./index.css"
import socket from "./socket.js"


import App from './components/App/App.js'

import {handleClick, handleMouseMove} from './components/Game/Control.js'
import {getVar} from './storage.js'


function Rooter()
{
  return (
    <App />
  );
}

const rootElement = document.getElementById("root");

const root = createRoot(rootElement);
root.render(<Rooter callback={() => console.log("renderered")} />);

window.onbeforeunload = function ()
{
  socket.disconnect()
}

window.onclick = handleClick
document.onmousemove = handleMouseMove

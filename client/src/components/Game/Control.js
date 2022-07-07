import {getVar, setVar} from "../../storage.js"
import socket from "../../socket.js"
import {player2angle, rot} from "./Draw"


function relcoords(e, snap = true)
{
  let gs = getVar("gridsize_px")


  let relx = e.pageX - getVar("contentx")
  let rely = e.pageY - getVar("contenty")

  if (snap == true)
  {
    relx = Math.max(gs*0.25, Math.min(relx, getVar("can").width - gs*0.25))
    rely = Math.max(gs*0.25, Math.min(rely, getVar("can").height - gs*0.25))
  }

  return [relx, rely]

}
function clicked(p, x, y)
{
  if (p.dragging == true)
    return [false, 100]

  let i = (x >= p.vx && x < (p.vx+1) && y >= p.vy && y < (p.vy+1))
  let dist = (x - p.vx+0.5)**2 + (y - p.vy+0.5)**2
  return [i, dist]
}
function getPieceAt(rx, ry)
{

  let min = 100
  let argmin = null
  for (let [id, p] of Object.entries(getVar("pieces")))
  {
    let [i, dist] = clicked(p, rx, ry)
    if (i && dist < min)
    {
      min = dist
      argmin = [id, p]
    }
  }
  if (argmin === null)
    return [null,null]
  else
    return argmin
}

function boardcoords(rx,ry)
{
  let gs = getVar("gridsize_px")
  return [rx/gs, ry/gs]
}


export function handleClick(e)
{
  if (getVar("inRoom") !== true)
    return


  let [rx, ry] = relcoords(e)
  let gxy = boardcoords(rx,ry)
  let rgxy = rot(...gxy, -player2angle(getVar("playernum")))
  let [id,p] = getPieceAt(...rgxy)

  if (getVar("held") === true)
  {
    let heldPiece = getVar("heldPiece")
    setVar("held", false)

    if (p !== null && p.x !== null && p.y !== null)
    {
      setVar("held", true)
      setVar("heldPiece", [id,p])
      socket.emit("pickpiece", id, ...rgxy)
    }

    socket.emit("droppiece", ...heldPiece, ...rgxy)
  }
  else // held == false
  {
    if (p !== null)
    {
      setVar("held", true)
      setVar("heldPiece", [id,p])
      socket.emit("pickpiece", id, ...rgxy)
    }
  }
}


const update_time = 50;
  
export function handleMouseMove(e)
{
  if (getVar("mousex") === undefined)
  {
    let [rx, ry] = relcoords(e, false)

    setVar("mousex", rx)
    setVar("mousey", ry)
    return
  }

  if (getVar("inRoom") !== true)
    return

  let [rx, ry] = relcoords(e)
  setVar("mousex", rx)
  setVar("mousey", ry)

  let bc = boardcoords(rx, ry)
  let rbc = rot(...bc, -player2angle(getVar("playernum")))


  let prv = getVar("prevTime")
  let now = new Date()
  let dt = now - prv
  let newclock = getVar("lastUpdate") + dt
  if (newclock > update_time)
  {
    newclock %= update_time

    socket.emit("cursor", ...rbc)
    if (getVar("held") === true)
    {
      socket.emit("dragpiece", getVar("heldPiece")[0], ...rbc)
    }
  }
  setVar("prevTime", now)
  setVar("lastUpdate", newclock)

  

}

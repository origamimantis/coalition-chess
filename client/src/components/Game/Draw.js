import {getVar, setVar} from "../../storage.js"

export function color2angle(color)
{
  let i = 0
  if (color == "black")
    i = 1
  else if (color == "green")
    i = 2
  else if (color == "red")
    i = 3
  return player2angle(i)
}

export function player2angle(num)
{
  // yellow black green red
  if     (num == 0)
    return 0
  else if (num == 1)
    return Math.PI
  else if (num == 2)
    return -Math.PI/2
  else if (num == 3)
    return Math.PI/2
  else
    return 0
}
export function rot(x,y,angle, offset = 0)
{
  //  c s | (x - 5)
  // -s c | (y - 5)
  
  let shift = 5 - offset

  let c = Math.cos(angle)
  let s = Math.sin(angle)

  let nx = c*(x-shift) + s*(y-shift) + shift
  let ny = -s*(x-shift) + c*(y-shift) + shift

  return [nx, ny]
}


function drawpiece(p)
{
  let can = getVar("can")
  let ctx = getVar("ctx")
  let b_px = getVar("boardsize_px")
  let g_px = getVar("gridsize_px")

  let [vx, vy] = rot(p.vx, 9-p.vy, player2angle(getVar("playernum")), 0.5)

  ctx.fillStyle = p.color
  ctx.fillRect((vx+0.1)*g_px, (vy+0.1)*g_px, 0.8*g_px, 0.8*g_px)
  let spr = getVar("imgs")[p.type]
  let w = spr.naturalWidth
  let h = spr.naturalHeight

  let rh = h/125
  let rw = w/125

  let gsh = g_px*rh
  let gsw = g_px*rw

  ctx.drawImage(spr, (vx+0.1)*g_px + 0.4*g_px - 0.4*gsw, (vy + 1 - 0.1 - 0.05)*g_px - 0.8*gsh, 0.8*gsw, 0.8*gsh)
}

export function drawMovableLocation(pl, p)
{
  let can = getVar("can2")
  let ctx = getVar("ctx2")
  let b_px = getVar("boardsize_px")
  let g_px = getVar("gridsize_px")

  ctx.globalAlpha = 0.8

  for (let [x,y] of pl)
  {
  //  ctx.fillRect((x+0.1)*g_px, (y+0.1)*g_px, 0.8*g_px, 0.8*g_px)
    let [vx, vy] = rot(x, 9-y, player2angle(getVar("playernum")), 0.5)
    drawCircle(ctx, (vx+0.5)*g_px, (vy+0.5)*g_px, g_px/6, "purple", p.color, g_px/16)
  }
  //ctx.fillRect(0,0,can.width,can.height)
}

export function clearTooltipLayer()
{
  let can = getVar("can2")
  let ctx = getVar("ctx2")
  ctx.clearRect(0,0,can.width,can.height)
}


export function drawBoard()
{
  if (getVar("inRoom") !== true)
    return

  window.requestAnimationFrame(() =>
  {
    let can = getVar("can")
    let ctx = getVar("ctx")
    let pieces = getVar("pieces")

    let dragged = []

    ctx.clearRect(0,0,can.width,can.height)

    // draw dragged pieces on top
    for (let piece of Object.values(pieces))
    {
      if (piece.dragging === null)
	drawpiece(piece)
      else
	dragged.push(piece)
    }
    for (let piece of dragged)
    {
      drawpiece(piece)
    }
  })
}


function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
  if (fill) {
    ctx.fillStyle = fill
    ctx.fill()
  }
  if (stroke) {
    ctx.lineWidth = strokeWidth
    ctx.strokeStyle = stroke
    ctx.stroke()
  }
}


function drawCursor(ctx, id, x, y)
{
  let g_px = getVar("gridsize_px")
  const cursor_size = g_px/8
  let color = ["yellow","black","green","red"][id] || "white"
  drawCircle(ctx, x*g_px, y*g_px, cursor_size, color, "white", cursor_size/4)
}
export function drawCursors()
{
  if (getVar("inRoom") !== true)
    return

  let c = getVar("cursors")
  if (c === undefined)
    return

  window.requestAnimationFrame(() =>
  {
    let ctx = getVar("ctx")
    for (let [id, xy] of Object.entries(c))
    {
      if (id == getVar("playernum"))
	continue
      let rxy = [xy[0], 10-xy[1]]
      let vxy = rot(...rxy, player2angle(getVar("playernum")))

      drawCursor(ctx, id, ...vxy)
    }
  })
}

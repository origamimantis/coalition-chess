const express = require("express");
const bodyParser = require('body-parser')
//const cors = require('cors');
const path = require('path');
const { Client } = require('pg');

const app = express();
let port = process.env.PORT || 2354;

const http = require('http');
const server = http.createServer(app)

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}


const { Server } = require("socket.io");
let cors = {
  origins: ["http://foonkychess.herokuapp.com", "https://origamimantis.github.io"],
  methods: ["GET", "POST"],
  credentials: true};

const io = new Server(server, {cors:cors})
server.listen(port, ()=>{console.log("bubba")})

console.log("port:",port)

app.use(express.static(path.resolve(__dirname, 'client/build')));
app.use(bodyParser.json());



let users = {}
let rooms = {};

// room = {board: Board, users: [], otherinfo: ...}


const b = require("./src/board.js");
const c = require("./src/constants.js");
class Room
{
  constructor(id)
  {
    this.board = new b.Board();
    this.users = []
    this.moves = []
    this.id = id;
  }
  getUserByName(name)
  {
    for (let o of this.users)
    {
      if (o.name == name)
        return o;
    }
    return null;
  }
  addUser(obj)
  {
    this.users.push(obj);
  }
  delUserName(name)
  {
    for (let i = 0; i < this.users.length; ++i)
    {
      if (this.users[i].name == name)
      {
	this.users.splice(i, 1);
        return;
      }
    }
  }
  delUser(socket)
  {
    for (let i = 0; i < this.users.length; ++i)
    {
      if (this.users[i].socket == socket)
      {
	this.users[i].socket = null;
        return;
      }
    }
  }
  numUsers()
  {
    return this.users.length;
  }
  getUserInfo()
  {
    let a = [];
    for (let u of this.users)
    {
      if (u.socket !== null)
        a.push({name:u.name, team:u.team});
    }
    return a;
  }
  isEmpty()
  {
    for (let o of this.users)
    {
      if (o.socket !== null)
        return false;
    }
    return true;
  }
}



function addSocket(id, name, socket)
{
  if (rooms[id] == undefined)
    rooms[id] = new Room(id);

  let l = rooms[id].users.length;
  let team = c.SPECTATING;
  if (l == 0)       team = c.WHITE;
  else if (l == 1)  team = c.BLACK;

  rooms[id].addUser({name:name, team:team, socket:socket})

  socket.currentRoom = id;
}

function removeSocket(socket)
{
  let room = rooms[socket.currentRoom];
  if (room !== undefined)
    room.delUser(socket);
}

function userlist(id)
{
  let room = rooms[id];
  if (room === undefined)
    return

  let info = room.getUserInfo();
  let a = []
  for (let u of rooms[id].users)
  {
    if (u.socket !== null)
    {
      a.push(u.socket)
    }
  }
  return a
}


function users_update(id)
{
  let room = rooms[id];
  if (room === undefined)
    return

  let info = room.getUserInfo();
  let i = 0;
  for (let u of rooms[id].users)
  {
    if (u.socket !== null)
    {
      u.socket.emit('users_update', {info: info, i: i });
      ++ i;
    }
  }
}

io.on("connection", (socket)=>
{
  socket.on('test',(data)=> {
    console.log("received form value {" + data + "}");
  });

  socket.on('pair',(roomname, username, res)=> {
    console.log("pairing", roomname, username)

    if (roomname == "")
    {
      res({result:false, message:"Room name cannot be empty"})
      return
    }
    else if (username == "")
    {
      res({result:false, message:"User name cannot be empty"})
      return
    }

    let room = rooms[roomname]


    let collision;
    if (room === undefined)
      collision = null;
    else
      collision = room.getUserByName(username);

    if (collision !== null && collision.socket !== null)
    {
      res({result:false, message:"Someone with that name is already in that room"})
      return
    }

    if (room !== undefined)
      room.delUserName(username)

    addSocket(roomname, username, socket);

    socket.xy = [0,0]

    // reconnect
    //else if (collision.socket === null)
    //  collision.socket = socket;

    res({result:true, message:""})

  });

  socket.on('confirmjoin',(roomname, res)=> {
    // tell everyone in the room about the new person
    if (rooms[roomname] === undefined)
      return

    users_update(roomname);

    let ul = userlist(socket.currentRoom)
    let i = ul.indexOf(socket)
    res({playernum:i})

  });

  socket.on('cursor',(x,y)=> {
    socket.xy = [x,y]
  })

  socket.on('pickpiece',(pieceid, x,y, o)=> {
    if (rooms[socket.currentRoom] == undefined)
      return
    let b = rooms[socket.currentRoom].board
    let p = b.pieces[pieceid]
    p.vx = x - 0.5
    p.vy = y - 0.5
    p.dragging = true

    if (p.y !== null && p.x !== null)
      b.grid[p.y][p.x] = null

  });

  socket.on('dragpiece',(pieceid, x,y, o)=> {
    if (rooms[socket.currentRoom] == undefined)
      return
    let b = rooms[socket.currentRoom].board
    let p = b.pieces[pieceid]
    p.vx = x - 0.5
    p.vy = y - 0.5
  });
  socket.on('droppiece',(pieceid, piece, x,y, o)=> {
    if (rooms[socket.currentRoom] == undefined)
      return
    let b = rooms[socket.currentRoom].board
    let vx = x - 0.5
    let vy = y - 0.5
    let tx = Math.round(vx)
    let ty = Math.round(vy)
    if (tx >= 0 && tx < 10 && ty >= 0 && ty < 10)
    {
      vx = tx
      vy = ty
    }
    else
    {
      // keep the pieces off the board
      let border = 0.1
      if (tx < 0)
	vx = Math.min(vx, -border)
      else if (tx >= 10)
	vx = Math.max(vx, 10+border)

      if (ty < 0)
	vy = Math.min(vy, -border)
      else if (ty >= 10)
	vy = Math.max(vy, 10+border)

      tx = null
      ty = null
    }
    let p = b.pieces[pieceid]
    p.x = tx
    p.y = ty
    p.vx = vx
    p.vy = vy
    p.dragging = false
    if (tx !== null)
      b.grid[ty][tx] = piece
  });


  socket.on('disconnect',()=> {
    console.log("xd")
    let a = rooms[socket.currentRoom]
    removeSocket(socket);
    users_update(socket.currentRoom);
  });
  socket.on('debug',(...stuff)=> {
    console.log(...stuff);
  });
  socket.on('yo',()=> {
    console.log("wf")
  });

  setInterval(()=>{
    if (socket.currentRoom !== undefined)
    {
      socket.emit("redraw_board", rooms[socket.currentRoom].board.pieces)

      let a = {}
      let i = 0
      for (let u of rooms[socket.currentRoom].users)
      {
	if (u.socket === null)
	  continue
	else if (u.socket == socket)
	{
	  i += 1
	  continue
	}
	a[i] = u.socket.xy
	i += 1
      }
      socket.emit("cursor", a)
    }

  }, 50)

});


// every 5 minutes, check for empty rooms and delete them
setInterval(()=>{
  let i = false;
  for (let id of Object.keys(rooms))
  {
    if (rooms[id].users.length == 0)
    {
      i = true;
      delete rooms[id];
    }
  }
}, 300000);

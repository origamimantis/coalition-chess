import React, { useState } from 'react';
import { useNavigate,Link } from "react-router-dom"
import socket from "../../socket.js"
import {getVar, setVar} from "../../storage.js"

export function connectUser(roomname, username)
{
  let res = new Promise( resolve =>
    {
      socket.emit("pair", roomname, username, resolve)
  })
  return res
}

export default function Join()
{
  const [roomname, setRoomname] = useState("");
  const [username, setUsername] = useState("");

  const [err, setErr] = useState("")

  setVar("inRoom", false)

  let nav = useNavigate()
  const handleSubmit = async (e) => 
    {
      e.preventDefault();

      if (err.length > 0)
	setErr("")

      const result = await connectUser(roomname,username);

      if (result.result === true)
      {
	setVar("room", roomname)
	setVar("name", username)
	nav("/game")
      }
      else
      {
	setErr(result.message)
      }
    }

  return(
    <>
    <p/>
    <div className="login-wrapper">
      <h3>Join a game</h3>
      <form onSubmit = {handleSubmit}>
      Room
      <p/>  
      <input type="text"     onChange={e => setRoomname(e.target.value)}/>
	  
      <p/>
      Username
      <p/>
      <input type="text"     onChange={e => setUsername(e.target.value)}/>
      <p>{err}</p>
      <button type="submit">Gogo</button>
      </form>
    </div>
    </>
  )
}


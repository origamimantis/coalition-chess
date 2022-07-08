import React, {useState} from 'react';
import socket from "../../socket.js"
import {getVar, setVar, stateSetter} from "../../storage.js"

let userslist = []

socket.on("users_update", (info) =>
  {
    userslist = info.info
    let update = getVar("userlistupdate")
    if (update !== undefined)
      update.update()
  }
)


export default function UserList() {


  let room = getVar("room")
  let name = getVar("name")

  let causeUpdate = stateSetter(useState(false))
  setVar("userlistupdate", causeUpdate)

  let ListComp=()=>
  {
    let arr = []
    userslist.forEach( (o, i)=>
      {
        arr.push(<li key={i}> {o.name}</li>)
      }
    );

    return (<ol>{arr}</ol>);
  }


  return (
    <div id="userlist" style={{position:"absolute", left:"70vw"}}>
      <h3>Room: {room}</h3>
      <h3>{name}</h3>
      <b>Current players</b>
      <ListComp/>
    </div>
  );

}

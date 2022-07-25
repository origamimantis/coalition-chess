import React, {useState, useEffect, useCallback} from 'react';
import {Link} from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom"
import {getVar, setVar} from "../../storage.js"
import socket from "../../socket.js"
import {useTooltip} from "./useTooltip.js"

const tooltips = 
  {
    "king":"The King moves and captures as in chess and also has the same importance.",
    "plane":"The Plane may take two successive moves by the Knight, but it cannot end on its starting position.",
    "submarine":"The Submarine is permitted to move in the same way as the Queen and Knight.",
    "tank":"The Tank corresponds to the Queen.",
    "artillery":"The Artillery corresponds to the Rook.",
    "engineer":"The Engineer corresponds to the Knight.",
    "motorcyclist":"The Motorcyclist corresponds to the Bishop.",
    "guard":"The Guard corresponds to the Pawn.",
    "machinegun":"The Machine-gun has the same rights as the King and Pawn, but can be captured without the player losing the game. It can also move forward two squares from its starting position and can move one square in all directions to capture other pieces."

  }

export default function Tooltip() {

  const { position, visible, type } = useTooltip();
  const ss = {
            top: "60vh",
            left: "70vw",
	    position:"absolute",
	    zIndex:2,
	    padding:"2vw",
	    width: "29vw",
	    wordBreak: "normal",
	    overflowWrap: "break-word",
	    display: "inline-block",
          }

  if (visible)
    return (
      <>
        <div className="tooltip-piece" style={ss} >

	  <span>
	  <img id="ttimg" align="left" src={getVar("imgs")[type].src}></img>

      </span>
	  <span>

      {tooltips[type]}
      </span>
	</div>
      </>
      ) 
  else
    return (
        <div className="tooltip-piece" style={ss} >
	  Click on a piece for more information
        </div>
      ) 
}

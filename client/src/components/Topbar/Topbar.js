import React, {useState} from 'react'
import {Link} from "react-router-dom";
import {Navbar,Nav} from "react-bootstrap";
import {getVar, setVar, stateSetter} from "../../storage.js"


import logo from "../../logo.png"


export default function Topbar() {

  const updateBar = stateSetter(useState(false))
  setVar("updatebar", updateBar)

  return (
    <div className = "topbar">
      <Navbar className="topbar-color" style={{fontSize: "24px"}}>
	  <Navbar.Brand style={{marginLeft : "1%", fontSize: "32px"}} as={Link} to="/Game">
	    <img
		  alt=""
		  src={logo}
		  width="48"
		  height="48"
		  className="align-left align-top"
		/>{' '}
	    Coalition Chess</Navbar.Brand>
	    <Nav style={{marginTop:"4px"}} className="topbarLinks ml-auto">
    {(() =>{
      if (getVar("room") === undefined)
        return <> 
	      <Nav.Link as={Link} to="/join">Join</Nav.Link>
	      </>
      else
	return <>
	      <Nav.Link as={Link} to="/game">Game</Nav.Link>
	      <Nav.Link as={Link} to="/join">Change</Nav.Link>
	      </>
    })()}
	    </Nav>
	    <Nav style={{marginTop:"4px",marginRight : "1%"}} className="topbarLinks ms-auto">

	      <Nav.Link as={Link} to="/info">About</Nav.Link>
	    </Nav>

      </Navbar>
    </div>
  );
}

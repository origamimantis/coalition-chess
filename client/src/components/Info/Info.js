import React, {useState} from 'react';
import {Link} from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom"

export default function Info(){

  const {username} = useParams();

  return (
    <>
    <p/>
    <h3>Schoenberg moment</h3>
    <a href="https://www.schoenberg.at/index.php/en/schoenberg-2/illuminating-as/coaltion-chess" target="_blank">
    Some website which looks kinda official
    </a>
    </>
  );

}

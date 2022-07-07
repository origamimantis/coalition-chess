import React, {useState, useEffect, useCallback} from 'react';
import {handleRightClick} from "./Control.js"
import {setVar, getVar} from "../../storage.js"


export const useTooltip = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState()

  setVar("tooltip", false)

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      let piece = handleRightClick(e)
      if (piece === null)
	return

      setType(piece);
      setPosition({ x: e.pageX, y: e.pageY });
      setVisible(true);
      setVar("tooltip", true)
    },
    [setVisible, setPosition, setType]
  );

  const handleClick = useCallback(() => 
  {
    if (visible)
    {
      setVisible(false)
      setVar("tooltip", false)
    }
  }
  , [visible]);

  useEffect(() =>
  {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);

    return () =>
    {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });
  return { position, visible, type };
};


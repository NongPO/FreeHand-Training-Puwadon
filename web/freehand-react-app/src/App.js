import React, { useRef, useEffect } from "react";


import { Drawing }from "./Drawing";
 


function App() {
  const drawRef = useRef();

  const ws = new WebSocket("ws://localhost:8899");
  ws.onopen = (event) => {
    ws.send("Hey!!!!");
    console.log("WebSocket connected!");
  };

  ws.onmessage = function (event) {
  
    try {
      const json = JSON.parse(event.data);
      console.log(json);

      if(drawRef.current!== null)
      {
        if(json.keypoint==="Write")
        {
          switch(json.point_history)
          {
            case "Stop":
              drawRef.current.stopDraw();
                break;
            default:
              if(drawRef.current.IsDrawMode()===false)
              {

                drawRef.current.startDraw(json.finger[0],json.finger[1] );
              }else{
                drawRef.current.draw(json.finger[0],json.finger[1] );
              }
              break;
          }
        }

        if(json.keypoint==="Clear")
        {
          drawRef.current.clear();
        }
      }

    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {

  }, []);

  console.log("im being rendered");

  return <Drawing  ref={drawRef}/>;

}

export default App;

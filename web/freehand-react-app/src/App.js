import React, { useRef, useEffect,  useCallback } from "react";

import { DrawingCanvas } from "./Drawing"

 


function App() {

  const wsRef = useRef(null);
  const canvasRef = useRef(null);
  const drawingCanvasRef = useRef(null);

  const handleResize = useCallback( (e) => {
    if(drawingCanvasRef.current!== null)
    {
      drawingCanvasRef.current.handleResize( window.innerWidth-2, window.innerHeight-2);
    }

  },[drawingCanvasRef]);

  if(wsRef.current === null)
  {
    wsRef.current = new WebSocket("ws://localhost:8899/");
    wsRef.current.onopen = () => {
      wsRef.current.send("Hey!!!!");
      console.log("WebSocket connected!");
    };

    wsRef.current.onerror = (e) =>{
      console.log(e);
    };

    wsRef.current.onmessage = (e)=>{
      if(drawingCanvasRef.current!==null)
      {
        drawingCanvasRef.current.onWebsocketMessage(e);
      }
    };

    wsRef.current.onclose = ()=>{
      console.log("WebSocket closed!");
    };
    
  }



  useEffect(() => {

    if(canvasRef.current !== null)
    {
      //check canvas has getContext
      if (canvasRef.current.getContext) {
        if(drawingCanvasRef.current === null)
        {
          // init DrawingCanvas class
          drawingCanvasRef.current = new DrawingCanvas( canvasRef.current,
            {
              // options args
              isMouseDebug: true,
              enableMovingAverage: true,
              movingAveragePoint: 5,
              lineCap: 'round',
              strokeStyle: 'blue',
              lineWidth: 4,

            });

          drawingCanvasRef.current.init();
        }
      }

    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      
      window.removeEventListener("resize", handleResize);
    }

  }, [
    handleResize,
    canvasRef,
    drawingCanvasRef,

  ]);

  console.log("im being rendered");

  return ( 

  <canvas className="canvas"  ref={canvasRef}  />

  )
  ;

}

export default App;

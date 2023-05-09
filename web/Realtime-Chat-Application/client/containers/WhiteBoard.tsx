import { useEffect, useRef, useCallback } from "react";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";
import styles from "../styles/WhiteBoard.module.css";
import DrawingCanvas from "../components/DrawingCanvas";


function  WhiteBoardContainer() {
    const {socket} = useSockets();
    const canvasRef = useRef(null);
    const drawingCanvasRef = useRef(null);
    const containerRef = useRef(null);


    const handleResize = useCallback(() => {
        if(drawingCanvasRef.current!== null && containerRef.current!==null)
        {
            console.log(containerRef.current)
            drawingCanvasRef.current.handleResize(containerRef.current.offsetHeight-2, containerRef.current.offsetWidth-2);
        }
    
      },[drawingCanvasRef]);


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
                  isMouseDebug: false,
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

        socket.on(EVENTS.SERVER.WHITE_BOARD, (e) => {
            drawingCanvasRef.current?.onMessage(e);
        });

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
          }
    }, 
    [
        canvasRef,
        drawingCanvasRef,
        socket,
        handleResize
    ]);


    return (
    <div className={styles.wrapper} ref={containerRef}>
        <canvas className={styles.canvas}  ref={canvasRef}  />
    </div>

    )

}


export default WhiteBoardContainer;
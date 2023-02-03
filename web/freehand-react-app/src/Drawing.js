import { useEffect, useRef, useState,  forwardRef, useImperativeHandle,  } from 'react';


export const Drawing = forwardRef((props, ref) => {

  const [drawing, setDrawing] = useState(false);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [cmdDrawing, setCmdDrawing] = useState(false);


  const startDraw = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setDrawing(true);
  };
  
  const stopDraw = () => {
    ctxRef.current.closePath();
    setDrawing(false);
  };
  
  const draw = ({ nativeEvent }) => {
    if (!drawing) return;
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };
  
  const clear = () => {
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };


  // Import, state and ref events

useEffect(() => {
    const canvas = canvasRef.current;
    // For supporting computers with higher screen densities, we double the screen density

    // Setting the context to enable us draw
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 20;
    ctxRef.current = ctx;

    const handleResize = e => {
      ctx.canvas.height = window.innerHeight-2;
      ctx.canvas.width = window.innerWidth-2;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);

  }, []);
  
  // Drawing functionalities

  useImperativeHandle(ref, () => ({

    startDraw(x,y){
       
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(x, y);
      setCmdDrawing(true);
    },
    stopDraw(){
      ctxRef.current.closePath();
      setCmdDrawing(false);
    },
    draw(x,y)
    {
      if (!cmdDrawing) return;
  
      ctxRef.current.lineTo(x, y);
      ctxRef.current.stroke();
    },
    clear()
    {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    },
    IsDrawMode()
    {
      return cmdDrawing;
    }


  }));


  return (
    <>
      <canvas className="canvas"
        onMouseDown={startDraw}
        onMouseUp={stopDraw}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </>
  );

});



 
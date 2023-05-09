import { simpleMovingAverage } from "./MovingAverage";


function ellipse(context, p, rx, ry, isFill = false) {
  context.save(); // save state
  context.beginPath();

  //context.translate(cx - rx, cy - ry);
  context.translate(p.x, p.y);

  context.scale(rx, ry);
  context.arc(1, 1, 1, 0, 2 * Math.PI, false);

  context.restore(); // restore to original state
  context.stroke();

  if(isFill===true)
    context.fill();
}

class CanvasObject {

  constructor(engine, x, y) {
    this.engine = engine;
    this.pos = { x: x, y: y };
    this.points = [];
    this.points.push({x:x,y:y});

  }

  addPos(x_pos, y_pos)
  {
    
    this.points.push({x:x_pos,y:y_pos});

  }

  draw(ctx)
  {
    ctx.beginPath();

    if( this.engine.enableMovingAverage===true )
    {
      let bufferX = this.points.map(pos => pos.x);
      let bufferY = this.points.map(pos => pos.y);

      let smaX = simpleMovingAverage(bufferX,5);
      let smaY = simpleMovingAverage(bufferY,5);
      if(smaX.length > 2 && smaY.length > 2)
      {
        ctx.moveTo(smaX[0], smaY[0]);
        for (let i = 1; i < smaX.length; i++) {
          ctx.lineTo(smaX[i], smaY[i]);
        }
      }


    }else{
      ctx.moveTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }
    }
 



    ctx.stroke();


  }

}


export class DrawingCanvas {

  constructor(canvas, options) {

      // Get a reference to the canvas
      this.canvas = canvas; //document.getElementById(canvas);

      this.isMouseDebug = options.isMouseDebug || false;
      this.enableMovingAverage = options.enableMovingAverage || false;
      this.movingAveragePoint = options.movingAveragePoint || 5;
      this.lineCap = options.lineCap || 'round';
      this.strokeStyle = options.strokeStyle|| 'blue';
      this.lineWidth = options.lineWidth || 2;
  


      this.context = this.canvas.getContext("2d");

      if(this.isMouseDebug===true)
      {
        this.canvas.addEventListener("mousedown", (e) => this.onMouseDown(e));
        this.canvas.addEventListener("mousemove", (e) => this.onMouseMove(e));
        this.canvas.addEventListener("mouseup", (e) => this.onMouseUp(e));
        this.canvas.addEventListener("dblclick", (e) => this.onMouseDoubleClick(e));
      }
      

 
      this.isDrawing = false;
      this.smaBufferX = [];
      this.smaBufferY = [];

      this.secondsPassed = 0.0;
      this.oldTimeStamp = 0.0;

      this.isExit = false;
      this.animationFrame = null;

      this.canvasObjects = [];

      this.cavasObject = null;
      this.cursorPos = null;
      this.isFillCursor = false;


  }

  init() {




    console.log("DrawingCanvas initialized.");

    this.gameLoop(0);
    

  }

  gameLoop(timeStamp) 
  {

    try
    {
      // Update game objects in the loop
      // Calculate how much time has passed
      this.secondsPassed = (timeStamp - this.oldTimeStamp) / 1000;
      if (this.secondsPassed > 0.0) {
        // Calculate fps
        // let fps = Math.round(1 / this.secondsPassed);
        // console.log(fps);
        // Pass the time to the update
        this.update(this.secondsPassed);

        this.oldTimeStamp = timeStamp;
      }

      this.render();

    }catch(err)
    {
      console.log(err);
    }


    if (!this.isExit) {
        this.animationFrame = window.requestAnimationFrame((t) => {
        this.gameLoop(t);
      });
    }

  }

  exit() 
  {
    console.log("Exit canvas");
    this.isExit = true;

    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  update(dt)
  {

  }

  render()
  {
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();


    this.context.save();

    this.context.lineCap = this.lineCap;
    this.context.strokeStyle = this.strokeStyle;
    this.context.lineWidth = this.lineWidth;

    for (let i = this.canvasObjects.length - 1; i >= 0; --i) 
    {
      this.canvasObjects[i].draw(this.context);
    }

    if(this.cavasObject!== null)
    {
      this.cavasObject.draw(this.context);
    }

    if(this.cursorPos!== null)
    {
      this.context.strokeStyle = 'green';
      this.context.lineWidth = 2;
      ellipse(this.context,{x:this.cursorPos.x-5,y:this.cursorPos.y-5 } , 10, 10, this.isFillCursor);
    }

    this.context.restore();

  }

  startDraw(x,y)
  {

    if(this.cavasObject!== null)
    {
      this.stopDraw();
    }else{
      this.cavasObject = new CanvasObject(this, x,y);
    }
  }

  drawLineTo(x,y)
  {
    if(this.cavasObject!== null)
    {
      this.cavasObject.addPos(x,y);
    }
  }

  stopDraw()
  {
    if(this.cavasObject !== null)
    {
      this.canvasObjects.push(this.cavasObject);
      this.cavasObject = null;
    }

  }

  clear()
  {
    this.canvasObjects = [];
    this.cavasObject = null;
  }

  onMouseDown(event)
  {
    const { offsetX, offsetY } = event;
    this.startDraw(offsetX,offsetY);

  }

  onMouseMove(event)
  {
    const { offsetX, offsetY } = event;
    this.drawLineTo(offsetX, offsetY);
  }

  onMouseUp(event)
  {
   this.stopDraw();
  }

  onMouseDoubleClick(event)
  {
   this.clear();
  }

  handleResize(width, height)
  {
    this.context.canvas.width = width;
    this.context.canvas.height = height;

   // console.log(this.context);
  }

 

  onWebsocketMessage(event)
  {
    try
    {
      const json = JSON.parse(event.data);
      //console.log(json);
      console.log(json.keypoint);
      
      let x_pos = json.finger[0];
      let y_pos = json.finger[1];

      this.cursorPos = { x:x_pos, y:y_pos };

      switch(json.keypoint)
      {
        case "Write":
          this.isFillCursor = true;
          if(this.cavasObject!== null)
          {
            this.drawLineTo(x_pos, y_pos);
          }else{
            this.startDraw(x_pos, y_pos);

          }
          break;
        case "Stop write":
          this.stopDraw();
          this.isFillCursor = false;
          break;
        case "Save":
          this.isFillCursor = false;

          break;
        case "Clear":
          
          this.clear();
          this.isFillCursor = false;

          break;
          default:
            this.isFillCursor = false;
            break;
      }

    }catch(err)
    {
      console.log(err);
    }
  }

}
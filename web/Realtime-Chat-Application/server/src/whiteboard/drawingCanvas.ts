import { Socket } from "socket.io";
import EVENTS from "../../config/events";
import { saveWhiteBoard } from "./db";

class Point {
    x: number;
    y: number;
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
}

class CanvasObject {
    engine : DrawingCanvas;
    pos: Point;
    points:Point[];

    constructor(engine:DrawingCanvas, x: number, y: number) {
        this.engine = engine;
        this.pos = new Point(x,y);
        this.points = [];
        this.points.push({x:x,y:y});
    }

    addPos(x_pos: number, y_pos: number)
    {
      this.points.push({x:x_pos,y:y_pos});
    }

    save()
    {
      let pts:Point[] = [];

      this.points.forEach((item, i) => {
        pts.push(Object.assign({}, item));
      });

      return {
        type: "CanvasObject",
        points: pts
      };
    }
   
}



class DrawingCanvas {

    isDrawing: boolean;
    smaBufferX: number[];
    smaBufferY: number[];
    canvasObjects:CanvasObject[];
    cavasObject:CanvasObject | null;
    cursorPos:Point | null;
    isFillCursor:boolean;
    isSaving: boolean;

    constructor() {
        this.isDrawing = false;
        this.smaBufferX = [];
        this.smaBufferY = [];
  
        this.canvasObjects = [];
  
        this.cavasObject = null;
        this.cursorPos = null;
        this.isFillCursor = false;
        this.isSaving = false;
    }

    startDraw(x: number,y: number,{socket,roomId, username}: {socket: Socket,roomId:any,username:any})
    {
  
      if(this.cavasObject!== null)
      {
        this.stopDraw({socket,roomId,username});
      }else{
        this.cavasObject = new CanvasObject(this, x, y);
        //pub new cavasObject
        let message = this.cavasObject.points;
        let fill = this.isFillCursor;
        socket.to(roomId).emit(EVENTS.SERVER.WHITE_BOARD, {
          message,
          username,
          cmd: "NEW_LINE",
          fill:fill,
          cursor: this.cursorPos,
        });
      }
    }
  
    drawLineTo( point : Point,{socket,roomId, username}: {socket: Socket,roomId:any,username:any})
    {
      if(this.cavasObject!== null)
      {
        this.cavasObject.addPos(point.x, point.y);
        //pub Point
        let message =  point;
        let fill = this.isFillCursor;

        socket.to(roomId).emit(EVENTS.SERVER.WHITE_BOARD, {
          message,
          username,
          cmd: "NEW_POINT",
          fill:fill,
          cursor: this.cursorPos,
        });
      }
    }
  
    stopDraw({socket,roomId, username}: {socket: Socket,roomId:any,username:any})
    {
      if(this.cavasObject !== null)
      {
        this.canvasObjects.push(this.cavasObject);
        //pub cavasObject
        let message = this.cavasObject.points;
        let fill = this.isFillCursor;

        socket.to(roomId).emit(EVENTS.SERVER.WHITE_BOARD, {
          message,
          username,
          cmd: "END_LINE",
          fill:fill,
          cursor: this.cursorPos,
        });
        this.cavasObject = null;
      }
  
    }

    sendWhiteBoard({socket,roomId, username}: {socket: Socket,roomId:any,username:any})
    {
      let message :Point[][] = [];

      for (let i = 0; i<this.canvasObjects.length; i ++) 
      {
        for(let j =0;j<this.canvasObjects[i].points.length;j++)
        {
          message[i].push(this.canvasObjects[i].points[j]);
        }
        
      }

      let fill = this.isFillCursor;
      
      socket.to(roomId).emit(EVENTS.SERVER.WHITE_BOARD, {
        message,
        username,
        cmd: "WHITEBOARD",
        fill:fill,
        cursor: this.cursorPos,
      });
    }
  
    clear({socket,roomId, username}: {socket: Socket,roomId:any,username:any})
    {
      this.canvasObjects = [];
      this.cavasObject = null;
       //pub clear command
       let message = ''
       let fill = this.isFillCursor;
       
       socket.to(roomId).emit(EVENTS.SERVER.WHITE_BOARD, {
         message,
         username,
         cmd: "CLEAR",
         fill:fill,
         cursor: this.cursorPos,
       });
    }

    onWebsocketMessage({socket,roomId, message, username}: {socket: Socket,roomId:any,message:any,username:any })
    {
      try
      {
        const json = JSON.parse(message);
        //console.log(json);
        //console.log(json.keypoint);
        
        let x_pos = json.finger[0];
        let y_pos = json.finger[1];
  
        this.cursorPos = { x:x_pos, y:y_pos };
  
        switch(json.keypoint)
        {
          case "Write":
            this.isFillCursor = true;
            if(this.cavasObject!== null)
            {
              this.drawLineTo(new Point(x_pos,y_pos), {socket,roomId,username});
            }else{
              this.startDraw(x_pos, y_pos, {socket,roomId,username});
  
            }
            break;
          case "Stop write":
            this.isFillCursor = false;
            this.stopDraw({socket,roomId,username});
            
            break;
          case "Save":
            this.isFillCursor = false;
            if(this.isSaving!==true)
            {
              this.isSaving = true;
              this.stopDraw({socket,roomId,username});

              //Save to Database Here
              let saveObjs = this.save();
              //console.log("save:",saveObjs);
              saveWhiteBoard(saveObjs);

            }


            break;
          case "Clear":
            this.isFillCursor = false;
            this.clear({socket,roomId,username});
            this.isSaving = false;
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

    save()
    {
      let lists = [];
      
      for (let i = 0; i < this.canvasObjects.length; i++) {
        let element = this.canvasObjects[i].save();

        lists.push(element);
      }
      
      return lists;
    }
}


export default DrawingCanvas;
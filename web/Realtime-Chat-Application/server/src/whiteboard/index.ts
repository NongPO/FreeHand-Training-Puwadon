import { Socket } from "socket.io";
import logger from "../utils/logger";

import DrawingCanvas from "./drawingCanvas";

const drawingCanvas: DrawingCanvas = new DrawingCanvas();



function whiteboard({socket,roomId, message, username}: {socket: Socket,roomId:any,message:any,username:any }) {

    try
    {
 
        drawingCanvas.onWebsocketMessage({socket,roomId, message, username});

    }catch(err:any)
    {
        logger.error(err);
    }

}


export default whiteboard;
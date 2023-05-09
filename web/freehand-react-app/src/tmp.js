


              // if(drawRef.current.IsDrawMode()===false)
              // {
              //   drawRef.current.startDraw(json.finger[0],json.finger[1] );
              // }else{
              //   drawRef.current.draw(json.finger[0],json.finger[1] );
              // }

              
if(wsRef.current === null)
{
  wsRef.current = new WebSocket(this.websocketURL);
  wsRef.current.onopen = (event) => {
    wsRef.current.send("Hey!!!!");
    console.log("WebSocket connected!");
  };

  wsRef.current.onmessage = webSocketOnMessage;

  wsRef.current.onclose = ()=>{
    console.log("WebSocket closed!");
  }
  
}
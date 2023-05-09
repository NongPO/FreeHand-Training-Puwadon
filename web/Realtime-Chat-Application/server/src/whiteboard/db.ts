import {MongoClient} from "mongodb";

// Replace the uri string with your connection string.
const uri = "mongodb+srv://NP_DB:1234@cluster1.v5rzuoi.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

export function saveWhiteBoard(dataJson:any)
{


    try {
        const database = client.db('freehanddb');
        const table0 = database.collection('table0');

        const date = new Date();
        let record = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}_${date.getHours()}:${date.getMinutes()}`;
    
        var myobj = { recorddate: date, name: "untitle" , data:dataJson};
    
      table0.insertOne(myobj)
      .then(()=>{
        console.log(record, ": 1 document inserted");
      }).catch((err)=>{
        console.error(err);
        });
    
        
    
        // // Query for a movie that has the title 'Back to the Future'
        // const query = { title: 'Back to the Future' };
        // const movie = await movies.findOne(query);
    
        // console.log(movie);
    
        
      } finally {
        // Ensures that the client will close when you finish/error
         
      }
}



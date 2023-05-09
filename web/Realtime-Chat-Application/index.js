const { MongoClient } = require("mongodb");


// Replace the uri string with your connection string.
const uri = "mongodb+srv://NP_DB:1234@cluster1.v5rzuoi.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('freehanddb');
    const table0 = database.collection('table0');

    var myobj = { recorddate: "2134", name: "untitle" , data:"jnoiompopo,po,p,p,p,o"};

  table0.insertOne(myobj, function(err, res) {
    if (err) throw err;
    
    console.log("1 document inserted");
   
  });

    

    // // Query for a movie that has the title 'Back to the Future'
    // const query = { title: 'Back to the Future' };
    // const movie = await movies.findOne(query);

    // console.log(movie);

    
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
const {client} = require('./connection')
client.connect();

client.query("select * from film", (err, res)=>{
  console.log(res.rows);  
});



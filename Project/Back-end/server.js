const express = require('express');
const app = express();

const client = require('./db/connection')
const graphql = require('graphql')

const {GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList} = graphql
const {graphqlHTTP}  = require('express-graphql')

const fs = require('fs');

const utenti = require('./MOCK_DATA.json')


/*
fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
});
*/

client.connect();
/*
client.query('select * from film', (err,res2)=>{
    console.log(res2.rows)
})


const getFilms = (req, res) =>{
    client.query('select * from film', (err,result)=>{
        res.send("ok")
    })}




const l = (req,res) => {client.query('select * from film')}
console.log(l.rows)

async function getAllFilm(){
    const rows = await client.query('select * from film');
    console.log(rows)
    return rows;
}
let ok = (req,res)=>{
    client.query('select * from film', (err,res2)=>{
        res.json(res2.rows)
    })
}


*/
//console.log(JSON.stringify(client.query('select * from film')))



// handling CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin",
        "http://localhost:4200");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const FilmType = new GraphQLObjectType({
    name: "Film",
    fields: () => ({
        film_id: {type: GraphQLInt},
        title: {type: GraphQLString},
        description: {type: GraphQLString}
    })
})

const UserType = new GraphQLObjectType({
    name: "User",
    fields: ()=>({
        id: {type: GraphQLInt},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        email: {type: GraphQLString}
       
    })
})

const variabile =   [{
    film_id: 89,
    title: 'Borrowers Bedazzled',
    description: 'A Brilliant Epistle of a Teacher And a Sumo Wrestler who must Defeat a Man in An Abandoned Fun House',
    release_year: 2006,
    language_id: 1,
    rental_duration: 7,
    rental_rate: '0.99',
    length: 63,
    replacement_cost: '22.99',
    rating: 'G',
    special_features: [ 'Commentaries', 'Deleted Scenes', 'Behind the Scenes' ],
    fulltext: "'abandon':20 'bedazzl':2 'borrow':1 'brilliant':4 'defeat':15 'epistl':5 'fun':21 'hous':22 'man':17 'must':14 'sumo':11 'teacher':8 'wrestler':12"
  },
  {
    film_id: 89,
    title: 'Borrowers Bedazzled',
    description: 'A Brilliant Epistle of a Teacher And a Sumo Wrestler who must Defeat a Man in An Abandoned Fun House',
    release_year: 2006,
    language_id: 1,
    rental_duration: 7,
    rental_rate: '0.99',
    length: 63,
    replacement_cost: '22.99',
    rating: 'G',
    special_features: [ 'Commentaries', 'Deleted Scenes', 'Behind the Scenes' ],
    fulltext: "'abandon':20 'bedazzl':2 'borrow':1 'brilliant':4 'defeat':15 'epistl':5 'fun':21 'hous':22 'man':17 'must':14 'sumo':11 'teacher':8 'wrestler':12"
  }]
//console.log(variabile)




async function getAllFilm(){
    try{
        const rows = await client.query('select * from film');
        const l = rows.rows
        return JSON.stringify(l)
    }
    catch(error){
        return null
    }
}
const righe = getAllFilm().then(function(result){return result})














const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields:{
        getAllFilm: {
            type: new GraphQLList(FilmType),
            resolve(parent, args){
            //console.log(getAllFilm().then(function(result){return result}))
            return async ()=>{await getAllFilm()}

            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields:{
        createFilm: {
            type: FilmType,
            args: {
                title:{type:GraphQLString},
            },
            resolve(parent, args) {
                return async ()=>{await getAllFilm()}
            }
        }
    }
})

const schema = new GraphQLSchema({query: RootQuery, mutation: Mutation})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

// route for handling requests from the Angular client
/*
app.get('/api/message', (req, res) => {
    client.query("select * from customer", (err, resd)=>{
        res.json(resd.rows); 
})})*/

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});